'use client';

// ============================================================================
// CONSENTED CONFIGURATION OBSERVATION
// Only stable configuration codes are exposed to AnalyticsProvider. Typed user
// text, account/profile links and pipeline submission behavior remain untouched.
// ============================================================================

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';
// Unit-price help uses the same dashboard pricing snapshot as the total button.
import PostCreditRate from '../features/credits/pricing/PostCreditRate';
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
        <FormField label="Instagram Username" htmlFor="ig-username" required tooltip="Brand's handle without the @ symbol">
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
          {/* Match FastAPI, acquisition and credit-pricing validation bounds. */}
          <input
            id="ig-results-limit" data-analytics-setting="results_limit"
            aria-describedby="ig-post-price"
            className="form-input"
            type="number"
            min={1}
            max={100}
            value={fields.ig_results_limit}
            onChange={set('ig_results_limit')}
          />
          {/* Explain the per-post rate beside the quantity without submitting it. */}
          <PostCreditRate id="ig-post-price" module="instagram" payload={fields} />
        </FormField>

        {/* Display-only pricing follows this audit and its current settings. */}
        <AnimatedSubmitButton
          pricingModule="instagram"
          pricingInput={fields}
          loading={loading}
          disabled={!fields.ig_username.trim()}
          defaultText="Generate Report"
        />
      </div>
    </form>
  );
}
