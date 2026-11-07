/**
 * Direct Next.js-to-payment-service adapter consumed by features/billing/api.js.
 * No MongoDB code or FastAPI payment proxy belongs here. FastAPI issues a scoped,
 * 120-second identity capability after checking its cookie session; this route
 * verifies it locally before talking to the unchanged payment microservice.
 * Plan prices, order status, and subscription state remain payment-service data.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

// ============================================================================
// CAPABILITY VALIDATION AND PRIVATE CONFIGURATION
// The signer is shared with FastAPI only, never the payment microservice or the
// browser. Restrict audience, lifetime, and origin; tokens stay in tab memory.
// Session revocation stops renewal; an issued token lasts at most 120 seconds.
// ============================================================================
/** Build a safe HTTP failure without reflecting private upstream error bodies. */
function fail(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

/** Verify the signed owner; body/query fields never select a billing identity. */
function identity(request) {
  const secret = process.env.PAYMENTS_SIGNING_SECRET || "";
  if (secret.length < 32)
    throw fail("Billing is not configured. Please contact support.", 503);
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || token.length > 4096)
    throw fail("Refresh billing access and try again.", 401);
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  const actual = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted))
    throw fail("Invalid billing access.", 401);
  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw fail("Invalid billing access.", 401);
  }
  const now = Math.floor(Date.now() / 1000);
  if (
    !claims ||
    typeof claims.sub !== "string" ||
    !claims.sub ||
    typeof claims.email !== "string" ||
    typeof claims.name !== "string" ||
    claims.application !== "FLAWDITS" ||
    claims.iss !== "flawdits" ||
    claims.aud !== "flawdits-payments" ||
    !Number.isInteger(claims.iat) ||
    !Number.isInteger(claims.exp) ||
    claims.exp <= now ||
    claims.iat > now + 5 ||
    claims.exp <= claims.iat ||
    claims.exp - claims.iat > 120 ||
    typeof claims.origin !== "string" ||
    request.headers.get("origin") !== claims.origin
  ) {
    throw fail("Billing access expired. Refresh and try again.", 401);
  }
  // FastAPI, not the browser, resolves the IP country and signs this policy.
  // Refuse older/malformed capabilities instead of silently exposing all prices.
  const region = claims.billingRegion;
  const currencies = { IN: "INR", US: "USD", EU: "EUR" };
  if (
    !region ||
    (region.currency !== null &&
      (!Object.hasOwn(currencies, region.market) ||
        currencies[region.market] !== region.currency)) ||
    (region.currency === null && region.market !== null)
  ) {
    throw fail("Refresh billing to verify your region.", 401);
  }
  return claims;
}

/** Call only the configured service origin; never follow credentialed redirects. */
async function paymentRequest(path, body) {
  const base = process.env.PAYMENTS_BACKEND_URL?.replace(/\/$/, "");
  let url;
  try {
    url = new URL(base);
  } catch {
    throw fail("Billing is not configured. Please contact support.", 503);
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw fail("Invalid billing service configuration.", 503);
  let response;
  let data;
  try {
    response = await fetch(`${url.origin}/api/v1/${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    data = await response.json();
  } catch {
    // An unknown checkout outcome is not safe to replay automatically. The user
    // can refresh authoritative history before deciding whether to try again.
    throw fail(
      "Billing could not be confirmed. Refresh payment activity before trying again.",
      503,
    );
  }
  if (!response.ok || data?.success !== true) {
    throw fail(
      "The payment service could not complete this request. Please try again later.",
      response.status >= 500 ? 503 : 400,
    );
  }
  return data;
}

// ============================================================================
// SAFE DATA PROJECTIONS
// Drop raw gateway payloads and provider session credentials from history. Only
// checkout initialization returns the exact session value needed by Cashfree.
// ============================================================================
/** Select public catalog fields while retaining service-owned monetary values. */
function projectPlan(plan) {
  return Object.fromEntries(
    [
      "planId",
      "name",
      "description",
      "application",
      "billingType",
      "currency",
      "amount",
      "intervalType",
      "intervals",
      "creditsAllocated",
      "creditsPerCycle",
      "totalCycles",
      "metadata",
    ].map((key) => [key, plan[key]]),
  );
}

/** Remove email/phone/provider references from the current user's history rows. */
function projectRecord(record) {
  return Object.fromEntries(
    [
      "subscriptionId",
      "orderId",
      "planId",
      "status",
      "authStatus",
      "isFreeTier",
      "planAmount",
      "planCurrency",
      "orderAmount",
      "orderCurrency",
      "creditsPerCycle",
      "creditsAllocated",
      "currentPeriodStart",
      "currentPeriodEnd",
      "cancelAtPeriodEnd",
      "createdAt",
      "paidAt",
      "totalCycles",
    ].map((key) => [key, record[key]]),
  );
}

/**
 * Load billing or initialize one selected paid checkout. There is deliberately
 * no free-grant action: only FastAPI registration can invoke that flow here.
 * No payment is marked successful based on a redirect or browser callback.
 */
export async function POST(request) {
  try {
    const owner = identity(request);
    const text = await request.text();
    if (text.length > 8192) throw fail("Billing request is too large.", 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw fail("Invalid billing request.");
    }
    if (!body || typeof body !== "object")
      throw fail("Invalid billing request.");
    if (body.action === "summary") {
      const userId = encodeURIComponent(owner.sub);
      const [catalog, subscriptions, orders] = await Promise.all([
        // Currency is signed by FastAPI and also checked below in case the
        // upstream catalog ignores its query filter or returns malformed rows.
        paymentRequest(
          `plans?application=FLAWDITS${owner.billingRegion.currency ? `&currency=${owner.billingRegion.currency}` : ""}`,
        ),
        paymentRequest(`subscriptions/user/${userId}`),
        paymentRequest(`orders/user/${userId}`),
      ]);
      if (
        !Array.isArray(catalog.plans) ||
        !Array.isArray(subscriptions.subscriptions) ||
        !Array.isArray(orders.orders)
      ) {
        throw fail(
          "Billing returned incomplete information. Please refresh.",
          502,
        );
      }
      // Even with the scoped URL, validate ownership/application on every row
      // before returning it. A malformed upstream response must not leak data.
      const owned = (row) =>
        row.userId === owner.sub && row.application === "FLAWDITS";
      return Response.json(
        {
          plans: catalog.plans
            .filter(
              (plan) =>
                plan.application === "FLAWDITS" &&
                plan.active &&
                owner.billingRegion.currency !== null &&
                plan.currency === owner.billingRegion.currency,
            )
            .map(projectPlan),
          subscriptions: subscriptions.subscriptions
            .filter(owned)
            .map(projectRecord),
          orders: orders.orders.filter(owned).map(projectRecord),
          // The UI renders this fixed region label; it cannot switch currency.
          // Historical records remain visible even if the customer has moved.
          region: owner.billingRegion,
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    if (body.action !== "checkout" || typeof body.planId !== "string")
      throw fail("Choose a plan to continue.");
    if (!owner.billingRegion.currency) {
      throw fail(
        "Purchases are unavailable until your billing region is eligible.",
        403,
      );
    }
    if (!/^\d{10}$/.test(body.phone || ""))
      throw fail("Enter a 10-digit Indian mobile number.");
    const { plan } = await paymentRequest(
      `plans/${encodeURIComponent(body.planId)}`,
    );
    if (
      !plan ||
      plan.application !== "FLAWDITS" ||
      !plan.active ||
      !Number.isFinite(plan.amount) ||
      plan.amount <= 0 ||
      !["SUBSCRIPTION", "ONE_TIME"].includes(plan.billingType)
    )
      throw fail("Choose an active paid Flawdits plan.");
    // Catalog hiding alone is not enforcement: a hand-written request for a
    // different region's plan must be rejected before any gateway initialization.
    if (plan.currency !== owner.billingRegion.currency) {
      throw fail("This plan is not available in your billing region.", 403);
    }
    const recurring = plan.billingType === "SUBSCRIPTION";
    const returnUrl = `${owner.origin}/dashboard/settings?checkout=return&${recurring ? "sub_id={sub_id}" : "order_id={order_id}"}`;
    const data = await paymentRequest(recurring ? "subscriptions" : "orders", {
      userId: owner.sub,
      application: "FLAWDITS",
      planId: plan.planId,
      customerName: owner.name,
      customerEmail: owner.email,
      customerPhone: body.phone,
      returnUrl,
    });
    return Response.json(
      {
        kind: recurring ? "subscription" : "order",
        sessionId: recurring ? data.authLink : data.paymentSessionId,
        hostedLink: recurring ? data.authLink : data.paymentLink,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return Response.json(
      {
        message: error.status
          ? error.message
          : "Billing is temporarily unavailable.",
      },
      {
        status: error.status || 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
