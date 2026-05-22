'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';

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
};

export default function FullReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_full', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

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
        <div className="form-section-label">Website</div>

        <FormField label="Website Domain *" htmlFor="full-domain">
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
          <FormField label="Country Code" htmlFor="full-country">
            <input
              id="full-country"
              className="form-input"
              type="text"
              placeholder="in"
              value={fields.country}
              onChange={set('country')}
            />
          </FormField>
          <FormField label="Language Code" htmlFor="full-language">
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

        <FormField label="Seed Keywords (comma-separated)" htmlFor="full-keywords">
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
          <FormField label="Max Health URLs" htmlFor="full-health-urls">
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
        <div className="form-section-label">Instagram (optional)</div>

        <FormField label="Instagram Username" htmlFor="full-ig-username">
          <input
            id="full-ig-username"
            className="form-input"
            type="text"
            placeholder="@yourbrand"
            value={fields.ig_username}
            onChange={set('ig_username')}
          />
        </FormField>

        <FormField label="Instagram Results Limit" htmlFor="full-ig-limit">
          <input
            id="full-ig-limit"
            className="form-input"
            type="number"
            min={1}
            value={fields.ig_results_limit}
            onChange={set('ig_results_limit')}
          />
        </FormField>

        {/* ── LinkedIn ── */}
        <div className="form-section-label">LinkedIn (optional)</div>

        <FormField label="LinkedIn Company URL" htmlFor="full-li-url">
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

        <button
          id="btn-generate-full"
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <span aria-hidden="true">🚀</span>
              Generate Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}
