'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Skeleton fallback during SSR hydration to prevent visual jump
  if (!mounted) {
    return (
      <div 
        className={`inline-flex items-center justify-center w-[34px] h-[30px] rounded-2xl bg-brandInk/5 border border-brandInk/10 ${className}`}
        style={{ opacity: 0.5 }}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      {isDark ? (
        <Sun size={15} className="theme-toggle-icon sun-icon text-amber-400" />
      ) : (
        <Moon size={15} className="theme-toggle-icon moon-icon text-blue-600" />
      )}
    </button>
  );
}
