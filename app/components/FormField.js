'use client';

/**
 * Reusable FormField wrapper: label + input/textarea/select/custom content.
 * Renders children directly so it can wrap any form control.
 */
export default function FormField({ label, htmlFor, children }) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
