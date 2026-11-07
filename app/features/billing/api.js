/**
 * Billing transport for BillingSettings. A cookie-authenticated FastAPI request
 * obtains a two-minute, billing-only identity capability. Purchases and billing
 * reads then use Next.js -> payment microservice directly, with no MongoDB or
 * FastAPI payment proxy. The capability is kept in memory, never localStorage.
 */
import { browserFetch } from "@/app/features/auth/api";

const AUTH_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
let access = null;
let accessRequest = null;
let sdkRequest = null;
let accessGeneration = 0;

/** Invalidate both cached access and an issuance response still in flight. */
function clearBillingAccess() {
  access = null;
  accessGeneration += 1;
}

// Authentication events outlive the settings component but not this JS module.
// Clear cached billing access on logout and cross-tab session-hint changes so a
// different account signing in cannot inherit the previous account's capability.
if (typeof window !== "undefined") {
  window.addEventListener("auth-expired", clearBillingAccess);
  window.addEventListener("storage", (event) => {
    if (event.key === "flawdits_user_session_hint") clearBillingAccess();
  });
}

// ============================================================================
// EPHEMERAL BILLING ACCESS AND ERROR HANDLING
// Refresh before expiry; concurrent reads share issuance but never share writes.
// An authorization failure drops the credential. Never automatically retry a
// checkout: an unknown network outcome may already have initialized a mandate.
// ============================================================================
/** Obtain a fresh scoped identity from the current, revocable user session. */
async function billingAccess() {
  if (access && access.expiresAt * 1000 > Date.now() + 10000) return access;
  if (!accessRequest) {
    // A logout during issuance must not let the old response repopulate access
    // after a different account signs in on this tab or another browser tab.
    const generation = accessGeneration;
    accessRequest = (async () => {
      const response = await browserFetch(`${AUTH_BASE}/auth/billing-session`, {
        method: "POST",
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Sign in again to open billing.",
        );
        error.status = response.status;
        throw error;
      }
      if (generation !== accessGeneration) {
        throw new Error("Your account changed. Refresh billing to continue.");
      }
      access = data;
      return data;
    })().finally(() => {
      accessRequest = null;
    });
  }
  return accessRequest;
}

/** Send only UI intent; the Next.js server reconstructs customer ownership. */
async function request(body) {
  const credential = await billingAccess();
  const response = await fetch("/api/billing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${credential.token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    // The Next route may perform a plan read followed by a checkout write, each
    // bounded at 20 seconds. Let that operation finish before timing out here.
    signal: AbortSignal.timeout(45000),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) access = null;
    const error = new Error(data.message || "Billing could not be loaded.");
    error.status = response.status;
    throw error;
  }
  return data;
}

/** Load real plans and provider-confirmed customer billing records together. */
export function getBillingSummary() {
  return request({ action: "summary" });
}

// ============================================================================
// CASHFREE CHECKOUT
// Load the fixed official v3 SDK only when a user requests checkout. No payment
// credentials, prices, or database drivers are bundled into this module.
// ============================================================================
/** Load Cashfree once; retry is allowed only for loading the public SDK asset. */
function cashfreeSdk() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (!sdkRequest) {
    sdkRequest = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      const timeout = setTimeout(
        () =>
          finish(
            new Error("Checkout took too long to load. Please try again."),
          ),
        15000,
      );
      /** Release handlers/timers so failed downloads do not leave hanging state. */
      function finish(error) {
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error || !window.Cashfree) {
          script.remove();
          sdkRequest = null;
          reject(error || new Error("Checkout could not be loaded."));
        } else resolve(window.Cashfree);
      }
      script.onload = () => finish();
      script.onerror = () =>
        finish(
          new Error(
            "Checkout could not be loaded. Please check your connection.",
          ),
        );
      document.head.appendChild(script);
    });
  }
  return sdkRequest;
}

/** Initialize the documented recurring/manual flow and open hosted Cashfree UI. */
export async function startCheckout(planId, phone) {
  const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
  if (!["sandbox", "production"].includes(mode))
    throw new Error("Checkout is not configured. Please contact support.");
  // Load the SDK before creating a checkout so an asset-download failure does
  // not leave an unnecessary pending order or mandate at the payment service.
  const Cashfree = await cashfreeSdk();
  const checkout = await request({ action: "checkout", planId, phone });
  const link = checkout.hostedLink;
  if (typeof link === "string" && /^https:\/\//.test(link)) {
    const url = new URL(link);
    // Only Cashfree-hosted HTTPS links are payment destinations. Never navigate
    // to the README's localhost simulator or an arbitrary upstream URL.
    if (
      !url.username &&
      !url.password &&
      /(^|\.)cashfree\.com$/.test(url.hostname)
    ) {
      window.location.assign(url.href);
      return;
    }
  }
  if (
    typeof checkout.sessionId !== "string" ||
    !checkout.sessionId ||
    checkout.sessionId.includes("://")
  ) {
    throw new Error(
      "Checkout did not return a valid session. Refresh payment activity before retrying.",
    );
  }
  const cashfree = Cashfree({ mode });
  const result =
    checkout.kind === "subscription"
      ? await cashfree.subscriptionsCheckout({
          subsSessionId: checkout.sessionId,
          redirectTarget: "_self",
        })
      : await cashfree.checkout({
          paymentSessionId: checkout.sessionId,
          redirectTarget: "_self",
        });
  if (result?.error)
    throw new Error(
      "Checkout was not completed. Check your payment activity before trying again.",
    );
  // Returning from the SDK is not proof of payment; Settings re-reads service
  // status and balance, leaving pending webhook/queue fulfillment visible.
  return result;
}
