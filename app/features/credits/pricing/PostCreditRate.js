'use client';

/**
 * Display-only unit-price helper beneath social post-limit inputs in standalone
 * and Full Report forms. PricingProvider supplies cached/current public rules;
 * its hook includes selected time multipliers without fetching on form changes.
 * The associated input references this text with aria-describedby. This component
 * neither changes submitted payloads nor authorizes a charge; FastAPI does that.
 */
import { usePostCreditRate } from './PricingProvider';
import styles from './PriceLabel.module.css';

// ============================================================================
// ACCESSIBLE FIELD HELP
// Keep rates beside the quantity they explain; the existing button shows totals.
// ============================================================================
/** Render a reactive rate, or an honest loading/unavailable state, for one field. */
export default function PostCreditRate({ id, module, payload }) {
  const label = usePostCreditRate(module, payload);
  return <p id={id} className={styles.postRate} aria-live="polite" aria-atomic="true">{label}</p>;
}
