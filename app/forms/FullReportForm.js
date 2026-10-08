'use client';

import { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import { getMetaCountries, getGoogleRegions } from '../lib/api';
import { Globe, Camera, Briefcase, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';

const POSTED_OPTIONS = [
  { value: '24h',     label: 'Last 24 hours' },
  { value: 'week',    label: 'Last week' },
  { value: 'month',   label: 'Last month' },
  { value: '3months', label: 'Last 3 months' },
  { value: '6months', label: 'Last 6 months' },
  { value: 'year',    label: 'Last year' },
];

const DEFAULTS = {
  domain: '',
  ig_username: '',
  ig_results_limit: 25,
  linkedin_company_url: '',
  linkedin_results_limit: 25,
  linkedin_posted_limit: '3months',
  gmb_company_name: '',
  gmb_target_url: '',
  gmb_location_query: '',
  ui_ux_url: '',
  ads_platform: 'google',
  ads_google_domain: '',
  ads_google_region: 'anywhere',
  ads_google_time_period: 'last_30_days',
  ads_google_ad_format: 'all',
  ads_google_platform: 'all',
  ads_meta_query: '',
  ads_meta_country: 'ALL',
  ads_meta_media_type: 'all',
  ads_meta_active_status: 'all',
  ads_meta_platforms: ['facebook', 'instagram'],
  ads_limit: 20,
};

export default function FullReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_full', DEFAULTS);
  
  const [metaCountries, setMetaCountries] = useState([]);
  const [googleRegions, setGoogleRegions] = useState([]);

  useEffect(() => {
    getMetaCountries().then(data => {
      if (data && data.countries) {
        const sorted = [...data.countries].sort((a, b) => {
          const nameA = (typeof a === 'string' ? a : a.name) || '';
          const nameB = (typeof b === 'string' ? b : b.name) || '';
          return nameA.localeCompare(nameB);
        });
        setMetaCountries(sorted);
      }
    }).catch(() => {});
    
    getGoogleRegions().then(data => {
      if (data && data.regions) {
        const sorted = [...data.regions].sort((a, b) => {
          const nameA = (typeof a === 'string' ? a : a.name) || '';
          const nameB = (typeof b === 'string' ? b : b.name) || '';
          return nameA.localeCompare(nameB);
        });
        setGoogleRegions(sorted);
      }
    }).catch(() => {});
  }, []);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    ig: false,
    li: false,
    gmb: false,
    ui_ux: false,
    ads: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      domain: fields.domain.trim(),
      ...(fields.ig_username.trim() && {
        ig_username: fields.ig_username.trim(),
        ig_results_limit: Number(fields.ig_results_limit),
      }),
      ...(fields.linkedin_company_url.trim() && {
        linkedin_company_url: fields.linkedin_company_url.trim(),
        linkedin_results_limit: Number(fields.linkedin_results_limit),
        linkedin_posted_limit: fields.linkedin_posted_limit,
      }),
    };

    if (fields.gmb_company_name?.trim() && fields.gmb_target_url?.trim() && fields.gmb_location_query?.trim()) {
      payload.gmb_company_name = fields.gmb_company_name.trim();
      payload.gmb_target_url = fields.gmb_target_url.trim();
      payload.gmb_location_query = fields.gmb_location_query.trim();
    }

    if (fields.ui_ux_url?.trim()) {
      payload.ui_ux_url = fields.ui_ux_url.trim();
    }

    if (fields.ads_google_domain?.trim() || fields.ads_meta_query?.trim()) {
      payload.ads_platform = fields.ads_platform;
      payload.ads_limit = Number(fields.ads_limit);
      if (fields.ads_platform === 'google' && fields.ads_google_domain?.trim()) {
        payload.ads_google_domain = fields.ads_google_domain.trim();
        payload.ads_google_region = fields.ads_google_region;
        payload.ads_google_time_period = fields.ads_google_time_period;
        payload.ads_google_ad_format = fields.ads_google_ad_format;
        payload.ads_google_platform = fields.ads_google_platform;
      } else if (fields.ads_platform === 'meta' && fields.ads_meta_query?.trim()) {
        payload.ads_meta_query = fields.ads_meta_query.trim();
        payload.ads_meta_country = fields.ads_meta_country;
        payload.ads_meta_media_type = fields.ads_meta_media_type;
        payload.ads_meta_active_status = fields.ads_meta_active_status;
        payload.ads_meta_platforms = fields.ads_meta_platforms;
      }
    }

    onSubmit(payload);
  };

  return (
    <form id="form-full-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Full Report</h2>
      <p className="form-panel-subtitle">
        Comprehensive audit combining SEO, social, and visual brand analysis.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>

        {/* ── Website ── */}
        <div className="form-section-header">
          <div className="section-icon-chip">
            <Globe size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">Website</div>
        </div>

        <FormField label="Website Domain" htmlFor="full-domain" required tooltip="The primary domain to audit">
          <input
            id="full-domain"
            className="form-input"
            type="text"
            placeholder="e.g. example.com"
            value={fields.domain}
            onChange={set('domain')}
            required
          />
        </FormField>

        {/* ── Instagram ── */}
        <div 
          className="form-section-header clickable"
          onClick={() => toggleSection('ig')}
        >
          <div className="section-icon-chip">
            <Camera size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Instagram
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown 
            size={18} 
            className="accordion-chevron" 
            style={{ transform: openSections.ig ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
          />
        </div>

        <div className={`accordion-content ${openSections.ig ? 'open' : ''}`}>
          <div className="form-grid">
            <FormField label="Instagram Username" htmlFor="full-ig-username" tooltip="Brand's handle without the @ symbol">
              <input
                id="full-ig-username"
                className="form-input"
                type="text"
                placeholder="yourbrand"
                value={fields.ig_username}
                onChange={set('ig_username')}
              />
            </FormField>

            <FormField label="Instagram Results Limit" htmlFor="full-ig-limit" tooltip="Number of recent posts to analyze">
              <input
                id="full-ig-limit"
                className="form-input"
                type="number"
                min={1}
                value={fields.ig_results_limit}
                onChange={set('ig_results_limit')}
              />
            </FormField>
          </div>
        </div>

        {/* ── LinkedIn ── */}
        <div 
          className="form-section-header clickable"
          onClick={() => toggleSection('li')}
        >
          <div className="section-icon-chip">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            LinkedIn
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown 
            size={18} 
            className="accordion-chevron" 
            style={{ transform: openSections.li ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
          />
        </div>

        <div className={`accordion-content ${openSections.li ? 'open' : ''}`}>
          <div className="form-grid">
            <FormField label="LinkedIn Company URL" htmlFor="full-li-url" tooltip="Full URL to the company page">
              <input
                id="full-li-url"
                className="form-input"
                type="url"
                placeholder="https://linkedin.com/company/yourbrand"
                value={fields.linkedin_company_url}
                onChange={set('linkedin_company_url')}
              />
            </FormField>

            <div className="form-grid-2">
              <FormField label="Results Limit" htmlFor="full-li-limit">
                <input
                  id="full-li-limit"
                  className="form-input"
                  type="number"
                  min={1}
                  value={fields.linkedin_results_limit}
                  onChange={set('linkedin_results_limit')}
                />
              </FormField>
              <FormField label="Time Range" htmlFor="full-li-posted">
                <select
                  id="full-li-posted"
                  className="form-select"
                  value={fields.linkedin_posted_limit}
                  onChange={set('linkedin_posted_limit')}
                >
                  {POSTED_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </div>

        {/* ── GMB ── */}
        <div 
          className="form-section-header clickable"
          onClick={() => toggleSection('gmb')}
        >
          <div className="section-icon-chip">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Google Business Profile
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown 
            size={18} 
            className="accordion-chevron" 
            style={{ transform: openSections.gmb ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
          />
        </div>

        <div className={`accordion-content ${openSections.gmb ? 'open' : ''}`}>
          <div className="form-grid">
            <FormField label="Business Name" htmlFor="full-gmb-company-name">
              <input
                id="full-gmb-company-name"
                className="form-input"
                type="text"
                placeholder='e.g. "Evolve Chiropractic"'
                value={fields.gmb_company_name || ''}
                onChange={set('gmb_company_name')}
              />
            </FormField>

            <FormField label="Google Maps URL" htmlFor="full-gmb-target-url" tooltip="Paste the full Google Maps link for the business">
              <input
                id="full-gmb-target-url"
                className="form-input"
                type="url"
                placeholder='https://www.google.com/maps/place/...'
                value={fields.gmb_target_url || ''}
                onChange={set('gmb_target_url')}
              />
            </FormField>

            <FormField label="Location/Neighborhood" htmlFor="full-gmb-location-query" tooltip="Used for local pack ranking comparison">
              <input
                id="full-gmb-location-query"
                className="form-input"
                type="text"
                placeholder='e.g. "Minneapolis, MN"'
                value={fields.gmb_location_query || ''}
                onChange={set('gmb_location_query')}
              />
            </FormField>
          </div>
        </div>

        {/* ── UI/UX Audit ── */}
        <div 
          className="form-section-header clickable"
          onClick={() => toggleSection('ui_ux')}
        >
          <div className="section-icon-chip">
            <Sparkles size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            UI/UX Audit
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown 
            size={18} 
            className="accordion-chevron" 
            style={{ transform: openSections.ui_ux ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
          />
        </div>

        <div className={`accordion-content ${openSections.ui_ux ? 'open' : ''}`}>
          <div className="form-grid">
            <FormField label="Target Website URL" htmlFor="full-ui-ux-url" tooltip="The exact page URL to audit">
              <input
                id="full-ui-ux-url"
                className="form-input"
                type="url"
                placeholder="https://example.com/landing-page"
                value={fields.ui_ux_url || ''}
                onChange={set('ui_ux_url')}
              />
            </FormField>
          </div>
        </div>

        {/* ── Ads Library ── */}
        <div 
          className="form-section-header clickable"
          onClick={() => toggleSection('ads')}
        >
          <div className="section-icon-chip">
            <Globe size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Ads Library Audit
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown 
            size={18} 
            className="accordion-chevron" 
            style={{ transform: openSections.ads ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
          />
        </div>

        <div className={`accordion-content ${openSections.ads ? 'open' : ''}`}>
          <div className="form-grid">
            <FormField label="Platform" htmlFor="full-ads-platform">
              <select
                id="full-ads-platform"
                className="form-select"
                value={fields.ads_platform || 'google'}
                onChange={set('ads_platform')}
              >
                <option value="google">Google Ads Transparency</option>
                <option value="meta">Meta Ads Library</option>
              </select>
            </FormField>

            <FormField label="Results Limit" htmlFor="full-ads-limit">
              <input
                id="full-ads-limit"
                className="form-input"
                type="number"
                min={1}
                max={100}
                value={fields.ads_limit}
                onChange={set('ads_limit')}
              />
            </FormField>

            {(fields.ads_platform || 'google') === 'google' ? (
              <>
                <FormField label="Google Domain / Keyword" htmlFor="full-ads-google">
                  <input
                    id="full-ads-google"
                    className="form-input"
                    type="text"
                    placeholder="nike.com or Nike"
                    value={fields.ads_google_domain || ''}
                    onChange={set('ads_google_domain')}
                  />
                </FormField>
                
                <div className="form-grid-2">
                  <FormField label="Target Region" htmlFor="full-ads-g-region">
                    <select id="full-ads-g-region" className="form-select" value={fields.ads_google_region} onChange={set('ads_google_region')}>
                      {googleRegions.length > 0 ? (
                        googleRegions.map((r, i) => <option key={`gr_${i}`} value={r.region || r.code || (typeof r === 'string' ? r : '')}>{r.name || r}</option>)
                      ) : (
                        <option value="anywhere">Anywhere</option>
                      )}
                    </select>
                  </FormField>
                  <FormField label="Time Period" htmlFor="full-ads-g-time">
                    <select id="full-ads-g-time" className="form-select" value={fields.ads_google_time_period} onChange={set('ads_google_time_period')}>
                      <option value="last_30_days">Last 30 days</option>
                      <option value="last_3_months">Last 3 months</option>
                      <option value="last_6_months">Last 6 months</option>
                      <option value="any">Any time</option>
                    </select>
                  </FormField>
                </div>
                
                <div className="form-grid-2">
                  <FormField label="Ad Format" htmlFor="full-ads-g-format">
                    <select id="full-ads-g-format" className="form-select" value={fields.ads_google_ad_format} onChange={set('ads_google_ad_format')}>
                      <option value="all">All Formats</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </FormField>
                  <FormField label="Google Platform" htmlFor="full-ads-g-platform">
                    <select id="full-ads-g-platform" className="form-select" value={fields.ads_google_platform} onChange={set('ads_google_platform')}>
                      <option value="all">All Platforms</option>
                      <option value="google_search">Google Search</option>
                      <option value="youtube">YouTube</option>
                      <option value="google_play">Google Play</option>
                      <option value="google_maps">Google Maps</option>
                    </select>
                  </FormField>
                </div>
              </>
            ) : (
              <>
                <FormField label="Meta Page Name" htmlFor="full-ads-meta">
                  <input
                    id="full-ads-meta"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Nike"
                    value={fields.ads_meta_query || ''}
                    onChange={set('ads_meta_query')}
                  />
                </FormField>
                
                <div className="form-grid-2">
                  <FormField label="Target Country" htmlFor="full-ads-m-country">
                    <select id="full-ads-m-country" className="form-select" value={fields.ads_meta_country} onChange={set('ads_meta_country')}>
                      {metaCountries.length > 0 ? (
                        metaCountries.map((c, i) => <option key={`mc_${i}`} value={c.code || (typeof c === 'string' ? c : '')}>{c.name || c}</option>)
                      ) : (
                        <option value="US">United States (US)</option>
                      )}
                    </select>
                  </FormField>
                  <FormField label="Media Type" htmlFor="full-ads-m-media">
                    <select id="full-ads-m-media" className="form-select" value={fields.ads_meta_media_type} onChange={set('ads_meta_media_type')}>
                      <option value="all">All Media</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="meme">Meme</option>
                      <option value="image_and_meme">Image & Meme</option>
                      <option value="none">No Media</option>
                    </select>
                  </FormField>
                </div>
                
                <FormField label="Active Status" htmlFor="full-ads-m-status">
                  <select id="full-ads-m-status" className="form-select" value={fields.ads_meta_active_status} onChange={set('ads_meta_active_status')}>
                    <option value="all">All</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </FormField>
              </>
            )}
          </div>
        </div>

        <AnimatedSubmitButton 
          loading={loading}
          defaultText="Generate Report"
        />
      </div>
    </form>
  );
}
