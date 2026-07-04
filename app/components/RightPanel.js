'use client';

import ReportPreview from './ReportPreview';
import GhostReportPreview from './GhostReportPreview';

export default function RightPanel({
  activeTab,
  hasReport,
  loading,
  htmlReport,
  reportData,
  reportLabel,
  timestamp,
  pdfBlob,
  pdfLoading,
  onDownload,
}) {
  return (
    <aside className="right-panel" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
      
      {/* ── GHOST PREVIEW LAYER ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: hasReport ? 0 : 1,
          pointerEvents: hasReport ? 'none' : 'auto',
          transition: 'opacity 400ms ease-in-out',
          zIndex: 1,
          overflowY: 'hidden'
        }}
      >
        <GhostReportPreview activeTab={activeTab} />
      </div>

      {/* ── REAL REPORT LAYER ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: hasReport ? 1 : 0,
          pointerEvents: hasReport ? 'auto' : 'none',
          transition: 'opacity 400ms ease-in-out',
          zIndex: 2,
          overflowY: 'auto',
          padding: '24px' // Restoring the Right Panel padding here for the real report
        }}
      >
        <ReportPreview
          loading={loading}
          htmlReport={htmlReport}
          reportData={reportData}
          reportLabel={reportLabel}
          timestamp={timestamp}
          pdfBlob={pdfBlob}
          pdfLoading={pdfLoading}
          onDownload={onDownload}
        />
      </div>

    </aside>
  );
}
