/**
 * Display-side mirror of FastAPI credits/policy.py, consumed by PricingProvider.
 * Forms pass the same payload used on submit. Prices remain dynamic rules; only
 * operation/quantity/feature mappings live here. Invalid/unpriced selections have
 * no estimate. This mapping never changes request payloads or backend authority.
 */
const NAMES = { website: 'WEBSITE_ANATOMY', gmb: 'GMB_AUDIT', instagram: 'INSTAGRAM_AUDIT',
  linkedin: 'LINKEDIN_AUDIT', linkedin_personal: 'LINKEDIN_PERSONAL', visual: 'VISUAL_BRAND_MATCH',
  ui_ux: 'UI_UX_AUDIT', ads: 'ADS_AUDIT', full: 'FULL_REPORT' };
const WINDOWS = { '24h': null, week: null, month: 'time_range_last_month', '3months': 'time_range_last_3_months',
  '6months': 'time_range_last_6_months', year: 'time_range_last_year' };

// ============================================================================
// NORMALIZED COMPONENTS AND PROVIDER OPTIONS
// Browser controls often contain numeric strings. Convert exactly as the forms'
// submit handlers do, then enforce FastAPI's positive bounded billing quantities.
// ============================================================================
/** Create a component with normalized, unique feature keys and bounded volume. */
function part(operation, value = 1, features = [], maximum = 100) {
  const quantity = Number(value);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > maximum) throw new Error('Choose a valid result limit');
  return { operation, quantity, features: [...new Set(features)].sort() };
}

/** Build Ads components; standalone previews can price a selected provider before text entry.
 * Full reports require actual selected targets, matching their submission predicates.
 */
function ads(p, requireTarget = false) {
  const parts = [];
  if ([null, undefined, 'meta'].includes(p.platform) && ((p.platform === 'meta' && !requireTarget) || p.meta_query || p.meta_page_id)) {
    const keys = ['platform_meta_ads'];
    if (!p.meta_time_period && (p.meta_start_date || p.meta_end_date)) throw new Error('Custom date pricing unavailable');
    keys.push(['last_3_months', 'last_6_months'].includes(p.meta_time_period) ? `time_period_${p.meta_time_period}` : 'time_period_any_time');
    const format = p.meta_media_type || 'all';
    if (['meme', 'image_and_meme'].includes(format)) keys.push('ad_format_image');
    else if (['image', 'video'].includes(format)) keys.push(`ad_format_${format}`);
    else if (format === 'all') keys.push('ad_format_video');
    parts.push(part('ADS_AUDIT', p.limit ?? 20, keys));
  }
  if ([null, undefined, 'google'].includes(p.platform) && ((p.platform === 'google' && !requireTarget) || p.google_domain || p.google_advertiser_id)) {
    const keys = [];
    const period = p.google_time_period ?? 'last_30_days';
    if (['last_3_months', 'last_6_months'].includes(period)) keys.push(`time_period_${period}`);
    else if (period === 'any') keys.push('time_period_any_time');
    else if (!['today', 'yesterday', 'last_7_days', 'last_30_days'].includes(period)) throw new Error('Custom date pricing unavailable');
    if (p.google_platform === 'youtube') keys.push('google_platform_youtube');
    const format = p.google_ad_format || 'all';
    if (['image', 'video'].includes(format)) keys.push(`ad_format_${format}`);
    else if (format === 'all') keys.push('ad_format_video');
    parts.push(part('ADS_AUDIT', p.limit ?? 20, keys));
  }
  if (!parts.length) throw new Error('Select an advertiser');
  return parts;
}

/** Map one form submission to the exact pricing structure FastAPI constructs. */
export function pricingSpec(module, p = {}) {
  if (!NAMES[module]) throw new Error('Unknown audit');
  if (module === 'full') {
    const parts = [];
    for (const [field, child] of [['domain', 'website'], ['ig_username', 'instagram'], ['linkedin_company_url', 'linkedin'], ['ui_ux_url', 'ui_ux']]) {
      if (p[field]) parts.push(pricingSpec(child, { ...p, posted_limit: p.linkedin_posted_limit ?? '3months' }));
    }
    if (p.gmb_company_name && p.gmb_target_url && p.gmb_location_query) parts.push(part('GMB_AUDIT'));
    if (p.website_image_base64 && p.ig_moodboard_base64) parts.push(part('VISUAL_BRAND_MATCH'));
    if (p.ads_platform) parts.push(...ads(Object.fromEntries(Object.entries(p).filter(([key]) => key.startsWith('ads_')).map(([key, value]) => [key.slice(4), value])), true));
    if (!parts.length) throw new Error('Select audit modules');
    return { ...part('FULL_REPORT'), subOperations: parts };
  }
  if (module === 'ads') {
    const parts = ads(p);
    return parts.length === 1 ? parts[0] : { ...part('ADS_AUDIT'), subOperations: parts };
  }
  if (module === 'instagram') return part('INSTAGRAM_AUDIT', p.ig_results_limit ?? 20);
  if (['linkedin', 'linkedin_personal'].includes(module)) {
    const personal = module === 'linkedin_personal';
    const window = p.posted_limit ?? '3months';
    if (!Object.hasOwn(WINDOWS, window)) throw new Error('Invalid time range');
    const operation = personal && (p.linkedin_url || '').toLowerCase().includes('/company/') ? 'LINKEDIN_AUDIT' : NAMES[module];
    return part(operation, personal ? p.results_limit ?? 20 : p.linkedin_results_limit ?? 20,
      WINDOWS[window] ? [WINDOWS[window]] : [], personal ? 50 : 100);
  }
  return part(NAMES[module]);
}
