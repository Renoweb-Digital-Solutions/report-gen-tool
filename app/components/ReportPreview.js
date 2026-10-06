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
import AdsLibraryTable from './AdsLibraryTable';
import ScanCardLoader from './ScanCardLoader';
import { AnimatePresence, motion } from 'framer-motion';

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
  const getModuleType = (label) => {
    if (!label) return 'full';
    const lower = label.toLowerCase();
    if (lower.includes('instagram')) return 'instagram';
    if (lower.includes('website')) return 'website';
    if (lower.includes('gmb')) return 'gmb';
    if (lower.includes('linkedin')) return 'linkedin';
    if (lower.includes('visual')) return 'visual';
    return 'full';
  };

  // ── No report yet ──
  const hasData = htmlReport || (reportData && (reportData.ads_library_data || reportData.posts || reportData.data));
  if (!loading && !hasData) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%' }}
          aria-busy="true"
          aria-label="Generating report…"
        >
          <ScanCardLoader type={getModuleType(reportLabel)} />
        </motion.div>
      ) : (
        <motion.div
          key="report"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
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
            const isSocialAudit = reportLabel === 'Instagram Audit' || reportLabel === 'LinkedIn Audit' || reportLabel === 'LinkedIn Personal';
            
            if (isSocialAudit && posts && posts.length > 0) {
              return (
                <div className="native-report-container">
                  <SocialAuditTable posts={posts} />
                </div>
              );
            }

            if (reportLabel === 'Ads Audit' && reportData?.ads_library_data) {
              return (
                <div className="native-report-container h-full overflow-y-auto">
                  <AdsLibraryTable adsData={reportData.ads_library_data} />
                </div>
              );
            }

            // Pre-process HTML report to fix layout issues on mobile (frontend only, avoiding backend changes)
            let processedHtml = htmlReport;
            if (processedHtml && typeof processedHtml === 'string') {
              const frontendFixes = `
                <style>
                  @media (max-width: 800px) {
                    body { padding: 8px !important; margin: 0 !important; }
                    /* Reduce paddings and gaps */
                    .p-8, .p-10, .p-12, .p-16 { padding: 16px !important; }
                    .px-8, .px-10, .px-12 { padding-left: 16px !important; padding-right: 16px !important; }
                    .py-8, .py-10, .py-12 { padding-top: 16px !important; padding-bottom: 16px !important; }
                    .gap-6, .gap-8, .gap-10 { gap: 12px !important; }
                    
                    /* Resize typography */
                    .text-5xl { font-size: 1.8rem !important; line-height: 1.2 !important; }
                    .text-4xl { font-size: 1.5rem !important; line-height: 1.2 !important; }
                    .text-3xl { font-size: 1.3rem !important; }
                    .text-2xl { font-size: 1.15rem !important; }
                    
                    /* Flatten grid layouts to 1 column */
                    .grid-cols-2, .grid-cols-3, .grid-cols-4 { grid-template-columns: 1fr !important; }
                    
                    /* Fix specific overlapping elements (e.g. logo and title in header) */
                    .flex.justify-between.items-center { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
                    .text-right { text-align: left !important; }
                    
                    /* Fix table/list overflowing text */
                    .break-words { word-break: break-word !important; }
                  }
                  
                  /* Clean up viewing area */
                  html, body { overflow-x: hidden; }
                  .min-h-screen { min-height: auto !important; }
                </style>
              `;
              if (processedHtml.includes('</head>')) {
                processedHtml = processedHtml.replace('</head>', `${frontendFixes}</head>`);
              } else {
                processedHtml = frontendFixes + processedHtml;
              }
            }

            return (
              <div className="iframe-container">
                <iframe
                  className="report-iframe"
                  srcDoc={processedHtml}
                  title={`${reportLabel} preview`}
                  sandbox="allow-same-origin allow-scripts"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
