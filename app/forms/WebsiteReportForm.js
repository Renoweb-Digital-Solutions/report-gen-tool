'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';

const DEFAULTS = {
  domain: '',
  country: 'in',
  language: 'en',
  business_seed_keywords: '',
  max_keyword_seeds: 5,
  keyword_limit_per_seed: 80,
  max_health_urls: 100,
  health_timeout_per_url_secs: 30,
};

export default function WebsiteReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_website', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
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
    });
  };

  return (
    <form id="form-website-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Website Anatomy</h2>
      <p className="form-panel-subtitle">
        Deep SEO & technical health analysis of your web presence.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="Website Domain *" htmlFor="web-domain">
          <input
            id="web-domain"
            className="form-input"
            type="text"
            placeholder="e.g. example.com"
            value={fields.domain}
            onChange={set('domain')}
            required
          />
        </FormField>

        <div className="form-grid-2">
          <FormField label="Country Code" htmlFor="web-country">
            <input
              id="web-country"
              className="form-input"
              type="text"
              placeholder="in"
              value={fields.country}
              onChange={set('country')}
            />
          </FormField>
          <FormField label="Language Code" htmlFor="web-language">
            <input
              id="web-language"
              className="form-input"
              type="text"
              placeholder="en"
              value={fields.language}
              onChange={set('language')}
            />
          </FormField>
        </div>

        <FormField label="Seed Keywords (comma-separated)" htmlFor="web-keywords">
          <textarea
            id="web-keywords"
            className="form-textarea"
            placeholder="seo services, website audit, backlink analysis"
            value={fields.business_seed_keywords}
            onChange={set('business_seed_keywords')}
          />
        </FormField>

        <div className="form-grid-2">
          <FormField label="Max Keyword Seeds" htmlFor="web-max-seeds">
            <input
              id="web-max-seeds"
              className="form-input"
              type="number"
              min={1}
              value={fields.max_keyword_seeds}
              onChange={set('max_keyword_seeds')}
            />
          </FormField>
          <FormField label="Keywords per Seed" htmlFor="web-kw-limit">
            <input
              id="web-kw-limit"
              className="form-input"
              type="number"
              min={1}
              value={fields.keyword_limit_per_seed}
              onChange={set('keyword_limit_per_seed')}
            />
          </FormField>
        </div>

        <div className="form-grid-2">
          <FormField label="Max Health URLs" htmlFor="web-health-urls">
            <input
              id="web-health-urls"
              className="form-input"
              type="number"
              min={1}
              value={fields.max_health_urls}
              onChange={set('max_health_urls')}
            />
          </FormField>
          <FormField label="URL Timeout (secs)" htmlFor="web-timeout">
            <input
              id="web-timeout"
              className="form-input"
              type="number"
              min={1}
              value={fields.health_timeout_per_url_secs}
              onChange={set('health_timeout_per_url_secs')}
            />
          </FormField>
        </div>

        <button
          id="btn-generate-website"
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner" aria-hidden="true" />Generating…</>
          ) : (
            <><span aria-hidden="true">🔍</span>Generate Report</>
          )}
        </button>
      </div>
    </form>
  );
}
