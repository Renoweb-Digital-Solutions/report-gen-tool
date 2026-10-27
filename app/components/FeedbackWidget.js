'use client';

/**
 * Small, nonmodal dashboard feedback card. Dashboard supplies the last received
 * pipeline and current busy state; timers never await or modify audit requests.
 * Explicit feedback uses cookie-authorized APIs, independently of analytics.
 * Only the last tool code is retained in sessionStorage, never message text.
 * Eligibility is rechecked on the server before opening and again on submission.
 */
import { useEffect, useRef, useState } from 'react';
import { getFeedbackStatus, submitFeedback } from '@/app/lib/api';
import styles from './feedback.module.css';

// ============================================================================
// RATING SCALE AND RANDOM SCHEDULING
// First prompt: 20–60 seconds after a result. Later reminders: 3–7 minutes.
// Busy/hidden dashboards defer prompts; closing never marks feedback submitted.
// ============================================================================
const FEEDBACK_RATINGS = [
  { value: 1, emoji: '😞', label: 'Disappointed' },
  { value: 2, emoji: '🙁', label: 'Could be better' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Love it' },
];
// Storage is only a display hint. Reject stale/edited tool codes so an invalid
// session value cannot produce an unusable form or a rejected submission.
const TOOLS = new Set(['full', 'website', 'gmb', 'instagram', 'linkedin', 'linkedin_personal', 'visual', 'ads', 'ui_ux']);

/** Render the dashboard-only widget and clean up timers/late reads on unmount. */
export default function FeedbackWidget({ completion, busy, blocked }) {
  const [tool, setTool] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const prompted = useRef(false);
  const cooldownUntil = useRef(0);
  const card = useRef(null);
  const trigger = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    // Restore reminder eligibility across reloads in this dashboard tab. Storage
    // denial only loses this display hint; server cooldown enforcement remains.
    try {
      const previous = sessionStorage.getItem('flawdits_feedback_tool');
      if (TOOLS.has(previous)) setTool(previous);
    } catch { /* Private browsing may deny optional session hints. */ }
  }, []);

  useEffect(() => {
    if (!completion) return;
    setTool(completion.module);
    try { sessionStorage.setItem('flawdits_feedback_tool', completion.module); }
    catch { /* Keep reminders available in memory when storage is denied. */ }
  }, [completion]);

  useEffect(() => {
    if (!tool || busy || blocked || open) return;
    let active = true;
    const randomDelay = prompted.current ? 180000 + Math.random() * 240000 : 20000 + Math.random() * 40000;
    const delay = Math.max(randomDelay, cooldownUntil.current - Date.now());
    const timer = window.setTimeout(async () => {
      // Hidden tabs must not surprise users with a card waiting on return. A new
      // random reminder is scheduled instead; failed reads never open a popup.
      if (document.visibilityState !== 'visible') { setRetry(value => value + 1); return; }
      try {
        const status = await getFeedbackStatus();
        if (!active) return;
        // Visibility may change while the network read is pending. Defer again
        // instead of opening a card in an inactive tab after that late response.
        if (document.visibilityState !== 'visible') { setRetry(value => value + 1); return; }
        if (status.eligible) {
          prompted.current = true;
          setSent(false);
          setError('');
          setOpen(true);
        } else {
          cooldownUntil.current = Date.parse(status.next_eligible_at) || Date.now() + 180000;
          setRetry(value => value + 1);
        }
      } catch {
        // Isolated feedback availability must never disrupt the pipeline UI.
        if (active) { prompted.current = true; setRetry(value => value + 1); }
      }
    }, delay);
    return () => { active = false; window.clearTimeout(timer); };
  }, [tool, completion, busy, blocked, open, retry]);

  /** Close from the button/Escape and return focus only if it was in this card. */
  function dismiss() {
    if (sending) return;
    const restoreFocus = card.current?.contains(document.activeElement);
    setOpen(false);
    if (restoreFocus && trigger.current?.isConnected) trigger.current.focus();
  }

  useEffect(() => {
    if (!open) return;
    // A nonmodal card announces itself without stealing focus from the report.
    // Save the prior element for keyboard dismissal; no focus trap is required.
    trigger.current = document.activeElement;
  }, [open]);

  /** Submit explicit input; preserve text on failures and accept cross-tab cooldowns. */
  async function handleSubmit(event) {
    event.preventDefault();
    if (!rating || sending) return;
    setSending(true);
    setError('');
    try {
      const result = await submitFeedback({ rating, message: message.trim(), module: tool });
      if (!mounted.current) return;
      cooldownUntil.current = Date.parse(result.next_eligible_at);
      setSent(true);
      setRating(null);
      setMessage('');
    } catch (failure) {
      if (!mounted.current) return;
      if (failure.status === 409) {
        // Another tab or an ambiguous earlier response may have saved feedback.
        // Server status controls subsequent reminders; never resend automatically.
        setOpen(false);
      } else setError(failure.message || 'Could not send feedback. Please try again.');
    } finally { if (mounted.current) setSending(false); }
  }

  // ============================================================================
  // ACCESSIBLE NONMODAL CARD
  // Native buttons expose named emoji choices; only selecting a rating reveals
  // the optional message. No animation, overlay, or report interaction blocking.
  // ============================================================================
  if (!open || busy || blocked) return null;
  return (
    <aside ref={card} className={styles.card} aria-labelledby="feedback-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); dismiss(); } }}>
      <button type="button" className={styles.close} aria-label="Dismiss feedback" onClick={dismiss} disabled={sending}>×</button>
      <div aria-live="polite">
        <p className={styles.eyebrow}>A LITTLE CHECK-IN</p>
        <h2 id="feedback-title">{sent ? 'Thanks for sharing!' : 'How’s Flawdits feeling?'}</h2>
        <p>{sent ? 'Your feedback helps us make your next audit better.' : 'Your take helps us build a better tool.'}</p>
      </div>
      {!sent && <form onSubmit={handleSubmit}>
        <div className={styles.ratings} role="group" aria-label="Rate your experience">
          {FEEDBACK_RATINGS.map(option => (
            <button type="button" key={option.value} aria-label={`${option.value} out of 5: ${option.label}`} aria-pressed={rating === option.value} title={option.label} disabled={sending} onClick={() => setRating(option.value)}>
              <span aria-hidden="true">{option.emoji}</span>
            </button>
          ))}
        </div>
        {rating && <div className={styles.details}>
          <label htmlFor="feedback-message">Want to say a little more? <span>(optional)</span></label>
          <textarea id="feedback-message" rows={3} maxLength={2000} value={message} disabled={sending} onChange={event => setMessage(event.target.value)} placeholder="What worked? What could be better?" />
          <small>Shared with the Flawdits team with your account details.</small>
          <button type="submit" className={styles.submit} disabled={sending}>{sending ? 'Sending…' : 'Submit feedback'}</button>
        </div>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </form>}
    </aside>
  );
}
