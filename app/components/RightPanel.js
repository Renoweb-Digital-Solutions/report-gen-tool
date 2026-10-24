'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReportPreview from './ReportPreview';
import { useAnalytics } from './AnalyticsProvider';
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
  // ========================================================================
  // REPORT EXPOSURE
  // Observe a small marker above the actual preview, never report contents or
  // iframe DOM. Count once per displayed result after one visible second; hidden
  // mobile sheets, loading skeletons and background tabs do not count as views.
  // ========================================================================
  const { trackEvent, consented } = useAnalytics();
  const previewMarker = useRef(null);
  const lastExposure = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Automatically open the drawer on mobile if a new report finishes loading or arrives
  useEffect(() => {
    if (hasReport) {
      setIsOpen(true);
    }
  }, [hasReport]);

  useEffect(() => {
    if (!consented || loading || !hasReport || (!htmlReport && !reportData) || (isMobile && !isOpen) || !previewMarker.current || !window.IntersectionObserver) return;
    const resultIdentity = reportData || htmlReport;
    if (lastExposure.current === resultIdentity) return;
    let timer;
    let recorded = false;
    let visible = false;
    /** Start exposure only when both the marker and browser tab are visible. */
    const update = () => {
      clearTimeout(timer);
      if (visible && !recorded && document.visibilityState === 'visible') {
        timer = setTimeout(() => {
          recorded = true;
          lastExposure.current = resultIdentity;
          trackEvent('report_viewed', { control: 'report_preview' }, activeTab);
        }, 1000);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      update();
    }, { threshold: [0, 0.5] });
    observer.observe(previewMarker.current);
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [activeTab, consented, hasReport, htmlReport, reportData, loading, isMobile, isOpen, trackEvent]);

  return (
    <aside className={`right-panel ${isMobile && isOpen ? 'open' : ''}`} style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
      
      {isMobile && (
        <div 
          className="mobile-sheet-header relative overflow-hidden" 
          data-analytics-control="preview_toggle"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '100%', padding: '8px 12px 12px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', zIndex: 10 }}
        >
          {/* Gradient aura glow */}
          <div className="absolute top-0 left-0 right-0 h-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, var(--brand-cyan) 0%, transparent 60%)' }}></div>
          
          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {isOpen ? (
              <ChevronDown size={24} className="text-brandDeep opacity-70 mb-1" />
            ) : (
              <ChevronUp size={24} className="text-brandCyan animate-bounce mb-1" style={{ filter: 'drop-shadow(0 0 4px rgba(48,143,239,0.5))' }} />
            )}
            
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-deep)' }} className="sheet-title">
              {hasReport ? `View ${reportLabel || 'Report'} Preview` : 'Report Preview (Empty)'}
            </span>
          </div>
        </div>
      )}

      {/* ── GHOST PREVIEW LAYER ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          top: isMobile ? '48px' : 0, // push down for mobile handle
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
          top: isMobile ? '48px' : 0,
          opacity: hasReport ? 1 : 0,
          pointerEvents: hasReport ? 'auto' : 'none',
          transition: 'opacity 400ms ease-in-out',
          zIndex: 2,
          overflowY: 'auto',
          padding: '24px' // Restoring the Right Panel padding here for the real report
        }}
      >
        {/* A content-free marker measures preview exposure without reading reports. */}
        <div ref={previewMarker} aria-hidden="true" style={{ height: 2 }} />
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
