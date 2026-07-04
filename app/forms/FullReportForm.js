'use client';

import { useState } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import { searchGmbBusinesses } from '../lib/api';
import { Globe, Camera, Briefcase, MapPin, ChevronDown, Sparkles } from 'lucide-react';

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
  country: 'in',
  language: 'en',
  business_seed_keywords: '',
  max_keyword_seeds: 5,
  keyword_limit_per_seed: 80,
  max_health_urls: 100,
  health_timeout_per_url_secs: 30,
  ig_username: '',
  ig_results_limit: 25,
  linkedin_company_url: '',
  linkedin_results_limit: 25,
  linkedin_posted_limit: '3months',
  gmb_business_query: '',
  gmb_max_results: 20,
  gmb_places: [],
  gmb_selected_place_id: '',
  gmb_location_query: '',
};

export default function FullReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_full', DEFAULTS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
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

  const handleSearch = async () => {
    if (!(fields.gmb_business_query || '').trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    try {
      const result = await searchGmbBusinesses({
        business_query: (fields.gmb_business_query || '').trim(),
        max_results: Number(fields.gmb_max_results),
      });
      if (result.success && result.places && result.places.length > 0) {
        setFields(prev => ({ 
          ...prev, 
          gmb_places: result.places,
          gmb_selected_place_id: result.places[0].placeId 
        }));
      } else {
        setFields(prev => ({ ...prev, gmb_places: [], gmb_selected_place_id: '' }));
        setSearchError('No businesses found matching that query.');
      }
    } catch (err) {
      setFields(prev => ({ ...prev, gmb_places: [], gmb_selected_place_id: '' }));
      setSearchError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const dismissSearchError = () => setSearchError('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      domain: fields.domain.trim(),
      country: fields.country.trim() || 'in',
      language: fields.language.trim() || 'en',
      business_seed_keywords: fields.business_seed_keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      max_keyword_seeds: Number(fields.max_keyword_seeds),
      keyword_limit_per_seed: Number(fields.keyword_limit_per_seed),
      max_health_urls: Number(fields.max_health_urls),
      health_timeout_per_url_secs: Number(fields.health_timeout_per_url_secs),
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

    if (fields.gmb_selected_place_id && (fields.gmb_location_query || '').trim()) {
      const place = fields.gmb_places.find(p => p.placeId === fields.gmb_selected_place_id);
      if (place) {
        payload.gmb_company_name = place.title;
        payload.gmb_target_url = `https://www.google.com/maps/place/?q=place_id:${place.placeId}`;
        payload.gmb_location_query = (fields.gmb_location_query || '').trim();
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
      {searchError && <ErrorBanner message={searchError} onDismiss={dismissSearchError} />}

      <div className="form-grid" style={{ marginTop: (error || searchError) ? 16 : 0 }}>

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

        <div className="form-grid-2">
          <FormField label="Country Code" htmlFor="full-country" tooltip="2-letter ISO country code for search results">
            <input
              id="full-country"
              className="form-input"
              type="text"
              placeholder="in"
              value={fields.country}
              onChange={set('country')}
            />
          </FormField>
          <FormField label="Language Code" htmlFor="full-language" tooltip="2-letter language code">
            <input
              id="full-language"
              className="form-input"
              type="text"
              placeholder="en"
              value={fields.language}
              onChange={set('language')}
            />
          </FormField>
        </div>

        <FormField label="Seed Keywords (comma-separated)" htmlFor="full-keywords" tooltip="Base topics to generate keyword variations from">
          <textarea
            id="full-keywords"
            className="form-textarea"
            placeholder="digital marketing, web design, SEO agency"
            value={fields.business_seed_keywords}
            onChange={set('business_seed_keywords')}
          />
        </FormField>

        <div className="form-grid-2">
          <FormField label="Max Keyword Seeds" htmlFor="full-max-seeds">
            <input
              id="full-max-seeds"
              className="form-input"
              type="number"
              min={1}
              value={fields.max_keyword_seeds}
              onChange={set('max_keyword_seeds')}
            />
          </FormField>
          <FormField label="Keywords per Seed" htmlFor="full-kw-limit">
            <input
              id="full-kw-limit"
              className="form-input"
              type="number"
              min={1}
              value={fields.keyword_limit_per_seed}
              onChange={set('keyword_limit_per_seed')}
            />
          </FormField>
        </div>

        <div className="form-grid-2">
          <FormField label="Max Health URLs" htmlFor="full-health-urls" tooltip="Maximum number of pages to crawl for the health audit">
            <input
              id="full-health-urls"
              className="form-input"
              type="number"
              min={1}
              value={fields.max_health_urls}
              onChange={set('max_health_urls')}
            />
          </FormField>
          <FormField label="URL Timeout (secs)" htmlFor="full-timeout">
            <input
              id="full-timeout"
              className="form-input"
              type="number"
              min={1}
              value={fields.health_timeout_per_url_secs}
              onChange={set('health_timeout_per_url_secs')}
            />
          </FormField>
        </div>

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
            <FormField label="Search Business Name" htmlFor="full-gmb-business-query" tooltip="Find the Google Maps listing for this brand">
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="full-gmb-business-query"
                  className="form-input"
                  type="text"
                  placeholder='e.g. "Dental clinics in Howrah"'
                  value={fields.gmb_business_query || ''}
                  onChange={set('gmb_business_query')}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSearch}
                  disabled={isSearching || !(fields.gmb_business_query || '').trim()}
                  style={{ 
                    width: 'auto', 
                    padding: '0 16px', 
                    margin: 0,
                    opacity: (isSearching || !(fields.gmb_business_query || '').trim()) ? 0.7 : 1 
                  }}
                >
                  {isSearching ? '...' : 'Search'}
                </button>
              </div>
            </FormField>

            {fields.gmb_places && fields.gmb_places.length > 0 && (
              <FormField label="Select Your Business" htmlFor="full-gmb-selected-place">
                <select
                  id="full-gmb-selected-place"
                  className="form-input"
                  value={fields.gmb_selected_place_id}
                  onChange={set('gmb_selected_place_id')}
                >
                  {fields.gmb_places.map((place, idx) => (
                    <option key={place.placeId || idx} value={place.placeId}>
                      {place.title} ({place.address})
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {fields.gmb_places && fields.gmb_places.length > 0 && (
              <FormField label="Competitor Location/Neighborhood" htmlFor="full-gmb-location-query" required tooltip="Used for local pack ranking comparison">
                <input
                  id="full-gmb-location-query"
                  className="form-input"
                  type="text"
                  placeholder='e.g. "Brooklyn, NY" or "Howrah, West Bengal"'
                  value={fields.gmb_location_query || ''}
                  onChange={set('gmb_location_query')}
                  required
                />
              </FormField>
            )}
          </div>
        </div>

        <button
          id="btn-generate-full"
          type="submit"
          className={`btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {!loading && (
            <>
              <Sparkles size={18} strokeWidth={2.5} />
              Generate Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}
