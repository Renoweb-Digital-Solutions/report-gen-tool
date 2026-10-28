/**
 * Public pricing schema and calculator shared by the Next pricing route and UI.
 * Only allowlisted Flawdits rules cross the server boundary. Browser/IndexedDB
 * input is validated again to prevent corrupt cache data producing fake zero or
 * NaN labels. This module never authorizes spending or supplies a billed amount.
 * calculate follows the Express pricing implementation's tiers/ceil arithmetic.
 */
export const OPERATIONS = ['WEBSITE_ANATOMY', 'GMB_AUDIT', 'INSTAGRAM_AUDIT', 'LINKEDIN_AUDIT',
  'LINKEDIN_PERSONAL', 'VISUAL_BRAND_MATCH', 'ADS_AUDIT', 'UI_UX_AUDIT', 'FULL_REPORT'];

// ============================================================================
// PUBLIC RULE VALIDATION
// Construct a fresh projection instead of forwarding Mongo documents or cached
// objects. Dates bound display validity; inactive/expired records are never used.
// ============================================================================
/** Require finite, nonnegative money-like configuration values, with integer tiers. */
function amount(value, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (integer && !Number.isSafeInteger(value))) {
    throw new Error('Invalid pricing amount');
  }
  return value;
}

/** Retain numeric feature maps only; keys are data, never object prototypes. */
function features(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid pricing features');
  const entries = Object.entries(value);
  if (entries.length > 100) throw new Error('Too many pricing features');
  return Object.fromEntries(entries.map(([key, price]) => {
    if (!key || key.length > 100 || ['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Invalid feature');
    return [key, amount(price)];
  }));
}

/** Normalize one effective public pricing rule; reject malformed active versions. */
export function normalizeRule(record, instant = Date.now()) {
  if (!record || record.application !== 'FLAWDITS' || !OPERATIONS.includes(record.operation)
      || !Number.isSafeInteger(record.version) || record.version < 1) throw new Error('Invalid pricing rule');
  const start = new Date(record.effectiveFrom).getTime();
  const end = record.effectiveTo === undefined ? null : new Date(record.effectiveTo).getTime();
  if (!Number.isFinite(start) || start > instant || (end !== null && (!Number.isFinite(end) || end <= instant))) {
    throw new Error('Pricing is not effective');
  }
  const config = record.pricingConfig;
  let pricingConfig;
  if (config?.type === 'DYNAMIC_FEATURES') {
    pricingConfig = { type: config.type, basePricePerUnit: amount(config.basePricePerUnit),
      addons: features(config.addons || {}), multipliers: features(config.multipliers || {}) };
  } else if (config?.type === 'FLAT_TIERS' && Array.isArray(config.tiers) && config.tiers.length && config.tiers.length <= 100) {
    pricingConfig = { type: config.type, tiers: config.tiers.map(tier => {
      if (!Number.isSafeInteger(tier.minQuantity) || tier.minQuantity < 1
          || (tier.maxQuantity !== undefined && (!Number.isSafeInteger(tier.maxQuantity) || tier.maxQuantity < tier.minQuantity))) {
        throw new Error('Invalid pricing tier');
      }
      return { minQuantity: tier.minQuantity, ...(tier.maxQuantity === undefined ? {} : { maxQuantity: tier.maxQuantity }), credits: amount(tier.credits, true) };
    }) };
  } else throw new Error('Unsupported pricing type');
  return { application: 'FLAWDITS', operation: record.operation, version: record.version, pricingConfig,
    effectiveFrom: new Date(start).toISOString(), ...(end === null ? {} : { effectiveTo: new Date(end).toISOString() }) };
}

/** Validate a complete HTTP/cache snapshot and discard unrelated stored fields. */
export function normalizeSnapshot(value, instant = Date.now()) {
  if (value?.schemaVersion !== 1 || !Array.isArray(value.rules) || !value.rules.length || value.rules.length > OPERATIONS.length) {
    throw new Error('Invalid pricing snapshot');
  }
  const rules = value.rules.map(rule => normalizeRule(rule, instant));
  if (new Set(rules.map(rule => rule.operation)).size !== rules.length) throw new Error('Duplicate pricing rules');
  const fetchedAt = new Date(value.fetchedAt).getTime();
  if (!Number.isFinite(fetchedAt) || fetchedAt > instant + 60000) throw new Error('Invalid pricing timestamp');
  return { schemaVersion: 1, fetchedAt: new Date(fetchedAt).toISOString(), rules };
}

// ============================================================================
// DISPLAY-ONLY EXPRESS-COMPATIBLE ARITHMETIC
// Composite costs sum independently rounded components, matching reserve(). No
// browser amount, rule version or feature list is forwarded as billing authority.
// ============================================================================
/**
 * Return the unrounded per-unit rate for dynamic pricing, including selected
 * addons and time multipliers, matching calculate()'s feature handling. Keep fractions:
 * Express rounds the entire quantity once, rather than rounding every post.
 * Flat tiers have no constant per-post rate and must not be presented as one.
 */
export function unitRate(rule, spec) {
  const config = rule.pricingConfig;
  if (config.type !== 'DYNAMIC_FEATURES') throw new Error('No constant unit rate');
  let unit = config.basePricePerUnit;
  let multiplier = 1;
  for (const feature of spec.features || []) {
    // Match Express's zero-modifier semantics and exclude inherited map keys.
    if (Object.hasOwn(config.addons, feature) && config.addons[feature]) unit += config.addons[feature];
    if (Object.hasOwn(config.multipliers, feature) && config.multipliers[feature]) multiplier *= config.multipliers[feature];
  }
  const rate = unit * multiplier;
  if (!Number.isFinite(rate) || rate < 0 || rate > Number.MAX_SAFE_INTEGER) throw new Error('Invalid unit rate');
  return rate;
}

/** Calculate one component; dynamic totals round once after multiplying volume. */
export function calculate(rule, spec) {
  if (!Number.isSafeInteger(spec.quantity) || spec.quantity <= 0) throw new Error('Invalid quantity');
  const config = rule.pricingConfig;
  let total;
  if (config.type === 'FLAT_TIERS') {
    const tier = config.tiers.find(item => spec.quantity >= item.minQuantity && (item.maxQuantity === undefined || spec.quantity <= item.maxQuantity));
    if (!tier) throw new Error('No matching tier');
    total = tier.credits;
  } else {
    let unit = config.basePricePerUnit;
    let multiplier = 1;
    for (const feature of spec.features || []) {
      // Express treats zero modifiers as absent. hasOwn avoids prototype keys.
      if (Object.hasOwn(config.addons, feature) && config.addons[feature]) unit += config.addons[feature];
      if (Object.hasOwn(config.multipliers, feature) && config.multipliers[feature]) multiplier *= config.multipliers[feature];
    }
    // Preserve Express's multiplication order; reassociating fractional rates
    // before quantity could change floating-point behavior at ceil boundaries.
    total = Math.ceil(unit * spec.quantity * multiplier);
  }
  if (!Number.isSafeInteger(total) || total < 0) throw new Error('Invalid calculated credits');
  return total;
}

/** Sum a whole audit, requiring parent pricing just as Express reserve does. */
export function estimate(snapshot, spec) {
  const rules = new Map(snapshot.rules.map(rule => [rule.operation, normalizeRule(rule)]));
  if (!rules.has(spec.operation)) throw new Error('Pricing unavailable');
  const parts = spec.subOperations?.length ? spec.subOperations : [spec];
  const total = parts.reduce((sum, part) => {
    const rule = rules.get(part.operation);
    if (!rule) throw new Error('Pricing unavailable');
    return sum + calculate(rule, part);
  }, 0);
  if (!Number.isSafeInteger(total)) throw new Error('Invalid composite credits');
  return total;
}
