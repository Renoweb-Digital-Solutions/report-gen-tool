'use client';

/**
 * Paginated per-run consumption inside an expanded AdminWorkspace user row.
 * Reads require the independent admin cookie through getAdminUserReports. Input
 * username selects the account server-side; no customer endpoint is repurposed.
 * Reads are local to this panel, ignore stale responses, and preserve unknown
 * historical billing values through the same formatter as the profile table.
 */
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { getAdminUserReports } from '@/app/lib/api';
import { creditUsageLabel } from '@/app/features/credits/usage';
import styles from './UserRunHistory.module.css';

// ============================================================================
// ACCOUNT-SPECIFIC PAGINATION AND READ LIFECYCLE
// Parent keys each panel by username, resetting pagination on account changes.
// Cleanup invalidates pending responses without affecting any audit/billing work.
// ============================================================================
export default function UserRunHistory({ username }) {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const limit = 5;

  useEffect(() => {
    const version = ++generation.current;
    setLoading(true);
    setError('');
    setData(null);
    // Isolate read failures from account suspension/email controls in the parent.
    getAdminUserReports(username, page, limit).then(result => {
      if (version === generation.current) setData(result);
    }).catch(failure => {
      if (version === generation.current) setError(failure.message || 'Could not load run history.');
    }).finally(() => {
      if (version === generation.current) setLoading(false);
    });
    return () => { generation.current += 1; };
  }, [username, page, refresh]);

  /** Render stored UTC as a local date while safely handling legacy missing data. */
  function dateLabel(value) {
    if (!value) return 'Not recorded';
    const normalized = /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}Z`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString();
  }

  return (
    <section className={styles.panel} aria-label={`Run history for ${username}`} aria-busy={loading}>
      <div className={styles.heading}>
        <div><h3>Run history</h3><p>Confirmed credits consumed by each report.</p></div>
        <button type="button" onClick={() => setRefresh(value => value + 1)} disabled={loading} aria-label={`Refresh run history for ${username}`}><RefreshCw size={14} />Refresh</button>
      </div>
      {error ? <p className={styles.error} role="alert">{error}</p>
        : loading ? <p className={styles.empty} role="status">Loading run history...</p>
        : <>
          <div className={styles.tableScroll}>
            <table>
              <thead><tr><th scope="col">Report type</th><th scope="col">Status</th><th scope="col">Credits consumed</th><th scope="col">Date & time</th></tr></thead>
              <tbody>
                {data?.reports.length ? data.reports.map(report => (
                  <tr key={report._id}><td>{report.type}</td><td>{report.status}</td><td className={styles.usage}>{creditUsageLabel(report)}</td><td>{dateLabel(report.created_at)}</td></tr>
                )) : <tr><td colSpan={4} className={styles.empty}>No reports generated yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className={styles.footer}>
            <span>{data?.total || 0} reports <span aria-hidden="true">·</span> Older runs without billing records show “Not recorded”.</span>
            <div><button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)} aria-label="Previous history page"><ChevronLeft size={14} /></button><span>Page {page}</span><button type="button" disabled={page * limit >= (data?.total || 0)} onClick={() => setPage(value => value + 1)} aria-label="Next history page"><ChevronRight size={14} /></button></div>
          </div>
        </>}
    </section>
  );
}
