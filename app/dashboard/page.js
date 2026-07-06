'use client';

import { useState, useRef, useEffect } from 'react';
import { useSessionState } from '@/app/hooks/useSessionState';
import Navbar from '@/app/components/Navbar';
import TabNav from '@/app/components/TabNav';
import ReportPreview from '@/app/components/ReportPreview';
import RightPanel from '@/app/components/RightPanel';
import FullReportForm from '@/app/forms/FullReportForm';
import WebsiteReportForm from '@/app/forms/WebsiteReportForm';
import GmbReportForm from '@/app/forms/GmbReportForm';
import InstagramReportForm from '@/app/forms/InstagramReportForm';
import LinkedInReportForm from '@/app/forms/LinkedInReportForm';
import VisualBrandForm from '@/app/forms/VisualBrandForm';
import { useRouter } from 'next/navigation';
import {
  generateFullReport,
  generateWebsiteReport,
  generateGmbReport,
  generateInstagramReport,
  generateLinkedInReport,
  generateVisualReport,
  convertHtmlToPdf,
  downloadBlob,
} from '@/app/lib/api';

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
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState('User');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        if (payload.sub) {
          setUsername(payload.sub);
        }
      }
    } catch(e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/?login=true');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/?login=true');
    } else {
      setAuthChecked(true);
    }

    const handleAuthExpired = () => {
      router.push('/?login=true');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [router]);

  const [activeTab, setActiveTab] = useSessionState('active_tab', 'full');

  // Per-tab report state (html, loading, error, timestamp) — serialisable to sessionStorage
  const [fullReport,      setFullReport]      = useSessionState('report_full',      INITIAL_REPORT_STATE);
  const [websiteReport,   setWebsiteReport]   = useSessionState('report_website',   INITIAL_REPORT_STATE);
  const [gmbReport,       setGmbReport]       = useSessionState('report_gmb',       INITIAL_REPORT_STATE);
  const [instagramReport, setInstagramReport] = useSessionState('report_instagram', INITIAL_REPORT_STATE);
  const [linkedinReport,  setLinkedinReport]  = useSessionState('report_linkedin',  INITIAL_REPORT_STATE);
  const [visualReport,    setVisualReport]    = useSessionState('report_visual',    INITIAL_REPORT_STATE);

  // PDF blobs live in refs — not serialisable, intentionally ephemeral
  const pdfBlobs    = useRef({ full: null, website: null, gmb: null, instagram: null, linkedin: null, visual: null });
  const pdfFilenames = useRef({ full: '', website: '', gmb: '', instagram: '', linkedin: '', visual: '' });
  const [pdfReady,  setPdfReady]   = useState({ full: false, website: false, gmb: false, instagram: false, linkedin: false, visual: false });
  const [pdfLoading, setPdfLoading] = useState({ full: false, website: false, gmb: false, instagram: false, linkedin: false, visual: false });

  // ── Generic report runner ──
  const runReport = async ({
    tabKey,
    setReport,
    apiFn,
    payload,
    fallbackFilename,
  }) => {
    setReport((prev) => ({ ...prev, loading: true, error: '', html: '', data: null }));
    setPdfReady((p) => ({ ...p, [tabKey]: false }));
    setPdfLoading((p) => ({ ...p, [tabKey]: false }));
    pdfBlobs.current[tabKey] = null;
    pdfFilenames.current[tabKey] = '';

    // Generate dynamic filename
    let brandName = '';
    if (payload && !(payload instanceof FormData)) {
      brandName = payload.company_name || payload.ig_username || payload.gmb_company_name;
      if (!brandName && payload.domain) {
        brandName = payload.domain.replace(/^https?:\/\//, '').split('/')[0];
      } else if (!brandName && payload.linkedin_company_url) {
        const match = payload.linkedin_company_url.match(/company\/([^/]+)/);
        brandName = match ? match[1] : '';
      }
    }
    
    if (brandName) {
      brandName = brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    
    const finalFilename = brandName 
      ? fallbackFilename.replace('renoweb_', `${brandName}_`) 
      : fallbackFilename.replace('renoweb_', 'audit_');

    try {
      const data = await apiFn(payload);
      const html = data.html_report || data.html || '';
      const ts   = now();

      setReport({ html, data, loading: false, error: '', timestamp: ts });

      // Kick off PDF generation
      setPdfLoading((p) => ({ ...p, [tabKey]: true }));
      try {
        const blob = await convertHtmlToPdf(html, finalFilename);
        pdfBlobs.current[tabKey] = blob;
        pdfFilenames.current[tabKey] = finalFilename;
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
      fallbackFilename: 'renoweb_full_report.pdf',
    });

  const handleWebsiteSubmit = (payload) =>
    runReport({
      tabKey: 'website',
      setReport: setWebsiteReport,
      apiFn: generateWebsiteReport,
      payload,
      fallbackFilename: 'renoweb_website_report.pdf',
    });

  const handleGmbSubmit = (payload) =>
    runReport({
      tabKey: 'gmb',
      setReport: setGmbReport,
      apiFn: generateGmbReport,
      payload,
      fallbackFilename: 'renoweb_gmb_audit_report.pdf',
    });

  const handleInstagramSubmit = (payload) =>
    runReport({
      tabKey: 'instagram',
      setReport: setInstagramReport,
      apiFn: generateInstagramReport,
      payload,
      fallbackFilename: 'renoweb_instagram_report.pdf',
    });

  const handleLinkedInSubmit = (payload) =>
    runReport({
      tabKey: 'linkedin',
      setReport: setLinkedinReport,
      apiFn: generateLinkedInReport,
      payload,
      fallbackFilename: 'renoweb_linkedin_report.pdf',
    });

  const handleVisualSubmit = (formData) =>
    runReport({
      tabKey: 'visual',
      setReport: setVisualReport,
      apiFn: generateVisualReport,
      payload: formData,
      fallbackFilename: 'renoweb_visual_brand_report.pdf',
    });

  // ── Download handlers ──

  const handleDownload = (tabKey) => {
    const blob = pdfBlobs.current[tabKey];
    const filename = pdfFilenames.current[tabKey] || 'audit_report.pdf';
    if (blob) downloadBlob(blob, filename);
  };

  // ── Dismiss error handlers ──

  const dismissError = (setReport) =>
    setReport((prev) => ({ ...prev, error: '' }));

  // ── Active tab data resolver ──

  const tabData = {
    full:      { report: fullReport,      setReport: setFullReport,      label: 'Full Report',       pdfKey: 'full',      onSubmit: handleFullSubmit },
    website:   { report: websiteReport,   setReport: setWebsiteReport,   label: 'Website Anatomy',   pdfKey: 'website',   onSubmit: handleWebsiteSubmit },
    gmb:       { report: gmbReport,       setReport: setGmbReport,       label: 'GMB Audit',         pdfKey: 'gmb',       onSubmit: handleGmbSubmit },
    instagram: { report: instagramReport, setReport: setInstagramReport, label: 'Instagram Audit',   pdfKey: 'instagram', onSubmit: handleInstagramSubmit },
    linkedin:  { report: linkedinReport,  setReport: setLinkedinReport,  label: 'LinkedIn Audit',    pdfKey: 'linkedin',  onSubmit: handleLinkedInSubmit },
    visual:    { report: visualReport,    setReport: setVisualReport,    label: 'Visual Brand Match',pdfKey: 'visual',    onSubmit: handleVisualSubmit },
  };

  const current = tabData[activeTab];

  // ── Determine layout phase ──
  // Phase 1: no report generated for current tab → sidebar + full-width form
  // Phase 2: report exists or loading → horizontal tabs + 2-column layout
  const hasReport = current ? (current.report.html || current.report.loading) : false;

  // ── Form renderer ──
  const renderForm = () => (
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
      {activeTab === 'gmb' && (
        <GmbReportForm
          loading={gmbReport.loading}
          error={gmbReport.error}
          onDismissError={() => dismissError(setGmbReport)}
          onSubmit={handleGmbSubmit}
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
  );

  // ── Render ──
  if (!authChecked) return null;

  return (
    <>
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ── Left Sidebar Navigation ── */}
        <TabNav 
          activeTab={activeTab} 
          onTabChange={(id) => {
            setActiveTab(id);
            setIsSidebarOpen(false);
          }} 
          onLogout={handleLogout} 
        />

        {/* ── Main Content (Form) ── */}
        <main className="main-content" key={activeTab}>
          <div className="form-panel">
            {renderForm()}
          </div>
        </main>

        {/* ── Right Utility Panel (Preview/Info) ── */}
        <RightPanel 
          activeTab={activeTab}
          hasReport={hasReport}
          loading={current?.report?.loading || false}
          htmlReport={current?.report?.html || null}
          reportData={current?.report?.data || null}
          reportLabel={current?.label || 'Profile'}
          timestamp={current?.report?.timestamp || null}
          pdfBlob={current && pdfReady[current.pdfKey] ? pdfBlobs.current[current.pdfKey] : null}
          pdfLoading={current ? pdfLoading[current.pdfKey] : false}
          onDownload={() => current && handleDownload(current.pdfKey)}
        />
      </div>
    </>
  );
}
