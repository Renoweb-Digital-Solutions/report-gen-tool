'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import { Sparkles } from 'lucide-react';

const DEFAULTS = {
  company_name: '',
  target_url: '',
  location_query: '',
};

export default function GmbReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_gmb_direct', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.company_name.trim() || !fields.target_url.trim() || !fields.location_query.trim()) {
      return;
    }
    
    onSubmit({
      company_name: fields.company_name.trim(),
      target_url: fields.target_url.trim(),
      location_query: fields.location_query.trim(),
    });
  };

  return (
    <form id="form-gmb-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">GMB Audit</h2>
      <p className="form-panel-subtitle">
        Deep competitor analysis for your Google My Business profile.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="Business Name" htmlFor="gmb-company-name" required>
          <input
            id="gmb-company-name"
            className="form-input"
            type="text"
            placeholder='e.g. "Evolve Chiropractic"'
            value={fields.company_name}
            onChange={set('company_name')}
            required
          />
        </FormField>

        <FormField label="Google Maps URL" htmlFor="gmb-target-url" required tooltip="Paste the full Google Maps link for the business">
          <input
            id="gmb-target-url"
            className="form-input"
            type="url"
            placeholder='https://www.google.com/maps/place/...'
            value={fields.target_url}
            onChange={set('target_url')}
            required
          />
        </FormField>

        <FormField label="Location/Neighborhood" htmlFor="gmb-location-query" required tooltip="Used for local pack ranking comparison">
          <input
            id="gmb-location-query"
            className="form-input"
            type="text"
            placeholder='e.g. "Minneapolis, MN"'
            value={fields.location_query}
            onChange={set('location_query')}
            required
          />
        </FormField>

        <button
          id="btn-generate-gmb"
          type="submit"
          className={`btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading || !fields.company_name.trim() || !fields.target_url.trim() || !fields.location_query.trim()}
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
