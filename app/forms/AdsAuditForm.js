'use client';

import { useState } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';
import { useSessionState } from '../hooks/useSessionState';

const DEFAULTS = {
  platform: 'google',
  target: '',
  results_limit: 10,
};

export default function AdsAuditForm({ loading, error, onDismissError, onSubmit, progress }) {
  const [fields, setFields] = useSessionState('form_ads_audit', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      results_limit: Number(fields.results_limit)
    };

    if (fields.platform === 'google') {
      payload.domain_or_advertiser = fields.target.trim();
    } else {
      payload.page_url_or_keyword = fields.target.trim();
    }

    onSubmit(fields.platform, payload);
  };

  const isGoogle = fields.platform === 'google';

  return (
    <form id="form-ads-audit" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Ads Audit Generator</h2>
      <p className="form-panel-subtitle">
        Audit Google Ads or Meta Ads for a specific brand or keyword in real-time.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="Platform" htmlFor="ads-platform">
          <select
            id="ads-platform"
            className="form-select"
            value={fields.platform}
            onChange={set('platform')}
            disabled={loading}
          >
            <option value="google">Google Ads</option>
            <option value="meta">Meta Ads</option>
          </select>
        </FormField>

        <FormField 
          label={isGoogle ? "Domain or Advertiser" : "Page URL or Keyword"} 
          htmlFor="ads-target" 
          required 
          tooltip={isGoogle ? "Enter a domain (e.g., nike.com) to scrape Google Ads." : "Enter a Facebook Page URL or a keyword to scrape Meta Ads."}
        >
          <input
            id="ads-target"
            className="form-input"
            type="text"
            placeholder={isGoogle ? "nike.com" : "Nike"}
            value={fields.target}
            onChange={set('target')}
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Results Limit" htmlFor="ads-results-limit">
          <input
            id="ads-results-limit"
            className="form-input"
            type="number"
            min={1}
            max={50}
            value={fields.results_limit}
            onChange={set('results_limit')}
            disabled={loading}
          />
        </FormField>
        
        {loading && progress && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-2 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-blue-800">{progress}</span>
            </div>
          </div>
        )}

        <AnimatedSubmitButton 
          loading={loading}
          disabled={!fields.target.trim()}
          defaultText="Generate Ads Audit"
        />
      </div>
    </form>
  );
}
