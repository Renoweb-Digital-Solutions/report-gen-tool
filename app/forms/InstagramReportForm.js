'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';

const DEFAULTS = {
  ig_username: '',
  ig_results_limit: 25,
};

export default function InstagramReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_instagram', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ig_username: fields.ig_username.trim().replace(/^@/, ''),
      ig_results_limit: Number(fields.ig_results_limit),
    });
  };

  return (
    <form id="form-instagram-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Instagram Audit</h2>
      <p className="form-panel-subtitle">
        Analyse posting frequency, engagement patterns, and content strategy.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="Instagram Username *" htmlFor="ig-username">
          <input
            id="ig-username"
            className="form-input"
            type="text"
            placeholder="@yourbrand"
            value={fields.ig_username}
            onChange={set('ig_username')}
            required
            autoComplete="off"
          />
        </FormField>

        <FormField label="Results Limit" htmlFor="ig-results-limit">
          <input
            id="ig-results-limit"
            className="form-input"
            type="number"
            min={1}
            max={200}
            value={fields.ig_results_limit}
            onChange={set('ig_results_limit')}
          />
        </FormField>

        <button
          id="btn-generate-instagram"
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner" aria-hidden="true" />Generating…</>
          ) : (
            <><span aria-hidden="true">📸</span>Generate Report</>
          )}
        </button>
      </div>
    </form>
  );
}
