"use client";

/**
 * Flair's visual identity, holographic backdrop and pending-request presence.
 * AgentWorkspace mounts these presentational components; report execution,
 * authentication and artifact delivery remain in its existing API flow.
 * The backend returns a final response rather than progress events, so the log
 * describes only the submitted/pending request. Rotating copy is atmosphere,
 * never a claim that a crawler, model or report stage has actually completed.
 * CSS owns decorative motion; the one-second clock pauses while the tab/module
 * is hidden, resumes from wall elapsed time, and always cleans up on unmount.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./flair.module.css";

// ============================================================================
// SHARED BRAND MARK AND DECORATIVE ATMOSPHERE
// The liquid silhouette is a code-native mark, with no remote asset requests or
// model-generated content. All ambient layers are inert and hidden from readers.
// ============================================================================
/** Render Flair's folded liquid-flame mark; surrounding text supplies its name. */
export function FlairMark({ className = "" }) {
  return (
    <span className={`${styles.mark} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <path
          d="M37 5C37 20 16 18 12 34C8 48 20 60 34 58C51 55 57 40 49 28C48 40 39 46 31 43C43 34 48 18 37 5Z"
          fill="currentColor"
        />
        <path
          d="M30 24C23 32 20 39 25 46"
          stroke="white"
          strokeOpacity=".72"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** Re-key a brief send ripple while keeping slow, decorative droplets separate. */
export function FlairAtmosphere({ pulse, busy, active }) {
  return (
    <div
      className={styles.atmosphere}
      data-busy={busy}
      data-active={active}
      aria-hidden="true"
    >
      <span className={styles.mesh} />
      <span className={`${styles.droplet} ${styles.dropletOne}`} />
      <span className={`${styles.droplet} ${styles.dropletTwo}`} />
      <span className={`${styles.droplet} ${styles.dropletThree}`} />
      {pulse > 0 && <span key={pulse} className={styles.sendWave} />}
    </div>
  );
}

// ============================================================================
// HONEST REQUEST PRESENCE
// Elapsed time measures browser waiting, not server progress or estimated finish.
// Never attach percentages, completed tool steps or provider names to this clock.
// ============================================================================
const WAITING_COPY = [
  "Connecting the dots.",
  "A little focus. A clearer direction.",
  "Good questions deserve a closer look.",
  "Keeping the bigger picture in view.",
];

/** Show a pulsing identity and request activity until AgentWorkspace settles. */
export function FlairWorking({ active }) {
  const started = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    let timer;
    /** Schedule ticks only while visible; reconcile actual elapsed time on return. */
    const syncClock = () => {
      clearInterval(timer);
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
      if (!document.hidden) {
        timer = setInterval(() => {
          setElapsed(Math.floor((Date.now() - started.current) / 1000));
        }, 1000);
      }
    };
    syncClock();
    document.addEventListener("visibilitychange", syncClock);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", syncClock);
    };
  }, [active]);

  // Reduced-motion visitors keep a stable headline, not rotating copy. The clock
  // is aria-hidden; a single status sentence avoids repeated reader announcements.
  const copy =
    WAITING_COPY[
      reducedMotion ? 0 : Math.floor(elapsed / 7) % WAITING_COPY.length
    ];
  const duration = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  return (
    <div className={styles.presence} data-active={active}>
      <span className={styles.screenReaderStatus} role="status">
        Flair is waiting for your result. Your request is in progress.
      </span>
      <div className={styles.presenceHeader} aria-hidden="true">
        <span className={styles.pulseMark}>
          <FlairMark />
        </span>
        <div className={styles.presenceHeading}>
          <span>
            FLAIR IS ON IT <i />
          </span>
          <strong key={copy}>{copy}</strong>
        </div>
        <time className={styles.elapsed} aria-hidden="true">
          {duration}
        </time>
      </div>
      <div className={styles.requestTrail} aria-label="Request activity">
        <div>
          <span className={styles.sentDot} />
          <span>Request submitted</span>
          <small>Sent</small>
        </div>
        <div>
          <span className={styles.waitingDot} />
          <span>Waiting for your result</span>
          <span className={styles.signal}>
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <p>
        {elapsed >= 30
          ? "Still with you. Some requests take a little longer."
          : "Your result will appear in this conversation when it is ready."}
      </p>
    </div>
  );
}
