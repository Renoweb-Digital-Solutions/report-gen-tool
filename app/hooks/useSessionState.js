'use client';

import { useState, useEffect } from 'react';

/**
 * useSessionState — works like useState but persists the value to sessionStorage.
 * pdfBlob is intentionally NOT stored here (not serializable); keep that in regular useState/useRef.
 */
export function useSessionState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [key]);

  useEffect(() => {
    if (hasMounted) {
      try {
        sessionStorage.setItem(key, JSON.stringify(state));
      } catch {
        // sessionStorage can be unavailable in some contexts
      }
    }
  }, [key, state, hasMounted]);

  // Prevent hydration mismatch by returning defaultValue during initial render
  return [hasMounted ? state : defaultValue, setState];
}
