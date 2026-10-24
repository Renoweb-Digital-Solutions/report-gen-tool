'use client';

/**
 * Consent-gated best-effort collector mounted by app/layout.js. Dashboard
 * annotations and explicit runner events feed one bounded memory queue. No DOM
 * text, typed form contents, URLs, account identity or report content is read.
 * Observers never cancel application events; storage/network errors are isolated.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sendAnalyticsBatch } from '@/app/lib/api';
import { CONTROL_LABELS, EVENT_LABELS, MODULE_LABELS, SETTING_LABELS } from '@/app/lib/analyticsCatalog';

const AnalyticsContext = createContext({ trackEvent: () => {} });
const ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false';

/** Supply non-throwing tracking and attach explicitly scoped interaction observers. */
export function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  const state = useRef({ allowed: false, queue: [], visitor: null, session: null, lastActivity: 0, busy: false, failures: 0 });
  const excluded = useRef(false);
  excluded.current = !pathname || pathname.startsWith('/admin') || pathname.startsWith('/auth');

  // ========================================================================
  // IDENTITY AND QUEUE
  // UUIDs are pseudonymous, never authentication. Sessions are tab-local and
  // expire after thirty minutes of inactivity. Pending data lives only in memory.
  // ========================================================================
  const trackEvent = useCallback((event, data = {}, module = 'site') => {
    try {
      const current = state.current;
      if (!ENABLED || !current.allowed || excluded.current || document.visibilityState === 'hidden' || !Object.hasOwn(EVENT_LABELS, event)) return;
      if (!Object.hasOwn(MODULE_LABELS, module)) module = 'site';
      const now = Date.now();
      if (event === 'form_started' && current.started?.has(module) && now - current.lastActivity <= 1800000) {
        // Typing can signal activity often. Keep the session alive in memory
        // without queueing duplicate starts or writing storage on each keypress.
        current.lastActivity = now;
        return;
      }
      if (!current.session || now - current.lastActivity > 1800000) {
        current.queue = [];
        current.session = crypto.randomUUID();
        current.started = new Set();
        current.viewed = new Set();
      }
      current.lastActivity = now;
      // Millisecond-monotonic occurrence times preserve ordered funnels when
      // several synchronous events occur inside the same browser tick.
      current.lastEventTime = Math.max(now, (current.lastEventTime || 0) + 1);
      sessionStorage.setItem('flawdits_analytics_session', JSON.stringify({ id: current.session, at: now }));
      current.started ||= new Set();
      current.viewed ||= new Set();
      if (event === 'form_started') {
        // Shared observers and explicit runners both signal starts. Deduplicate
        // centrally so one submission cannot count twice in the same session.
        if (current.started.has(module)) return;
        current.started.add(module);
        if (!current.viewed.has(module)) {
          // Real form activity proves the panel is open after an idle-session
          // rotation, even though the dashboard tab itself did not change.
          current.queue.push({ event_id: crypto.randomUUID(), event_type: 'module_viewed', module, event_data: {}, occurred_at: new Date(current.lastEventTime++).toISOString() });
          current.viewed.add(module);
        }
      }
      if (event === 'module_viewed') current.viewed.add(module);
      current.queue.push({ event_id: crypto.randomUUID(), event_type: event, module, event_data: data, occurred_at: new Date(current.lastEventTime).toISOString() });
      if (current.queue.length > 120) current.queue = current.queue.slice(-120);
    } catch {
      // Privacy modes can deny storage/crypto. Application handlers still run.
    }
  }, []);

  useEffect(() => {
    /** Handle acceptance, cross-tab changes and explicit consent withdrawal. */
    const checkConsent = (event) => {
      try {
        // An explicit same-tab withdrawal wins even if persisting that decision
        // fails (for example, storage becomes unavailable after acceptance).
        const allowed = ENABLED && event?.detail?.accepted !== false && localStorage.getItem('analytics_consent') === 'accepted';
        const current = state.current;
        current.allowed = allowed;
        if (allowed) {
          let visitor = localStorage.getItem('flawdits_analytics_visitor');
          if (!/^[0-9a-f-]{36}$/i.test(visitor || '')) visitor = crypto.randomUUID();
          localStorage.setItem('flawdits_analytics_visitor', visitor);
          current.visitor = visitor;
          const previous = JSON.parse(sessionStorage.getItem('flawdits_analytics_session') || 'null');
          if (previous && /^[0-9a-f-]{36}$/i.test(previous.id) && Date.now() - previous.at < 1800000) {
            current.session = previous.id;
            current.lastActivity = previous.at;
          }
        } else {
          current.queue = [];
          current.session = null;
          current.visitor = null;
          current.started = new Set();
          current.viewed = new Set();
          localStorage.removeItem('flawdits_analytics_visitor');
          sessionStorage.removeItem('flawdits_analytics_session');
        }
        setConsented(allowed);
      } catch {
        state.current.allowed = false;
        state.current.queue = [];
        setConsented(false);
      }
    };
    checkConsent();
    window.addEventListener('analytics_consent_given', checkConsent);
    window.addEventListener('analytics_consent_changed', checkConsent);
    window.addEventListener('storage', checkConsent);
    return () => {
      window.removeEventListener('analytics_consent_given', checkConsent);
      window.removeEventListener('analytics_consent_changed', checkConsent);
      window.removeEventListener('storage', checkConsent);
    };
  }, []);

  useEffect(() => {
    /** Flush at most forty events; two bounded retries retain original event IDs. */
    const flush = async () => {
      const current = state.current;
      if (!current.allowed || excluded.current || current.busy || !current.queue.length) return;
      const events = current.queue.splice(0, 40);
      const session = current.session;
      current.busy = true;
      try {
        const ok = await sendAnalyticsBatch({ visitor_id: current.visitor, session_id: session, consent: true, events });
        if (!ok && current.allowed && current.session === session && current.failures < 2) {
          current.failures += 1;
          current.queue = [...events, ...current.queue].slice(0, 120);
        } else current.failures = 0;
      } finally { current.busy = false; }
    };
    const interval = window.setInterval(flush, 5000);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      clearInterval(interval);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, []);

  useEffect(() => {
    if (consented && pathname) trackEvent('page_view');
  }, [pathname, consented, trackEvent]);

  // ========================================================================
  // DELEGATED INTERACTIONS
  // Only annotated controls inside a module scope can expose option values.
  // General form activity establishes a start without reading typed content.
  // Capture-phase observers do not alter React handlers or browser defaults.
  // ========================================================================
  useEffect(() => {
    /** Resolve the current module from its explicit ancestor annotation. */
    const moduleFor = (node) => node.closest('[data-analytics-module]')?.dataset.analyticsModule;
    /** Establish one form start per module/session, including default-only runs. */
    const startForm = (node, module) => {
      if (!module || !node.closest('form')) return;
      // Support/auth forms are outside the audit-start definition.
      if (!node.closest('form[id^="form-"]')) return;
      trackEvent('form_started', {}, module);
    };
    /** Observe explicit button activations, including keyboard-generated clicks. */
    const click = (event) => {
      try {
        if (!(event.target instanceof Element) || !state.current.allowed) return;
        const node = event.target.closest('[data-analytics-control]');
        if (!node || node.disabled) return;
        const module = moduleFor(node);
        const control = node.dataset.analyticsControl;
        if (!module || !Object.hasOwn(CONTROL_LABELS, control)) return;
        if (control === 'generate' || control.startsWith('section_')) startForm(node, module);
        const expanded = node.getAttribute('aria-expanded');
        trackEvent(control.startsWith('section_') ? 'section_toggled' : 'button_clicked', { control, ...(expanded !== null ? { expanded: expanded !== 'true' } : {}) }, module);
      } catch { /* Detached nodes must never interrupt application handlers. */ }
    };
    /** Capture approved option codes; text fields contribute only a form start. */
    const change = (event) => {
      try {
        const node = event.target;
        if (!(node instanceof Element) || !state.current.allowed) return;
        const module = moduleFor(node);
        startForm(node, module);
        const setting = node.dataset.analyticsSetting;
        if (!module || !Object.hasOwn(SETTING_LABELS, setting)) return;
        // Identifier dropdowns reveal only whether a choice exists, never its ID.
        const value = node.dataset.analyticsPresence === 'true' ? (node.value ? 'selected' : 'not_selected') : node.dataset.analyticsValue ?? node.value;
        trackEvent('option_changed', { setting, value, ...(node.type === 'checkbox' ? { checked: node.checked } : {}) }, module);
      } catch { /* Analytics cannot change a control or its submission behavior. */ }
    };
    /** First typing/file activity counts as configuration without reading its contents. */
    const input = (event) => {
      try {
        if (event.target instanceof Element && state.current.allowed) startForm(event.target, moduleFor(event.target));
      } catch { /* Do not interfere with typing, uploads or native input behavior. */ }
    };
    /** Record a native validity category without field values or validation text. */
    const invalid = (event) => {
      try {
        const module = moduleFor(event.target);
        if (module) trackEvent('validation_failed', { failure: event.target.validity?.valueMissing ? 'required' : 'invalid' }, module);
      } catch { /* Preserve validation even when telemetry is unavailable. */ }
    };
    document.addEventListener('click', click, true);
    document.addEventListener('change', change, true);
    document.addEventListener('input', input, true);
    document.addEventListener('invalid', invalid, true);
    return () => {
      document.removeEventListener('click', click, true);
      document.removeEventListener('change', change, true);
      document.removeEventListener('input', input, true);
      document.removeEventListener('invalid', invalid, true);
    };
  }, [trackEvent]);

  return <AnalyticsContext.Provider value={{ trackEvent, consented }}>{children}</AnalyticsContext.Provider>;
}

/** Return the inert default outside the provider so callers remain safe. */
export const useAnalytics = () => useContext(AnalyticsContext);
