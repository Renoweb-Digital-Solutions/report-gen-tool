'use client';

/**
 * One dashboard-owned pricing fetch and local estimates for all audit buttons.
 * IndexedDB can paint a recent cached estimate while Next fetches current rules.
 * Form/slider changes only run pure JavaScript. Neither estimates nor cache data
 * are submitted to FastAPI; its existing reserve flow remains the billing check.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readCachedPricing, writeCachedPricing } from './cache';
import { normalizeSnapshot, normalizeRule, estimate, unitRate } from './rules';
import { pricingSpec } from './catalog';

const PricingContext = createContext({ snapshot: null, status: 'loading', source: null });
const CACHE_AGE_MS = 10 * 60 * 1000;
let pendingRequest;

// ============================================================================
// DASHBOARD-OPEN FETCH AND CACHE FALLBACK
// Dedupe simultaneous React Strict Mode effects. Each later dashboard mount
// fetches again; HTTP responses are no-store. Storage errors are nonfatal.
// ============================================================================
/** Fetch a fresh same-origin snapshot without contacting or exposing Express. */
function fetchPricing() {
  if (!pendingRequest) {
    pendingRequest = fetch('/api/credits/pricing', { cache: 'no-store', signal: AbortSignal.timeout(12000) })
      .then(async response => {
        if (!response.ok) throw new Error('Pricing unavailable');
        return normalizeSnapshot(await response.json());
      }).finally(() => { pendingRequest = null; });
  }
  return pendingRequest;
}

/** Share public rules across all forms without remounting on dashboard tab changes. */
export default function PricingProvider({ children }) {
  const [state, setState] = useState({ snapshot: null, status: 'loading', source: null });
  useEffect(() => {
    let active = true;
    let fresh = false;
    readCachedPricing().then(value => {
      const snapshot = normalizeSnapshot(value);
      if (Date.now() - new Date(snapshot.fetchedAt).getTime() > CACHE_AGE_MS) return;
      if (active && !fresh) setState({ snapshot, status: 'ready', source: 'cached' });
    }).catch(() => { /* Unavailable/corrupt storage never prevents a fresh estimate. */ });
    fetchPricing().then(snapshot => {
      fresh = true;
      if (!active) return;
      setState({ snapshot, status: 'ready', source: 'current' });
      writeCachedPricing(snapshot).catch(() => { /* The current snapshot still works in memory. */ });
    }).catch(() => {
      if (active) setState(previous => previous.snapshot ? { ...previous, status: 'ready' } : { snapshot: null, status: 'unavailable', source: null });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (state.source !== 'cached') return;
    // An offline fallback cannot remain silently valid forever. Expire only this
    // specific cached snapshot, without triggering slider-time HTTP requests.
    const remaining = new Date(state.snapshot.fetchedAt).getTime() + CACHE_AGE_MS - Date.now();
    const timer = setTimeout(() => setState(previous => previous.snapshot === state.snapshot
      ? { snapshot: null, status: 'unavailable', source: null } : previous), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [state.snapshot, state.source]);

  return <PricingContext.Provider value={state}>{children}</PricingContext.Provider>;
}

// ============================================================================
// PURE RENDER-TIME ESTIMATES
// A missing or malformed rule never becomes zero. Selection/availability labels
// are hints only: buttons retain their existing form/server validation behavior.
// ============================================================================
/** Calculate an estimate using only current form state and already-loaded rules. */
export function useCreditEstimate(module, payload) {
  const state = useContext(PricingContext);
  return useMemo(() => {
    if (!module) return null;
    let spec;
    try { spec = pricingSpec(module, payload); }
    catch { return { label: module === 'full' ? 'Select modules' : 'Price unavailable', title: 'Choose valid audit settings to see the estimate.' }; }
    if (!state.snapshot) return { label: state.status === 'loading' ? 'Loading price...' : 'Price unavailable', title: 'The final price is checked by the server when the audit starts.' };
    try {
      const credits = estimate(state.snapshot, spec);
      return { label: `${state.source === 'cached' ? '~' : ''}${credits.toLocaleString()} ${credits === 1 ? 'credit' : 'credits'}`,
        title: `${state.source === 'cached' ? 'Cached estimate. ' : 'Estimated cost. '}The server confirms the current price when the audit starts.` };
    } catch { return { label: 'Price unavailable', title: 'Current pricing for these settings is unavailable. The server checks the price when you start.' }; }
  }, [module, payload, state]);
}

// ============================================================================
// SOCIAL FORM PER-POST HINTS
// Reuse dashboard-loaded rules and canonical operation/features, including the
// personal form's company-URL mapping. No new HTTP/cache reads or billing inputs.
// ============================================================================
/**
 * Supply PostCreditRate with a rate for Instagram/LinkedIn's selected window.
 * Quantity is set to one only for rule selection: editing/clearing the limit must
 * not hide the explanation of its unit price. Missing, expired or tiered rules
 * produce an explicit unavailable hint, never a fabricated zero-cost promise.
 */
export function usePostCreditRate(module, payload) {
  const state = useContext(PricingContext);
  if (!state.snapshot) return state.status === 'loading' ? 'Loading per-post price…' : 'Per-post price unavailable';
  try {
    if (!['instagram', 'linkedin', 'linkedin_personal'].includes(module)) throw new Error('Not a post audit');
    const spec = pricingSpec(module, { ...payload, ig_results_limit: 1, linkedin_results_limit: 1, results_limit: 1 });
    const rule = normalizeRule(state.snapshot.rules.find(item => item.operation === spec.operation));
    const rate = unitRate(rule, spec);
    // Show fractional rates without rounding each post up. The button retains
    // the authoritative formula's once-per-total ceiling and whole-credit total.
    const formatted = rate.toLocaleString(undefined, { maximumFractionDigits: 8 });
    return `${state.source === 'cached' ? '~' : ''}${formatted} ${rate === 1 ? 'credit' : 'credits'} per post${spec.features.length ? ' · includes selected time range' : ''}`;
  } catch {
    return 'Per-post price unavailable';
  }
}
