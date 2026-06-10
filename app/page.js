'use client';

import { useState, useRef } from 'react';
import { useSessionState } from './hooks/useSessionState';
import Navbar from './components/Navbar';
import TabNav from './components/TabNav';
import ReportPreview from './components/ReportPreview';
import FullReportForm from './forms/FullReportForm';
import WebsiteReportForm from './forms/WebsiteReportForm';
import InstagramReportForm from './forms/InstagramReportForm';
import LinkedInReportForm from './forms/LinkedInReportForm';
import VisualBrandForm from './forms/VisualBrandForm';
import {
  generateFullReport,
  generateWebsiteReport,
  generateInstagramReport,
  generateLinkedInReport,
  generateVisualReport,
  convertHtmlToPdf,
  downloadBlob,
} from './lib/api';

// ── Helpers ──

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_REPORT_STATE = {
  html: '',
  data: null,
  loading: false,
  error: '',
  timestamp: '',
};

// ── Main Dashboard ──

export default function Dashboard() {
  const [activeTab, setActiveTab] = useSessionState('active_tab', 'full');

  // Per-tab report state (html, loading, error, timestamp) — serialisable to sessionStorage
  const [fullReport,      setFullReport]      = useSessionState('report_full',      INITIAL_REPORT_STATE);
  const [websiteReport,   setWebsiteReport]   = useSessionState('report_website',   INITIAL_REPORT_STATE);
  const [instagramReport, setInstagramReport] = useSessionState('report_instagram', INITIAL_REPORT_STATE);
  const [linkedinReport,  setLinkedinReport]  = useSessionState('report_linkedin',  INITIAL_REPORT_STATE);
  const [visualReport,    setVisualReport]    = useSessionState('report_visual',    INITIAL_REPORT_STATE);

  // PDF blobs live in refs — not serialisable, intentionally ephemeral
  const pdfBlobs    = useRef({ full: null, website: null, instagram: null, linkedin: null, visual: null });
  const [pdfReady,  setPdfReady]   = useState({ full: false, website: false, instagram: false, linkedin: false, visual: false });
  const [pdfLoading, setPdfLoading] = useState({ full: false, website: false, instagram: false, linkedin: false, visual: false });

  // ── Generic report runner ──
  const runReport = async ({
    tabKey,
    setReport,
    apiFn,
    payload,
    pdfFilename,
  }) => {
    setReport((prev) => ({ ...prev, loading: true, error: '', html: '', data: null }));
    setPdfReady((p) => ({ ...p, [tabKey]: false }));
    setPdfLoading((p) => ({ ...p, [tabKey]: false }));
    pdfBlobs.current[tabKey] = null;

    try {
      const data = await apiFn(payload);
      const html = data.html_report || data.html || '';
      const ts   = now();

      setReport({ html, data, loading: false, error: '', timestamp: ts });

      // Kick off PDF generation
      setPdfLoading((p) => ({ ...p, [tabKey]: true }));
      try {
        const blob = await convertHtmlToPdf(html, pdfFilename);
        pdfBlobs.current[tabKey] = blob;
        setPdfReady((p) => ({ ...p, [tabKey]: true }));
      } catch (pdfErr) {
        // PDF failure is non-fatal — user can still read the HTML preview
        console.warn('PDF generation failed:', pdfErr.message);
      } finally {
        setPdfLoading((p) => ({ ...p, [tabKey]: false }));
      }
    } catch (err) {
      setReport((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Something went wrong. Please try again.',
      }));
    }
  };

  // ── Per-tab submit handlers ──

  const handleFullSubmit = (payload) =>
    runReport({
      tabKey: 'full',
      setReport: setFullReport,
      apiFn: generateFullReport,
      payload,
      pdfFilename: 'renoweb_full_report.pdf',
    });

  const handleWebsiteSubmit = (payload) =>
    runReport({
      tabKey: 'website',
      setReport: setWebsiteReport,
      apiFn: generateWebsiteReport,
      payload,
      pdfFilename: 'renoweb_website_report.pdf',
    });

  const handleInstagramSubmit = (payload) =>
    runReport({
      tabKey: 'instagram',
      setReport: setInstagramReport,
      apiFn: generateInstagramReport,
      payload,
      pdfFilename: 'renoweb_instagram_report.pdf',
    });

  const handleLinkedInSubmit = (payload) =>
    runReport({
      tabKey: 'linkedin',
      setReport: setLinkedinReport,
      apiFn: generateLinkedInReport,
      payload,
      pdfFilename: 'renoweb_linkedin_report.pdf',
    });

  const handleVisualSubmit = (formData) =>
    runReport({
      tabKey: 'visual',
      setReport: setVisualReport,
      apiFn: generateVisualReport,
      payload: formData,
      pdfFilename: 'renoweb_visual_brand_report.pdf',
    });

  // ── Download handlers ──

  const handleDownload = (tabKey, filename) => {
    const blob = pdfBlobs.current[tabKey];
    if (blob) downloadBlob(blob, filename);
  };

  // ── Dismiss error handlers ──

  const dismissError = (setReport) =>
    setReport((prev) => ({ ...prev, error: '' }));

  // ── Active tab data resolver ──

  const tabData = {
    full:      { report: fullReport,      setReport: setFullReport,      label: 'Full Report',       pdfKey: 'full',      filename: 'renoweb_full_report.pdf',       onSubmit: handleFullSubmit },
    website:   { report: websiteReport,   setReport: setWebsiteReport,   label: 'Website Anatomy',   pdfKey: 'website',   filename: 'renoweb_website_report.pdf',    onSubmit: handleWebsiteSubmit },
    instagram: { report: instagramReport, setReport: setInstagramReport, label: 'Instagram Audit',   pdfKey: 'instagram', filename: 'renoweb_instagram_report.pdf',  onSubmit: handleInstagramSubmit },
    linkedin:  { report: linkedinReport,  setReport: setLinkedinReport,  label: 'LinkedIn Audit',    pdfKey: 'linkedin',  filename: 'renoweb_linkedin_report.pdf',   onSubmit: handleLinkedInSubmit },
    visual:    { report: visualReport,    setReport: setVisualReport,    label: 'Visual Brand Match',pdfKey: 'visual',    filename: 'renoweb_visual_brand_report.pdf',onSubmit: handleVisualSubmit },
  };

  const current = tabData[activeTab];

  // ── Render ──

  return (
    <>
      <Navbar />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="app-layout">
        {/* ── Left: Form Panel ── */}
        <aside className="form-panel" key={activeTab}>
          <div
            className="tab-content"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'full' && (
              <FullReportForm
                loading={fullReport.loading}
                error={fullReport.error}
                onDismissError={() => dismissError(setFullReport)}
                onSubmit={handleFullSubmit}
              />
            )}
            {activeTab === 'website' && (
              <WebsiteReportForm
                loading={websiteReport.loading}
                error={websiteReport.error}
                onDismissError={() => dismissError(setWebsiteReport)}
                onSubmit={handleWebsiteSubmit}
              />
            )}
            {activeTab === 'instagram' && (
              <InstagramReportForm
                loading={instagramReport.loading}
                error={instagramReport.error}
                onDismissError={() => dismissError(setInstagramReport)}
                onSubmit={handleInstagramSubmit}
              />
            )}
            {activeTab === 'linkedin' && (
              <LinkedInReportForm
                loading={linkedinReport.loading}
                error={linkedinReport.error}
                onDismissError={() => dismissError(setLinkedinReport)}
                onSubmit={handleLinkedInSubmit}
              />
            )}
            {activeTab === 'visual' && (
              <VisualBrandForm
                loading={visualReport.loading}
                error={visualReport.error}
                onDismissError={() => dismissError(setVisualReport)}
                onSubmit={handleVisualSubmit}
              />
            )}
          </div>
        </aside>

        {/* ── Right: Preview Panel ── */}
        <main className="preview-panel">
          <ReportPreview
            loading={current.report.loading}
            htmlReport={current.report.html}
            reportData={current.report.data}
            reportLabel={current.label}
            timestamp={current.report.timestamp}
            pdfBlob={pdfReady[current.pdfKey] ? pdfBlobs.current[current.pdfKey] : null}
            pdfLoading={pdfLoading[current.pdfKey]}
            onDownload={() => handleDownload(current.pdfKey, current.filename)}
          />
        </main>
      </div>

      {/* ── Session persistence note ── */}
      <div
        className="session-note"
        title="Your inputs and reports persist across page refreshes but clear when this tab is closed."
        role="note"
        aria-label="Session persistence notice"
      >
        <span aria-hidden="true">🔒</span>
        Session data clears on tab close
      </div>
    </>
  );
}
