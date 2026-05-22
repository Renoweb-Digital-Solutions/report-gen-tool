'use client';

import { useState, useEffect } from 'react';

/**
 * useSessionState — works like useState but persists the value to sessionStorage.
 * pdfBlob is intentionally NOT stored here (not serializable); keep that in regular useState/useRef.
 */
export function useSessionState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage can be unavailable in some contexts
    }
  }, [key, state]);

  return [state, setState];
}
