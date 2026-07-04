'use client';

import { Info } from 'lucide-react';

/**
 * Reusable FormField wrapper: label + input/textarea/select/custom content.
 * Renders children directly so it can wrap any form control.
 */
export default function FormField({ label, htmlFor, required, tooltip, children }) {
  return (
    <div className="form-field">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <label className="form-label" htmlFor={htmlFor} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {label}
          {required && (
            <span 
              style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--brand-amber)', display: 'inline-block' }} 
              title="Required field"
              aria-label="Required" 
            />
          )}
        </label>
        {tooltip && (
          <div title={tooltip} style={{ cursor: 'help', color: 'rgba(48, 143, 239, 0.6)' }}>
            <Info size={14} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
