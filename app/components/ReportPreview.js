'use client';

/**
 * ReportPreview — right-column panel that shows skeleton/placeholder/report.
 * Props:
 *   loading     — bool, show shimmer skeleton
 *   htmlReport  — string, the HTML report to render
 *   reportLabel — display name for the report type
 *   timestamp   — string "HH:MM" when it was generated
 *   pdfBlob     — Blob | null
 *   pdfLoading  — bool, PDF still being generated
 *   onDownload  — callback to trigger download
 */
import SocialAuditTable from './SocialAuditTable';

export default function ReportPreview({
  loading,
  htmlReport,
  reportData,
  reportLabel,
  timestamp,
  pdfBlob,
  pdfLoading,
  onDownload,
}) {
  // ── Empty state ──
  if (!loading && !htmlReport) {
    return (
      <div className="preview-placeholder" role="status" aria-label="No report yet">
        <div className="placeholder-watermark" aria-hidden="true">R</div>
        <p className="placeholder-text">
          Generate a report to see your preview here.
        </p>
      </div>
    );
  }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div aria-busy="true" aria-label="Generating report…">
        <div className="skeleton-wrap">
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
        </div>
      </div>
    );
  }

  // ── Report ready ──
  return (
    <div>
      {/* Header bar */}
      <div className="report-header">
        <div className="report-header-left">
          <span className="report-ready-badge">
            <span aria-hidden="true">✓</span> Report Ready
          </span>
          <span className="report-type-label">{reportLabel}</span>
          {timestamp && (
            <span className="report-timestamp">Generated at {timestamp}</span>
          )}
        </div>

        {/* Download button */}
        <button
          id={`download-btn-${reportLabel?.toLowerCase().replace(/\s/g, '-')}`}
          className="btn-download"
          onClick={onDownload}
          disabled={!pdfBlob}
          aria-label={pdfBlob ? `Download ${reportLabel} PDF` : 'PDF generating…'}
        >
          <span aria-hidden="true">⬇</span>
          {pdfBlob ? 'Download PDF' : 'Preparing PDF…'}
        </button>
      </div>

      {/* Main Content */}
      {(() => {
        const posts = reportData?.posts || reportData?.instagram_audit?.posts || reportData?.linkedin_audit?.posts || reportData?.data || [];
        const isSocialAudit = reportLabel === 'Instagram Audit' || reportLabel === 'LinkedIn Audit';
        
        if (isSocialAudit && posts && posts.length > 0) {
          return (
            <div className="native-report-container">
              <SocialAuditTable posts={posts} />
            </div>
          );
        }

        return (
          <div className="iframe-container">
            <iframe
              className="report-iframe"
              srcDoc={htmlReport}
              title={`${reportLabel} preview`}
              sandbox="allow-same-origin"
              loading="lazy"
            />
          </div>
        );
      })()}

      {/* PDF loading note */}
      {pdfLoading && (
        <div className="pdf-loading-note" aria-live="polite">
          <span className="pdf-dot" aria-hidden="true" />
          Generating PDF in background…
        </div>
      )}
    </div>
  );
}
