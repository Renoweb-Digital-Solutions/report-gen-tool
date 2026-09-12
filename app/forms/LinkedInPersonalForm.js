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
  linkedin_url: '',
  results_limit: 20,
  posted_limit: '3months',
};

export default function LinkedInPersonalForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_linkedin_personal', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      linkedin_url: fields.linkedin_url.trim(),
      results_limit: Number(fields.results_limit),
      posted_limit: fields.posted_limit,
    });
  };

  return (
    <form id="form-linkedin-personal-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">LinkedIn Personal Audit</h2>
      <p className="form-panel-subtitle">
        Audit a personal profile or company page — posts, engagement, TOFU/MOFU/BOFU funnel mix, and content intelligence via WebSocket.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="LinkedIn Profile or Company URL" htmlFor="lip-url" required tooltip="Full URL — works for both /in/ and /company/ URLs">
          <input
            id="lip-url"
            className="form-input"
            type="url"
            placeholder="https://linkedin.com/in/satyanadella"
            value={fields.linkedin_url}
            onChange={set('linkedin_url')}
            required
          />
        </FormField>

        <div className="form-grid-2">
          <FormField label="Posts to Analyze" htmlFor="lip-results-limit">
            <input
              id="lip-results-limit"
              className="form-input"
              type="number"
              min={1}
              max={50}
              value={fields.results_limit}
              onChange={set('results_limit')}
            />
          </FormField>

          <FormField label="Time Range" htmlFor="lip-posted-limit">
            <select
              id="lip-posted-limit"
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
          disabled={!fields.linkedin_url.trim()}
          defaultText="Generate Personal Audit"
        />
      </div>
    </form>
  );
}
