'use client';

import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import AnimatedSubmitButton from '../components/AnimatedSubmitButton';

const DEFAULTS = {
  url: '',
  generate_pdf: true,
};

export default function UiUxAuditForm({ loading, error, progress, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_ui_ux', DEFAULTS);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      url: fields.url.trim(),
      generate_pdf: fields.generate_pdf,
    });
  };

  return (
    <form id="form-ui-ux-audit" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">UI/UX Audit</h2>
      <p className="form-panel-subtitle">
        Design, UX & Core Metrics scoring based on full-page visual captures and accessibility compliance.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FormField label="Target URL" htmlFor="uiux-url" required tooltip="The specific page URL to audit">
          <input
            id="uiux-url"
            className="form-input"
            type="text"
            placeholder="e.g. https://example.com/landing-page"
            value={fields.url}
            onChange={set('url')}
            required
          />
        </FormField>

        <AnimatedSubmitButton 
          loading={loading}
          progressText={progress}
          disabled={!fields.url.trim()}
          defaultText="Generate UI/UX Audit"
        />
      </div>
    </form>
  );
}
