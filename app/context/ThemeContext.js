'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  mounted: false,
});

export const IN_SCOPE_PATHS = ['/dashboard', '/admin'];

export function isPathInScope(pathname) {
  if (!pathname) return false;
  // Exclude admin login
  if (pathname === '/admin/login') return false;
  return IN_SCOPE_PATHS.some((p) => pathname.startsWith(p));
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Helper to apply or remove dark attribute on documentElement based on scope and active theme
  const applyThemeToDom = useCallback((activeTheme, path) => {
    if (typeof document === 'undefined') return;
    const inScope = isPathInScope(path);
    if (inScope && activeTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Determine initial theme on client mount
    let initialTheme = 'light';
    try {
      const saved = localStorage.getItem('flawdits_theme');
      if (saved === 'dark' || saved === 'light') {
        initialTheme = saved;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialTheme = 'dark';
      }
    } catch (e) {
      console.warn('Unable to access localStorage for theme:', e);
    }

    setTheme(initialTheme);
    setMounted(true);
    applyThemeToDom(initialTheme, window.location.pathname);
  }, [applyThemeToDom]);

  // Sync DOM theme attribute whenever pathname or theme changes
  useEffect(() => {
    if (mounted) {
      applyThemeToDom(theme, pathname);
    }
  }, [pathname, theme, mounted, applyThemeToDom]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('flawdits_theme', nextTheme);
      } catch (e) {
        console.warn('Unable to save theme preference:', e);
      }
      applyThemeToDom(nextTheme, window.location.pathname);
      return nextTheme;
    });
  }, [applyThemeToDom]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
