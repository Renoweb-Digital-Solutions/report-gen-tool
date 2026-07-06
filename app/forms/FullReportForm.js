'use client';

import { useState } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
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
};

export default function FullReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_full', DEFAULTS);
  // Accordion state
  const [openSections, setOpenSections] = useState({
    ig: false,
    li: false,
    gmb: false,
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
            color="rgba(25,25,25,0.4)" 
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
            color="rgba(25,25,25,0.4)" 
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
            color="rgba(25,25,25,0.4)" 
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

        <AnimatedSubmitButton 
          loading={loading}
          defaultText="Generate Report"
        />
      </div>
    </form>
  );
}
