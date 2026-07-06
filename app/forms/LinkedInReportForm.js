'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';
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
  linkedin_company_url: '',
  linkedin_results_limit: 25,
  posted_limit: '3months',
};

export default function LinkedInReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_linkedin', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      linkedin_company_url: fields.linkedin_company_url.trim(),
      linkedin_results_limit: Number(fields.linkedin_results_limit),
      posted_limit: fields.posted_limit,
    });
  };

  return (
    <form id="form-linkedin-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">LinkedIn Audit</h2>
      <p className="form-panel-subtitle">
        Evaluate company page activity, content performance, and post cadence.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="LinkedIn Company URL" htmlFor="li-url" required tooltip="Full URL to the company page">
          <input
            id="li-url"
            className="form-input"
            type="url"
            placeholder="https://linkedin.com/company/yourbrand"
            value={fields.linkedin_company_url}
            onChange={set('linkedin_company_url')}
            required
          />
        </FormField>

        <div className="form-grid-2">
          <FormField label="Results Limit" htmlFor="li-results-limit">
            <input
              id="li-results-limit"
              className="form-input"
              type="number"
              min={1}
              max={200}
              value={fields.linkedin_results_limit}
              onChange={set('linkedin_results_limit')}
            />
          </FormField>

          <FormField label="Time Range" htmlFor="li-posted-limit">
            <select
              id="li-posted-limit"
              className="form-select"
              value={fields.posted_limit}
              onChange={set('posted_limit')}
            >
              {POSTED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        <AnimatedSubmitButton 
          loading={loading}
          disabled={!fields.linkedin_company_url.trim()}
          defaultText="Generate Report"
        />
      </div>
    </form>
  );
}
