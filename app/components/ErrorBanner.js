'use client';

/**
 * ErrorBanner — dismissable error notification with red-tinted styling.
 */
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  // Guard against accidentally stored objects (e.g. from sessionStorage before a fix)
  const text =
    typeof message === 'string'
      ? message
      : JSON.stringify(message);

  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <span className="error-banner-icon" aria-hidden="true">⚠️</span>
      <span style={{ flex: 1 }}>{text}</span>
      {onDismiss && (
        <button
          className="error-banner-close"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
