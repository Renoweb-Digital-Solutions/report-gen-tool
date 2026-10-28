"use client";

/**
 * Header wallet control and accessible recovery panel, supplied to Navbar by dashboard/page.js.
 * Amounts come exclusively from the account-cookie FastAPI balance endpoint.
 * Failure clears stale values; active/settled jobs are read independently so a
 * wallet outage cannot hide an existing recovery result. No purchase UI is
 * implied because this repository has no verified payment integration.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Coins,
  RefreshCw,
  ArrowUpRight,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
} from "lucide-react";
import styles from "./CreditBalance.module.css";
import { getCreditBalance, getCreditJobs, recoverCreditJob } from "./api";

const LABELS = {
  website: "Website Anatomy",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  linkedin_personal: "LinkedIn Profile",
  gmb: "GMB",
  visual: "Visual Brand Match",
  ui_ux: "UI/UX",
  ads: "Ads Library",
  full: "Full Report",
};

// ============================================================================
// ACCOUNT WALLET AND RECOVERY STATE
// The component exists only after dashboard auth resolves. Refresh sequence IDs
// reject stale reads; listeners/timers and recovery polling are cleaned up on
// unmount. User-facing state contains balances/job summaries, never report input.
// ============================================================================
export default function CreditBalance({ onRecovered }) {
  const [balance, setBalance] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [walletError, setWalletError] = useState("");
  const [jobsError, setJobsError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const dialogId = useId();
  const trigger = useRef(null);
  const panel = useRef(null);
  const [busy, setBusy] = useState(false);
  const [recovering, setRecovering] = useState("");
  const [notice, setNotice] = useState("");
  const generation = useRef(0);
  const alive = useRef(false);
  const recovery = useRef(null);

  /** Refresh the two independent customer reads without retaining a stale wallet. */
  const refresh = useCallback(async () => {
    const sequence = ++generation.current;
    setBusy(true);
    const [wallet, history] = await Promise.allSettled([
      getCreditBalance(),
      getCreditJobs(),
    ]);
    if (!alive.current || sequence !== generation.current) return;
    setBalance(wallet.status === "fulfilled" ? wallet.value : null);
    setJobs(history.status === "fulfilled" ? history.value.jobs : []);
    // Wallet and history can fail independently; one must not mask the other.
    setWalletError(wallet.status === "rejected" ? wallet.reason.message : "");
    setJobsError(
      history.status === "rejected"
        ? "Recent audits could not be loaded. Please refresh to try again."
        : "",
    );
    setBusy(false);
  }, []);

  useEffect(() => {
    alive.current = true;
    refresh();
    /** Periodic reads pause for hidden tabs; returning to the page refreshes them. */
    const visibleRefresh = () => {
      if (!document.hidden) refresh();
    };
    const timer = setInterval(visibleRefresh, 30000);
    window.addEventListener("credits-changed", refresh);
    document.addEventListener("visibilitychange", visibleRefresh);
    return () => {
      alive.current = false;
      generation.current += 1;
      clearInterval(timer);
      recovery.current?.abort();
      window.removeEventListener("credits-changed", refresh);
      document.removeEventListener("visibilitychange", visibleRefresh);
    };
  }, [refresh]);

  /** Recover an existing job without another reservation, scraper or AI request. */
  async function open(job) {
    const controller = new AbortController();
    recovery.current = controller;
    setRecovering(job.job_id);
    setNotice("Loading the existing audit...");
    try {
      const result = await recoverCreditJob(
        job.job_id,
        (message) => {
          if (alive.current) setNotice(message);
        },
        controller.signal,
      );
      if (!alive.current || controller.signal.aborted) return;
      onRecovered(job.module, result);
      // Customer copy describes the outcome, never internal reservation states.
      setNotice("Report opened. No additional credits were charged.");
      // Opening the report should reveal its dashboard preview immediately;
      // keeping the account overlay open would hide the action's result.
      setExpanded(false);
    } catch (failure) {
      if (alive.current && !controller.signal.aborted)
        setNotice(failure.message);
    } finally {
      if (alive.current && recovery.current === controller) {
        setRecovering("");
        refresh();
      }
    }
  }

  // ========================================================================
  // DIALOG LIFECYCLE AND RECENT AUDITS
  // Portal rendering escapes the navbar's backdrop-filter containing block.
  // Escape, outside click and a close button share the same dismiss path. Closing
  // cancels only recovery observation; it cannot cancel or charge the server job.
  // ========================================================================
  /** Dismiss the panel and stop following a job without changing its execution. */
  const close = useCallback(() => {
    recovery.current?.abort();
    setRecovering("");
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const element = panel.current;
    element?.querySelector("button")?.focus();

    /** Keep keyboard focus inside this modal and return Escape to the trigger. */
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...element.querySelectorAll(
          'button:not(:disabled), a[href], [tabindex="0"]',
        ),
      ];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      trigger.current?.focus();
    };
  }, [expanded, close]);

  /** Translate private billing states into customer report outcomes and charges. */
  function describe(job) {
    if (job.state === "FAILED")
      return { label: "Not completed", kind: "failed", Icon: AlertCircle };
    if (job.state === "COMPLETED")
      return job.credits.status === "CAPTURED"
        ? {
            label: `${job.credits.captured.toLocaleString()} credits charged`,
            kind: "complete",
            Icon: CheckCircle2,
          }
        : {
            label: "Report ready · no credits charged",
            kind: "complete",
            Icon: CheckCircle2,
          };
    if (job.state.endsWith("PENDING"))
      return { label: "Preparing your report", kind: "pending", Icon: Clock3 };
    return {
      label:
        job.state === "RESERVED" ? "Waiting to start" : "Audit in progress",
      kind: "pending",
      Icon: Clock3,
    };
  }

  /** Format only real server timestamps; invalid historical rows omit the date. */
  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  }

  const activity = jobs.slice(0, 6);
  const available = balance ? balance.availableCredits.toLocaleString() : null;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={expanded ? dialogId : undefined}
        aria-label={
          balance
            ? `Credits: ${available} available. Open balance and recent audits.`
            : "Open credit balance and recent audits"
        }
        onClick={() => {
          setExpanded(true);
          refresh();
        }}
      >
        <span className={styles.triggerIcon}>
          <Coins size={17} aria-hidden="true" />
        </span>
        <span className={styles.triggerValue}>
          {available ?? (busy ? "Loading..." : "Unavailable")}
        </span>
        <span className={styles.triggerLabel}>credits</span>
        <ArrowUpRight
          size={13}
          className={styles.triggerArrow}
          aria-hidden="true"
        />
      </button>
      {expanded &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <section
              ref={panel}
              id={dialogId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${dialogId}-title`}
              aria-describedby={`${dialogId}-description`}
              className={styles.panel}
            >
              <header className={styles.header}>
                <div className={styles.headingIcon}>
                  <Coins size={22} aria-hidden="true" />
                </div>
                <div className={styles.heading}>
                  <p className={styles.eyebrow}>YOUR ACCOUNT</p>
                  <h2 id={`${dialogId}-title`}>Credits & activity</h2>
                </div>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={close}
                  aria-label="Close credits panel"
                >
                  <X size={19} />
                </button>
              </header>

              <div className={styles.content}>
                <p id={`${dialogId}-description`} className={styles.intro}>
                  Your balance, active audits, and recently completed reports.
                </p>
                {/* Present the spendable balance only. Holds and reservation totals
                  remain internal; customers need their balance and actual usage. */}
                <div className={styles.balances} aria-busy={busy}>
                  <div className={styles.available}>
                    <span className={styles.statLabel}>Your balance</span>
                    <strong>{available ?? "\u2014"}</strong>
                    <span className={styles.statCaption}>
                      {balance
                        ? "credits"
                        : busy
                          ? "Loading balance..."
                          : "Balance unavailable"}
                    </span>
                  </div>
                </div>
                {walletError && (
                  <p className={styles.error} role="status">
                    <AlertCircle size={15} aria-hidden="true" />
                    <span>{walletError}</span>
                  </p>
                )}

                <div className={styles.sectionHeading}>
                  <h3>Recent audits</h3>
                  <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={refresh}
                    disabled={busy}
                  >
                    <RefreshCw size={13} aria-hidden="true" />
                    {busy ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
                {jobsError ? (
                  <p className={styles.error} role="status">
                    <AlertCircle size={15} aria-hidden="true" />
                    <span>{jobsError}</span>
                  </p>
                ) : activity.length ? (
                  <ul className={styles.activityList}>
                    {activity.map((job) => {
                      // Completed rows stay informative after their recovery copy
                      // expires; only server-marked recoverable output can reopen.
                      const status = describe(job);
                      const canOpen =
                        job.state !== "FAILED" &&
                        (job.state !== "COMPLETED" || job.recoverable);
                      return (
                        <li key={job.job_id} className={styles.activity}>
                          <span className={styles.activityIcon}>
                            <FileText size={17} aria-hidden="true" />
                          </span>
                          <div className={styles.activityBody}>
                            <span className={styles.activityTitle}>
                              {LABELS[job.module] || "Audit"}
                            </span>
                            <span
                              className={styles.status}
                              data-state={status.kind}
                            >
                              <status.Icon size={12} aria-hidden="true" />
                              {status.label}
                            </span>
                            <time
                              className={styles.date}
                              dateTime={job.created_at || undefined}
                            >
                              {dateLabel(job.created_at)}
                            </time>
                          </div>
                          {canOpen ? (
                            <button
                              type="button"
                              className={styles.openButton}
                              disabled={!!recovering}
                              onClick={() => open(job)}
                            >
                              {recovering === job.job_id
                                ? "Following..."
                                : job.state === "COMPLETED"
                                  ? "Open report"
                                  : "Follow audit"}
                              <ArrowUpRight size={12} aria-hidden="true" />
                            </button>
                          ) : (
                            <span className={styles.rowNote}>
                              {job.state === "FAILED"
                                ? "No report"
                                : "Copy expired"}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className={styles.empty}>
                    <span className={styles.emptyIcon}>
                      <FileText size={23} aria-hidden="true" />
                    </span>
                    <h4>
                      {busy
                        ? "Loading your audits..."
                        : "Your next audit starts here"}
                    </h4>
                    <p>
                      Run an audit from any module. Its progress and report will
                      appear here.
                    </p>
                  </div>
                )}
                {notice && (
                  <p className={styles.notice} role="status">
                    {notice}
                  </p>
                )}
              </div>
              <footer className={styles.footer}>
                <Clock3 size={14} aria-hidden="true" />
                <span>Completed reports can be reopened for one hour.</span>
              </footer>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
