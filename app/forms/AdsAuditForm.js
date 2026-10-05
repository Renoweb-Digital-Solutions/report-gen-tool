'use client';

import { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';
import { useSessionState } from '../hooks/useSessionState';
import { getMetaCountries, getGoogleRegions, searchMetaPages, searchGoogleAdvertisers } from '../lib/api';

const DEFAULTS = {
  platform: 'google',
  limit: 10,

  // Meta fields
  meta_query: '',
  meta_page_id: '',
  meta_country: 'US',
  meta_ad_type: 'all',
  meta_start_date: '',
  meta_end_date: '',
  meta_active_status: 'all',
  meta_media_type: 'all',
  meta_platforms: ['facebook', 'instagram'],

  // Google fields
  google_domain: '',
  google_advertiser_id: '',
  google_region: 'ANYWHERE',
  google_time_period: 'last_3_months',
  google_ad_format: 'video',
  google_platform: 'all',
};

export default function AdsAuditForm({ loading, error, onDismissError, onSubmit, progress }) {
  const [fields, setFields] = useSessionState('form_ads_audit_v2', DEFAULTS);

  // Options state
  const [metaCountries, setMetaCountries] = useState([]);
  const [googleRegions, setGoogleRegions] = useState([]);

  // Search state
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [metaPageCandidates, setMetaPageCandidates] = useState([]);
  const [googleAdvCandidates, setGoogleAdvCandidates] = useState([]);
  const [candidateError, setCandidateError] = useState('');

  // Fetch options on mount
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

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCheckbox = (key, val) => (e) => {
    setFields((prev) => {
      const arr = prev[key] || [];
      if (e.target.checked) {
        return { ...prev, [key]: [...arr, val] };
      } else {
        return { ...prev, [key]: arr.filter(item => item !== val) };
      }
    });
  };

  const handleSearchMetaPages = async () => {
    if (!fields.meta_query) return;
    setIsSearchingCandidates(true);
    setCandidateError('');
    setMetaPageCandidates([]);
    try {
      const data = await searchMetaPages({
        query: fields.meta_query,
        meta_country: fields.meta_country,
        meta_ad_type: fields.meta_ad_type
      });
      const pages = data.pages || data.results || data.data || (Array.isArray(data) ? data : []);
      if (pages.length > 0) {
        setMetaPageCandidates(pages);
      } else {
        setCandidateError('No pages found for this keyword.');
      }
    } catch (err) {
      setCandidateError(err.message || 'Error searching pages');
    }
    setIsSearchingCandidates(false);
  };

  const handleSearchGoogleAdvertisers = async () => {
    if (!fields.google_domain) return;
    setIsSearchingCandidates(true);
    setCandidateError('');
    setGoogleAdvCandidates([]);
    try {
      const data = await searchGoogleAdvertisers({
        query: fields.google_domain,
        google_region: fields.google_region,
        limit: 10
      });
      const advs = data.advertisers || data.results || data.data || (Array.isArray(data) ? data : []);
      if (advs.length > 0) {
        setGoogleAdvCandidates(advs);
      } else {
        setCandidateError('No advertisers found for this keyword/domain.');
      }
    } catch (err) {
      setCandidateError(err.message || 'Error searching advertisers');
    }
    setIsSearchingCandidates(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      platform: fields.platform,
      limit: Number(fields.limit)
    };

    if (fields.platform === 'google') {
      payload.google_domain = fields.google_domain;
      payload.google_advertiser_id = fields.google_advertiser_id || null;
      payload.google_region = fields.google_region;
      payload.google_time_period = fields.google_time_period === 'any' ? null : fields.google_time_period;
      payload.google_ad_format = fields.google_ad_format === 'all' ? null : fields.google_ad_format;
      payload.google_platform = fields.google_platform === 'all' ? null : fields.google_platform;
    } else {
      payload.meta_query = fields.meta_query;
      payload.meta_page_id = fields.meta_page_id || null;
      payload.meta_country = fields.meta_country;
      payload.meta_ad_type = fields.meta_ad_type;
      payload.meta_active_status = fields.meta_active_status;
      payload.meta_media_type = fields.meta_media_type;
      payload.meta_platforms = fields.meta_platforms;
      
      if (fields.meta_start_date) payload.meta_start_date = fields.meta_start_date;
      if (fields.meta_end_date) payload.meta_end_date = fields.meta_end_date;
    }

    onSubmit(fields.platform, payload);
  };

  const isGoogle = fields.platform === 'google';

  const isFormValid = isGoogle 
    ? (fields.google_domain || fields.google_advertiser_id) 
    : (fields.meta_query || fields.meta_page_id);

  return (
    <form id="form-ads-audit" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Ads Library Audit</h2>
      <p className="form-panel-subtitle">
        Audit Google Ads Transparency Center or Meta Ads Library with in-depth analysis.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}
      {candidateError && <ErrorBanner message={candidateError} onDismiss={() => setCandidateError('')} />}

      <div className="form-grid" style={{ marginTop: error || candidateError ? 16 : 0 }}>
        
        {/* PLATFORM SELECTOR */}
        <FormField label="Platform" htmlFor="ads-platform">
          <select
            id="ads-platform"
            className="form-select"
            value={fields.platform}
            onChange={(e) => {
                set('platform')(e);
                setMetaPageCandidates([]);
                setGoogleAdvCandidates([]);
            }}
            disabled={loading}
          >
            <option value="google">Google Ads Transparency</option>
            <option value="meta">Meta Ads Library</option>
          </select>
        </FormField>
        
        <FormField label="Results Limit" htmlFor="ads-limit">
          <input
            id="ads-limit"
            className="form-input"
            type="number"
            min={1}
            max={100}
            value={fields.limit}
            onChange={set('limit')}
            disabled={loading}
          />
        </FormField>

        {isGoogle ? (
          <>
            {/* GOOGLE FIELDS */}
            <div className="col-span-1 sm:col-span-2">
              <FormField label="Domain or Keyword" htmlFor="g-query" required>
                <div className="flex gap-2">
                  <input
                    id="g-query"
                    className="form-input flex-1"
                    type="text"
                    placeholder="nike.com or Nike"
                    value={fields.google_domain}
                    onChange={set('google_domain')}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium whitespace-nowrap"
                    onClick={handleSearchGoogleAdvertisers}
                    disabled={!fields.google_domain || loading || isSearchingCandidates}
                  >
                    {isSearchingCandidates ? 'Searching...' : 'Find Advertiser'}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <FormField label="Target Region" htmlFor="g-region">
                <select id="g-region" className="form-select" value={fields.google_region} onChange={set('google_region')} disabled={loading}>
                  {googleRegions.length > 0 ? (
                    googleRegions.map((r, i) => <option key={`gr_${i}`} value={r.region || r.code || (typeof r === 'string' ? r : '')}>{r.name || r}</option>)
                  ) : (
                    <option value="ANYWHERE">Anywhere</option>
                  )}
                </select>
              </FormField>
            </div>

            {googleAdvCandidates.length > 0 && (
              <div className="col-span-1 sm:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Select an Advertiser (Optional but recommended):</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  <div className={`p-2 border rounded cursor-pointer ${!fields.google_advertiser_id ? 'bg-blue-50 border-blue-500' : 'bg-white'}`} onClick={() => setFields(p => ({...p, google_advertiser_id: ''}))}>
                    <div className="font-medium text-sm">Do not specify (Use keyword only)</div>
                  </div>
                  {googleAdvCandidates.map((adv, idx) => {
                    const advId = adv.advertiser_id || adv.id;
                    return (
                    <div 
                      key={`gadv_${idx}_${advId}`} 
                      className={`p-2 border rounded cursor-pointer ${fields.google_advertiser_id === advId ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                      onClick={() => setFields(p => ({...p, google_advertiser_id: advId}))}
                    >
                      <div className="font-medium text-sm text-gray-900">{adv.name}</div>
                      <div className="text-xs text-gray-500">ID: {advId} {adv.location ? `• ${adv.location}` : ''}</div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Time Period" htmlFor="g-time">
                <select id="g-time" className="form-select" value={fields.google_time_period} onChange={set('google_time_period')} disabled={loading}>
                  <option value="any">Any time</option>
                  <option value="last_30_days">Last 30 days</option>
                  <option value="last_3_months">Last 3 months</option>
                  <option value="last_6_months">Last 6 months</option>
                </select>
              </FormField>

              <FormField label="Ad Format" htmlFor="g-format">
                <select id="g-format" className="form-select" value={fields.google_ad_format} onChange={set('google_ad_format')} disabled={loading}>
                  <option value="all">All Formats</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </FormField>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <FormField label="Google Platform" htmlFor="g-platform">
                <select id="g-platform" className="form-select" value={fields.google_platform} onChange={set('google_platform')} disabled={loading}>
                  <option value="all">All Platforms</option>
                  <option value="google_search">Google Search</option>
                  <option value="youtube">YouTube</option>
                  <option value="google_play">Google Play</option>
                  <option value="google_maps">Google Maps</option>
                  <option value="google_shopping">Google Shopping</option>
                </select>
              </FormField>
            </div>
          </>
        ) : (
          <>
            {/* META FIELDS */}
            <div className="col-span-1 sm:col-span-2">
              <FormField label="Search Keyword" htmlFor="m-query" required>
                <div className="flex gap-2">
                  <input
                    id="m-query"
                    className="form-input flex-1"
                    type="text"
                    placeholder="e.g. Nike"
                    value={fields.meta_query}
                    onChange={set('meta_query')}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium whitespace-nowrap"
                    onClick={handleSearchMetaPages}
                    disabled={!fields.meta_query || loading || isSearchingCandidates}
                  >
                    {isSearchingCandidates ? 'Searching...' : 'Search Pages'}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <FormField label="Target Country" htmlFor="m-country">
                <select id="m-country" className="form-select" value={fields.meta_country} onChange={set('meta_country')} disabled={loading}>
                  {metaCountries.length > 0 ? (
                    metaCountries.map((c, i) => <option key={`mc_${i}`} value={c.code || (typeof c === 'string' ? c : '')}>{c.name || c}</option>)
                  ) : (
                    <option value="US">United States (US)</option>
                  )}
                </select>
              </FormField>
            </div>

            {metaPageCandidates.length > 0 && (
              <div className="col-span-1 sm:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Select a Page (Optional but recommended):</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  <div className={`p-2 border rounded cursor-pointer ${!fields.meta_page_id ? 'bg-blue-50 border-blue-500' : 'bg-white'}`} onClick={() => setFields(p => ({...p, meta_page_id: ''}))}>
                    <div className="font-medium text-sm">Do not specify (Use keyword only)</div>
                  </div>
                  {metaPageCandidates.map((page, idx) => {
                    const pageId = page.page_id || page.id;
                    const pageName = page.page_name || page.name || page.title;
                    const pageAvatar = page.profile_pic_url || page.image || page.avatar;
                    return (
                    <div 
                      key={`mpage_${idx}_${pageId}`} 
                      className={`p-2 border rounded cursor-pointer flex items-center gap-3 ${fields.meta_page_id === pageId ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                      onClick={() => setFields(p => ({...p, meta_page_id: pageId}))}
                    >
                      {pageAvatar && <img src={pageAvatar} alt="" className="w-10 h-10 rounded-full" />}
                      <div>
                        <div className="font-medium text-sm text-gray-900">{pageName || `Unknown Page`}</div>
                        <div className="text-xs text-gray-500">ID: {pageId}</div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Media Type" htmlFor="m-media">
                <select id="m-media" className="form-select" value={fields.meta_media_type} onChange={set('meta_media_type')} disabled={loading}>
                  <option value="all">All Media</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="meme">Meme</option>
                  <option value="image_and_meme">Image & Meme</option>
                  <option value="none">No Media</option>
                </select>
              </FormField>

              <FormField label="Active Status" htmlFor="m-status">
                <select id="m-status" className="form-select" value={fields.meta_active_status} onChange={set('meta_active_status')} disabled={loading}>
                  <option value="all">All</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </FormField>
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <label className="form-label block mb-2 text-[#081a3a] font-bold text-sm">Placements</label>
              <div className="flex flex-wrap gap-4">
                {['facebook', 'instagram', 'audience_network', 'messenger', 'threads'].map(p => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#081a3a]">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#b7d0ff] text-blue-600 focus:ring-blue-500"
                      checked={fields.meta_platforms.includes(p)}
                      onChange={handleCheckbox('meta_platforms', p)}
                      disabled={loading}
                    />
                    {p.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        
        {loading && progress && (
          <div className="col-span-1 sm:col-span-2 p-4 bg-blue-50 border border-blue-100 rounded-xl mt-2 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-blue-800">{progress}</span>
            </div>
          </div>
        )}

        <div className="col-span-1 sm:col-span-2 mt-2">
          <AnimatedSubmitButton 
            loading={loading}
            disabled={!isFormValid}
            defaultText="Generate Ads Audit"
          />
        </div>
      </div>
    </form>
  );
}
