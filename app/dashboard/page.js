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
import LinkedInPersonalForm from '@/app/forms/LinkedInPersonalForm';
import VisualBrandForm from '@/app/forms/VisualBrandForm';
import AdsAuditForm from '@/app/forms/AdsAuditForm';
import UiUxAuditForm from '@/app/forms/UiUxAuditForm';
import SupportModal from '@/app/components/SupportModal';
import { HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  generateFullReport,
  generateWebsiteReport,
  generateGmbReport,
  generateInstagramReport,
  generateLinkedInReport,
  generateLinkedInPersonalReport,
  generateVisualReport,
  generateGoogleAdsReport,
  generateMetaAdsReport,
  convertHtmlToPdf,
  downloadBlob,
  generateUiUxAudit,
  getUserProfile,
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
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/?login=true');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    let isValid = false;

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          isValid = false;
        } else {
          isValid = true;
          if (payload.sub) {
            setUsername(payload.sub);
          }
          getUserProfile().then(profile => setUserProfile(profile)).catch(err => console.error(err));
        }
      } catch(e) {
        isValid = false;
      }
    }

    if (!isValid) {
      localStorage.clear();
      sessionStorage.clear();
      router.push('/?login=true');
    } else {
      setAuthChecked(true);
    }

    const handleAuthExpired = () => {
      localStorage.clear();
      sessionStorage.clear();
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
  const [linkedinPersonalReport, setLinkedinPersonalReport] = useSessionState('report_linkedin_personal', INITIAL_REPORT_STATE);
  const [visualReport,    setVisualReport]    = useSessionState('report_visual',    INITIAL_REPORT_STATE);
  const [adsReport,       setAdsReport]       = useSessionState('report_ads',       INITIAL_REPORT_STATE);
  const [uiUxReport,      setUiUxReport]      = useSessionState('report_ui_ux',     INITIAL_REPORT_STATE);
  const [adsProgress,     setAdsProgress]     = useState('');
  const [uiUxProgress,    setUiUxProgress]    = useState('');

  // PDF blobs live in refs — not serialisable, intentionally ephemeral
  const pdfBlobs    = useRef({ full: null, website: null, gmb: null, instagram: null, linkedin: null, linkedin_personal: null, visual: null, ads: null, ui_ux: null });
  const pdfFilenames = useRef({ full: '', website: '', gmb: '', instagram: '', linkedin: '', linkedin_personal: '', visual: '', ads: '', ui_ux: '' });
  const [pdfReady,  setPdfReady]   = useState({ full: false, website: false, gmb: false, instagram: false, linkedin: false, linkedin_personal: false, visual: false, ads: false, ui_ux: false });
  const [pdfLoading, setPdfLoading] = useState({ full: false, website: false, gmb: false, instagram: false, linkedin: false, linkedin_personal: false, visual: false, ads: false, ui_ux: false });

  // ── Generic report runner ──
  const runReport = async ({
    tabKey,
    setReport,
    apiFn,
    payload,
    fallbackFilename,
  }) => {
    if (userProfile?.is_suspended) {
        alert('Your account is suspended. Reason: ' + (userProfile.suspension_reason || 'Contact support'));
        return;
    }
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
      } else if (!brandName && payload.linkedin_url) {
        const match = payload.linkedin_url.match(/(?:company|in)\/([^/]+)/);
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

  const handleLinkedInPersonalSubmit = (payload) =>
    runReport({
      tabKey: 'linkedin_personal',
      setReport: setLinkedinPersonalReport,
      apiFn: generateLinkedInPersonalReport,
      payload,
      fallbackFilename: 'renoweb_linkedin_personal_report.pdf',
    });

  const handleVisualSubmit = (formData) =>
    runReport({
      tabKey: 'visual',
      setReport: setVisualReport,
      apiFn: generateVisualReport,
      payload: formData,
      fallbackFilename: 'renoweb_visual_brand_report.pdf',
    });

  const handleUiUxSubmit = async (payload) => {
    if (userProfile?.is_suspended) {
        alert('Your account is suspended. Reason: ' + (userProfile.suspension_reason || 'Contact support'));
        return;
    }
    const tabKey = 'ui_ux';
    setUiUxReport((prev) => ({ ...prev, loading: true, error: '', html: '', data: null }));
    setUiUxProgress('Starting audit...');
    setPdfReady((p) => ({ ...p, [tabKey]: false }));
    setPdfLoading((p) => ({ ...p, [tabKey]: false }));
    pdfBlobs.current[tabKey] = null;
    pdfFilenames.current[tabKey] = '';

    const fallbackFilename = 'renoweb_ui_ux_report.pdf';
    
    let brandName = payload.url || payload.domain || '';
    // Extract domain from url if possible
    try {
      if (brandName.startsWith('http')) {
        brandName = new URL(brandName).hostname.replace('www.', '');
      }
    } catch(e) {}
    if (brandName) brandName = brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    const finalFilename = brandName 
      ? fallbackFilename.replace('renoweb_', `${brandName}_`) 
      : fallbackFilename;

    try {
      const data = await generateUiUxAudit(payload, (msg) => setUiUxProgress(msg));
      const html = data.html_report || data.html || '';
      const ts = now();

      setUiUxReport({ html, data, loading: false, error: '', timestamp: ts });
      setUiUxProgress('');

      setPdfLoading((p) => ({ ...p, [tabKey]: true }));
      try {
        const blob = await convertHtmlToPdf(html, finalFilename);
        pdfBlobs.current[tabKey] = blob;
        pdfFilenames.current[tabKey] = finalFilename;
        setPdfReady((p) => ({ ...p, [tabKey]: true }));
      } catch (pdfErr) {
        console.warn('PDF generation failed:', pdfErr.message);
      } finally {
        setPdfLoading((p) => ({ ...p, [tabKey]: false }));
      }
    } catch (err) {
      setUiUxReport((prev) => ({ ...prev, loading: false, error: err.message || 'Audit failed.' }));
      setUiUxProgress('');
    }
  };

  const handleAdsSubmit = async (platform, payload) => {
    if (userProfile?.is_suspended) {
        alert('Your account is suspended. Reason: ' + (userProfile.suspension_reason || 'Contact support'));
        return;
    }
    const tabKey = 'ads';
    setAdsReport((prev) => ({ ...prev, loading: true, error: '', html: '', data: null }));
    setAdsProgress('Starting audit...');
    setPdfReady((p) => ({ ...p, [tabKey]: false }));
    setPdfLoading((p) => ({ ...p, [tabKey]: false }));
    pdfBlobs.current[tabKey] = null;
    pdfFilenames.current[tabKey] = '';

    const fallbackFilename = `renoweb_${platform}_ads_report.pdf`;
    const apiFn = platform === 'google' ? generateGoogleAdsReport : generateMetaAdsReport;
    
    let brandName = payload.domain_or_advertiser || payload.page_url_or_keyword || '';
    if (brandName) brandName = brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const finalFilename = brandName 
      ? fallbackFilename.replace(`renoweb_${platform}`, `${brandName}_${platform}`) 
      : fallbackFilename.replace(`renoweb_${platform}`, `audit_${platform}`);

    try {
      const data = await apiFn(payload, (msg) => setAdsProgress(msg));
      const html = data.html_report || data.html || '';
      const ts = now();

      setAdsReport({ html, data, loading: false, error: '', timestamp: ts });
      setAdsProgress('');

      setPdfLoading((p) => ({ ...p, [tabKey]: true }));
      try {
        const blob = await convertHtmlToPdf(html, finalFilename);
        pdfBlobs.current[tabKey] = blob;
        pdfFilenames.current[tabKey] = finalFilename;
        setPdfReady((p) => ({ ...p, [tabKey]: true }));
      } catch (pdfErr) {
        console.warn('PDF generation failed:', pdfErr.message);
      } finally {
        setPdfLoading((p) => ({ ...p, [tabKey]: false }));
      }
    } catch (err) {
      setAdsReport((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Something went wrong. Please try again.',
      }));
      setAdsProgress('');
    }
  };

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
    linkedin_personal: { report: linkedinPersonalReport, setReport: setLinkedinPersonalReport, label: 'LinkedIn Personal', pdfKey: 'linkedin_personal', onSubmit: handleLinkedInPersonalSubmit },
    visual:    { report: visualReport,    setReport: setVisualReport,    label: 'Visual Brand Match',pdfKey: 'visual',    onSubmit: handleVisualSubmit },
    ads:       { report: adsReport,       setReport: setAdsReport,       label: 'Ads Audit',         pdfKey: 'ads',       onSubmit: handleAdsSubmit },
    'ui-ux':   { report: uiUxReport,      setReport: setUiUxReport,      label: 'UI/UX Audit',       pdfKey: 'ui_ux',     onSubmit: handleUiUxSubmit },
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
      {activeTab === 'linkedin_personal' && (
        <LinkedInPersonalForm
          loading={linkedinPersonalReport.loading}
          error={linkedinPersonalReport.error}
          onDismissError={() => dismissError(setLinkedinPersonalReport)}
          onSubmit={handleLinkedInPersonalSubmit}
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
      {activeTab === 'ads' && (
        <AdsAuditForm
          loading={adsReport.loading}
          error={adsReport.error}
          progress={adsProgress}
          onDismissError={() => dismissError(setAdsReport)}
          onSubmit={handleAdsSubmit}
        />
      )}
      {activeTab === 'ui-ux' && (
        <UiUxAuditForm
          loading={uiUxReport.loading}
          error={uiUxReport.error}
          progress={uiUxProgress}
          onDismissError={() => dismissError(setUiUxReport)}
          onSubmit={handleUiUxSubmit}
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
          <div className={`form-panel ${userProfile?.is_suspended ? 'suspended-form' : ''}`}>
            {userProfile?.is_suspended && (
                <div style={{ background: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Your account has been suspended</h4>
                        <p style={{ margin: 0, fontSize: '14px', marginTop: '4px' }}>Reason: {userProfile.suspension_reason || 'Please contact support.'}</p>
                    </div>
                </div>
            )}
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

        {/* ── Support Floating Button & Modal ── */}
        <button 
          onClick={() => setIsSupportOpen(true)}
          className="fixed bottom-8 right-8 z-[100] p-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center group"
          title="Help & Support"
        >
          <HelpCircle size={24} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold group-hover:pl-2 group-hover:pr-1">
            Support
          </span>
        </button>

        {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}
      </div>
    </>
  );
}
