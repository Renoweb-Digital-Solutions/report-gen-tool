/**
 * Account billing settings rendered by /dashboard/settings. Real plan/history
 * data comes from the direct Next.js payment adapter; balances use the existing
 * authoritative credit API. Never infer a paid plan from the size of a wallet.
 * Decorative CSS waves respect reduced motion and carry no billing meaning.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  CreditCard,
  Layers3,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { getUserProfile } from "@/app/lib/api";
import { getCreditBalance, refreshCredits } from "@/app/features/credits/api";
import { getBillingSummary, startCheckout } from "./api";
import styles from "./BillingSettings.module.css";

// ============================================================================
// DISPLAY ADAPTERS
// Prices and allowances remain catalog-owned. Missing values stay unavailable,
// and provider callback query parameters never activate a subscription locally.
// ============================================================================
/** Format base currency units from the service, without guessing conversion rates. */
function money(amount, currency = "INR") {
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/** Render an optional service timestamp; malformed or absent dates stay explicit. */
function date(value) {
  const parsed = value ? new Date(value) : null;
  return parsed && Number.isFinite(parsed.getTime())
    ? parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not scheduled";
}

/** Assign visual treatments using documented billing fields, not hardcoded IDs. */
function planKind(plan) {
  if (plan?.amount === 0) return "free";
  if (plan?.billingType === "ONE_TIME") return "manual";
  return plan?.intervalType === "YEAR" ? "annual" : "monthly";
}

/** Choose a currently valid subscription, preferring paid access over starter access. */
function currentSubscription(subscriptions) {
  const valid = subscriptions.filter(
    (item) =>
      item.status === "ACTIVE" ||
      (item.status === "CANCELLED" &&
        item.cancelAtPeriodEnd &&
        new Date(item.currentPeriodEnd).getTime() > Date.now()),
  );
  return (
    valid.find((item) => !item.isFreeTier) ||
    valid.find((item) => item.isFreeTier) ||
    null
  );
}

/** Decorative repeating wave path. Two copies allow seamless horizontal motion. */
function Waterline() {
  return (
    <div className={styles.waterline} aria-hidden="true">
      {[0, 1, 2].map((layer) => (
        <svg key={layer} viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path d="M0 80C100 20 200 20 300 80S500 140 600 80S800 20 900 80S1100 140 1200 80V160H0Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Load and manage billing without persisting financial/customer state locally.
 * A ref blocks duplicate checkout clicks before React commits its busy state.
 * Read polling runs only after a provider return, at most six times, and is
 * cleaned up on navigation. Payment remains pending until the service says so.
 */
export default function BillingSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [billing, setBilling] = useState(null);
  const [balance, setBalance] = useState(null);
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [returned, setReturned] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(false);
  const checkoutDialog = useRef(null);

  /** Refresh account-private data; failed reads clear stale financial values. */
  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [account, summary, wallet] = await Promise.all([
        getUserProfile(),
        getBillingSummary(),
        getCreditBalance().catch(() => null),
      ]);
      if (!mounted.current) return;
      setProfile(account);
      setBilling(summary);
      setBalance(wallet);
      setError("");
    } catch (failure) {
      if (!mounted.current) return;
      setBilling(null);
      setBalance(null);
      setError(
        failure.message || "Billing could not be loaded. Please try again.",
      );
      if (failure.status === 401) router.replace("/?login=true");
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [router]);

  useEffect(() => {
    mounted.current = true;
    const isReturn =
      new URLSearchParams(window.location.search).get("checkout") === "return";
    setReturned(isReturn);
    load();
    let attempts = 0;
    const timer = isReturn
      ? setInterval(() => {
          attempts += 1;
          load();
          refreshCredits();
          if (attempts >= 6) clearInterval(timer);
        }, 5000)
      : null;
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [load]);

  // Native dialog provides focus trapping, Escape handling, and focus return.
  // Keep customer phone in memory only; the actual email comes from the session.
  useEffect(() => {
    if (selected && !checkoutDialog.current?.open)
      checkoutDialog.current?.showModal();
    if (!selected && checkoutDialog.current?.open)
      checkoutDialog.current.close();
  }, [selected]);

  /** Launch exactly one checkout; re-read history after SDK return/cancellation. */
  async function checkout(event) {
    event.preventDefault();
    if (lock.current || !selected) return;
    lock.current = true;
    setBusy(true);
    setCheckoutError("");
    try {
      await startCheckout(selected.planId, phone);
      if (mounted.current) {
        setSelected(null);
        setReturned(true);
        await load();
        refreshCredits();
      }
    } catch (failure) {
      if (mounted.current)
        setCheckoutError(failure.message || "Checkout could not be opened.");
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  const plans = billing?.plans || [];
  const subscription = currentSubscription(billing?.subscriptions || []);
  const currentPlan = plans.find(
    (plan) => plan.planId === subscription?.planId,
  );
  const kind = planKind(currentPlan);
  // Plans have already been filtered on the Next.js server using FastAPI's
  // signed region. There is no browser-controlled country/currency selector.
  const visiblePlans = [...plans].sort(
    (left, right) => left.amount - right.amount,
  );
  const activity = [
    ...(billing?.orders || []).map((record) => ({
      ...record,
      type: "One-time payment",
      id: record.orderId,
      amount: record.orderAmount,
      currency: record.orderCurrency,
    })),
    ...(billing?.subscriptions || []).map((record) => ({
      ...record,
      type: record.isFreeTier ? "Starter allocation" : "Subscription",
      id: record.subscriptionId,
      amount: record.planAmount,
      currency: record.planCurrency,
    })),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.shell}>
        <Link href="/dashboard" className={styles.back}>
          <ArrowLeft size={15} /> Back to workspace
        </Link>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>YOUR WORKSPACE, YOUR WAY</p>
            <h1>
              Settings<span>.</span>
            </h1>
          </div>
          <div className={styles.account}>
            <span>{profile?.username?.slice(0, 1).toUpperCase() || "F"}</span>
            <div>
              <strong>{profile?.username || "Your account"}</strong>
              <p>Flawdits workspace</p>
            </div>
          </div>
        </header>
        {/* Billing is a standalone page. Account/security navigation belongs to
            the shared navbar dropdown rather than a misleading settings tab bar. */}

        {/* Feedback is distinct from plan state: provider redirects never claim
            successful payment, and errors offer an explicit read-only refresh. */}
        {returned && (
          <div className={styles.notice} role="status">
            <RefreshCw size={17} />
            <p>
              You’re back. We’re checking your plan and credits with the payment
              service. Pending payments may take a moment to update.
            </p>
            <button onClick={load} disabled={refreshing}>
              Refresh
            </button>
          </div>
        )}
        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
            <button onClick={load} disabled={refreshing}>
              Try again
            </button>
          </div>
        )}
        {loading ? (
          <div className={styles.loading} role="status">
            <Loader2 size={26} className={styles.spin} /> Loading your billing
            space…
          </div>
        ) : (
          <>
            <section
              className={styles.overview}
              aria-label="Current plan and wallet"
            >
              <article className={`${styles.membership} ${styles[kind]}`}>
                <div className={styles.memberTop}>
                  <span>
                    <Layers3 size={16} /> FLAWDITS MEMBERSHIP
                  </span>
                  <span className={styles.status}>
                    <i />
                    {subscription
                      ? subscription.cancelAtPeriodEnd
                        ? "Ends this period"
                        : "Active plan"
                      : billing
                        ? "No active plan"
                        : "Unavailable"}
                  </span>
                </div>
                <div className={styles.memberContent}>
                  <p>ROOM FOR YOUR NEXT BIG IDEA</p>
                  <h2>
                    {currentPlan?.name ||
                      (subscription?.isFreeTier
                        ? "Free starter"
                        : subscription
                          ? "Your membership"
                          : "A fresh perspective.")}
                  </h2>
                  <span>
                    {subscription
                      ? currentPlan?.description ||
                        "Your current Flawdits membership."
                      : "Pick a plan below. Find the details that make the difference."}
                  </span>
                </div>
                <div className={styles.memberBottom}>
                  <div>
                    <small>PLAN ALLOCATION</small>
                    <strong>
                      {subscription
                        ? `${subscription.creditsPerCycle ?? "—"} credits`
                        : "Ready when you are"}
                    </strong>
                  </div>
                  <div>
                    <small>
                      {subscription?.cancelAtPeriodEnd
                        ? "ACCESS UNTIL"
                        : "CURRENT PERIOD ENDS"}
                    </small>
                    <strong>
                      {subscription?.isFreeTier
                        ? "Starter access"
                        : date(subscription?.currentPeriodEnd)}
                    </strong>
                  </div>
                  <a href="#plans" aria-label="Explore available plans">
                    <ArrowUpRight size={23} />
                  </a>
                </div>
                <Waterline />
              </article>
              <article className={styles.wallet}>
                <div className={styles.walletTop}>
                  <span>THE CREDIT EDIT</span>
                  <Zap size={19} />
                </div>
                <div className={styles.creditOrb}>
                  <div>
                    <span>
                      {balance
                        ? balance.availableCredits.toLocaleString("en-IN")
                        : "—"}
                    </span>
                    <small>AVAILABLE CREDITS</small>
                  </div>
                </div>
                <div className={styles.walletFoot}>
                  <span>Reserved for running audits</span>
                  <strong>{balance?.reservedCredits ?? "—"}</strong>
                </div>
                <p>
                  {balance
                    ? "One wallet. Every audit, a little more clarity."
                    : "Wallet balance is temporarily unavailable."}
                </p>
              </article>
            </section>

            <section
              id="plans"
              className={styles.plansSection}
              aria-labelledby="plans-title"
            >
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>MAKE SPACE FOR MORE</p>
                  <h2 id="plans-title">A plan for your momentum.</h2>
                  <p>Start small, go all in, or keep it on your terms.</p>
                </div>
                {billing?.region?.currency && (
                  <p className={styles.currency}>
                    {billing.region.label}
                    <strong>Billed in {billing.region.currency}</strong>
                  </p>
                )}
              </div>
              <div className={styles.planGrid}>
                {visiblePlans.map((plan) => {
                  const variant = planKind(plan);
                  const current = subscription?.planId === plan.planId;
                  const free = variant === "free";
                  const recurring = plan.billingType === "SUBSCRIPTION";
                  const perCycle =
                    plan.creditsPerCycle || plan.creditsAllocated;
                  return (
                    <article
                      key={plan.planId}
                      className={`${styles.plan} ${styles[variant]}`}
                    >
                      <div className={styles.planTop}>
                        <span className={styles.planIcon}>
                          {free ? (
                            <Sparkles size={21} />
                          ) : variant === "manual" ? (
                            <Waves size={21} />
                          ) : (
                            <Zap size={21} />
                          )}
                        </span>
                        <span className={styles.planBadge}>
                          {current
                            ? "YOUR PLAN"
                            : variant === "annual"
                              ? "THE LONG VIEW"
                              : variant === "manual"
                                ? "NO AUTO-RENEWAL"
                                : free
                                  ? "FIRST THINGS FIRST"
                                  : "KEEP EXPLORING"}
                        </span>
                      </div>
                      <h3>{plan.name}</h3>
                      <p className={styles.planDescription}>
                        {plan.description}
                      </p>
                      <div className={styles.price}>
                        {money(plan.amount, plan.currency)}
                        <small>
                          {free
                            ? " / starter"
                            : variant === "annual"
                              ? " / year"
                              : variant === "manual"
                                ? " / pass"
                                : " / month"}
                        </small>
                      </div>
                      <ul className={styles.benefits}>
                        <li>
                          <Check size={15} />
                          {free
                            ? `${plan.creditsAllocated} starter credits`
                            : `${perCycle} credits${variant === "annual" ? " every month" : variant === "manual" ? " for this pass" : " per cycle"}`}
                        </li>
                        <li>
                          <Check size={15} />
                          {free
                            ? "No card or payment mandate"
                            : recurring
                              ? "Automatic renewal via Cashfree"
                              : `${plan.metadata?.accessDurationDays || 30}-day access, paid once`}
                        </li>
                        <li>
                          <Check size={15} />
                          {variant === "annual"
                            ? `${plan.totalCycles || 12} monthly credit allocations`
                            : free
                              ? "Included with new registration"
                              : recurring
                                ? "Stay focused on your next audit"
                                : "You decide when to renew"}
                        </li>
                      </ul>
                      <button
                        disabled={!billing || current || free || busy}
                        className={styles.planButton}
                        onClick={() => {
                          setCheckoutError("");
                          setSelected(plan);
                        }}
                      >
                        {current
                          ? "Your current plan"
                          : free
                            ? "Included at signup"
                            : variant === "manual"
                              ? "Get the pass"
                              : "Choose this plan"}
                        {!current && !free && <ArrowUpRight size={17} />}
                      </button>
                    </article>
                  );
                })}
              </div>
              {billing && visiblePlans.length === 0 && (
                <p className={styles.empty}>
                  {billing.region?.country
                    ? "Plans are not available in your region yet."
                    : "We could not verify your billing region. Please try again later."}
                </p>
              )}
              <p className={styles.secureNote}>
                <LockKeyhole size={14} /> Secure checkout by Cashfree. Plan
                prices come directly from our billing service.
              </p>
              {/* The local DB-IP country dataset requires attribution on pages
                  using its results. No customer data is embedded in this link. */}
              <p className={styles.geoAttribution}>
                <a
                  href="https://db-ip.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                >
                  IP Geolocation by DB-IP
                </a>
              </p>
            </section>

            <section
              className={styles.activity}
              aria-labelledby="activity-title"
            >
              <div className={styles.activityHeading}>
                <div>
                  <p className={styles.eyebrow}>THE PAPER TRAIL</p>
                  <h2 id="activity-title">Payment activity</h2>
                </div>
                <button
                  onClick={load}
                  disabled={refreshing}
                  aria-label="Refresh payment activity"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? styles.spin : ""}
                  />
                </button>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Plan / payment</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <span className={styles.activityIcon}>
                            <ArrowDownLeft size={18} />
                          </span>
                          <div>
                            <strong>
                              {plans.find(
                                (plan) => plan.planId === record.planId,
                              )?.name || record.planId}
                            </strong>
                            <small>{record.type}</small>
                          </div>
                        </td>
                        <td>{date(record.createdAt)}</td>
                        <td>{money(record.amount, record.currency)}</td>
                        <td>
                          <span
                            className={styles.recordStatus}
                            data-state={record.status}
                          >
                            {record.status?.replaceAll("_", " ") || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {activity.length === 0 && (
                <div className={styles.empty}>
                  <CreditCard size={25} />
                  <p>
                    {billing
                      ? "Your next chapter starts here."
                      : "Payment activity is unavailable."}
                  </p>
                  <small>
                    {billing
                      ? "Your subscriptions and one-time payments will appear in this space."
                      : "Refresh to retrieve your billing records."}
                  </small>
                </div>
              )}
            </section>
            <footer className={styles.footer}>
              <span>
                <Sparkles size={15} /> More clarity. Better decisions.
              </span>
              <Link href="/dashboard/profile#support">
                Need a hand? <ChevronRight size={14} />
              </Link>
            </footer>
          </>
        )}
      </main>

      {/* Checkout details stay inside an accessible modal; the provider handles
          all bank/card data. No invented phone number is sent to the gateway. */}
      <dialog
        ref={checkoutDialog}
        className={styles.dialog}
        aria-labelledby="checkout-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
          else setSelected(null);
        }}
        onClose={() => {
          if (!busy) setSelected(null);
        }}
      >
        <form onSubmit={checkout}>
          <div className={styles.dialogIcon}>
            <LockKeyhole size={24} />
          </div>
          <p className={styles.eyebrow}>YOUR NEXT CHAPTER</p>
          <h2 id="checkout-title">Let’s make it official.</h2>
          <p>
            {selected?.name} · {money(selected?.amount, selected?.currency)}
          </p>
          <label htmlFor="billing-phone">Indian mobile number</label>
          <input
            id="billing-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="10-digit mobile number"
            required
            value={phone}
            disabled={busy}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />
          <small>
            Cashfree uses this number to set up your payment. Bank and card
            details stay with Cashfree.
          </small>
          {checkoutError && (
            <p className={styles.checkoutError} role="alert">
              {checkoutError}
            </p>
          )}
          <button
            type="submit"
            className={styles.continueButton}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 size={17} className={styles.spin} /> Opening checkout…
              </>
            ) : (
              <>
                Continue to Cashfree <ArrowUpRight size={17} />
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            disabled={busy}
            onClick={() => setSelected(null)}
          >
            Maybe later
          </button>
        </form>
      </dialog>
    </div>
  );
}
