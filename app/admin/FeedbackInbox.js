'use client';

/**
 * Private feedback inbox rendered by AdminWorkspace at /admin/feedback.
 * Owns bounded pagination, refresh, loading and retry states so inbox failures
 * cannot disable account/ticket tools. The backend independently authorizes the
 * admin cookie; no feedback is included in customer profile or analytics APIs.
 * Messages are rendered as escaped React text, never submitted HTML.
 */
import { useEffect, useState } from 'react';
import { getAdminFeedback } from '@/app/lib/api';
import { MODULE_LABELS } from '@/app/lib/analyticsCatalog';
import styles from './feedback.module.css';

// ============================================================================
// DISPLAY CONTRACT
// Persisted values 1–5 correspond to the dashboard emoji scale. Submission
// timestamps arrive with a UTC offset and are displayed explicitly in IST.
// ============================================================================
const RATINGS = ['😞 Disappointed', '🙁 Could be better', '😐 Okay', '🙂 Good', '😍 Love it'];
const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

/** Render newest-first feedback with all submissions reachable through pagination. */
export default function FeedbackInbox() {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    // Ignore stale pages/refreshes and unmounted replies; retain only the current
    // request's rows. No background retry or mutation is performed by this inbox.
    getAdminFeedback(page).then(result => { if (active) setData(result); })
      .catch(failure => { if (active) setError(failure.message || 'Could not load feedback.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, refresh]);

  // ============================================================================
  // INBOX AND READ STATES
  // Page controls disable during reads; error states hide stale rows and provide
  // an explicit retry. Empty messages are legitimate rating-only submissions.
  // ============================================================================
  return <section className={styles.inbox} aria-label="User feedback" aria-busy={loading}>
    <div className={styles.heading}>
      <div><h2>What your users are saying</h2><p>Ratings, ideas and honest reactions from their audits.</p></div>
      <button onClick={() => setRefresh(value => value + 1)} disabled={loading}>Refresh feedback</button>
    </div>
    {loading ? <p role="status">Loading feedback…</p> : error ? <div role="alert"><p>{error}</p><button onClick={() => setRefresh(value => value + 1)}>Try again</button></div> : <>
      <p className={styles.count}>{data?.total || 0} submissions · newest first · dates in IST</p>
      {!data?.feedback.length ? <div className={styles.empty}><span aria-hidden="true">💬</span><h3>Your feedback inbox is ready</h3><p>User ratings and messages will appear here when they submit feedback.</p></div> : <div className={styles.rows}>
        {data.feedback.map(row => <article key={row._id} className={styles.row}>
          <div className={styles.rowHeader}><div><strong>{row.username || 'Unnamed account'}</strong><p>{row.email || 'No email recorded'}</p></div><span className={styles.rating}>{RATINGS[row.rating - 1]} <small>{row.rating}/5</small></span></div>
          <p className={styles.message}>{row.message || 'No written comment — rating only.'}</p>
          <footer><span>{MODULE_LABELS[row.module === 'ui_ux' ? 'ui-ux' : row.module] || row.module}</span><time dateTime={row.created_at}>{dateFormat.format(new Date(row.created_at))} IST</time></footer>
        </article>)}
      </div>}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous</button>
        <span>Page {page} of {Math.max(1, Math.ceil((data?.total || 0) / 20))}</span>
        <button disabled={page * 20 >= (data?.total || 0)} onClick={() => setPage(value => value + 1)}>Next</button>
      </div>
    </>}
  </section>;
}
