'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import { Sparkles } from 'lucide-react';

const DEFAULTS = {
  domain: '',
};

export default function WebsiteReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_website', DEFAULTS);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      domain: fields.domain.trim(),
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
        <FormField label="Website Domain" htmlFor="web-domain" required tooltip="The primary domain to audit">
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

        <button
          id="btn-generate-website"
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
