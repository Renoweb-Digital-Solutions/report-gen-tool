/**
 * Non-sensitive vocabulary shared by AnalyticsProvider and AnalyticsDashboard.
 * Stable IDs describe controls, never customer text/URLs/report content. Backend
 * analytics.py independently validates submitted values; labels are display only.
 */

// ============================================================================
// STABLE MODULE, CONTROL, SETTING AND EVENT LABELS
// Module IDs match dashboard tabs; runner key ui_ux normalizes to ui-ux.
// ============================================================================
export const MODULE_LABELS = { full: 'Full Report', website: 'Website Anatomy', gmb: 'GMB Audit', instagram: 'Instagram Audit', linkedin: 'LinkedIn Company', linkedin_personal: 'LinkedIn Personal', visual: 'Visual Brand Match', ads: 'Ads Audit', 'ui-ux': 'UI/UX Audit', site: 'Website' };
export const CONTROL_LABELS = { generate: 'Generate audit', search_meta: 'Find Meta pages', search_google: 'Find Google advertisers', download_pdf: 'Download PDF', preview_toggle: 'Toggle report preview', support_open: 'Open support', support_submit: 'Submit support ticket', support_close: 'Close support', section_instagram: 'Instagram settings', section_linkedin: 'LinkedIn settings', section_gmb: 'GMB settings', section_ui_ux: 'UI/UX settings', section_ads: 'Ads settings', report_preview: 'Report preview', website_form: 'Website form', full_form: 'Full Report form', gmb_form: 'GMB form', instagram_form: 'Instagram form', linkedin_form: 'LinkedIn form', linkedin_personal_form: 'LinkedIn Personal form', visual_form: 'Visual Brand form', ads_form: 'Ads form', ui_ux_form: 'UI/UX form' };
export const SETTING_LABELS = { google_advertiser_selection: 'Google advertiser selection', meta_page_selection: 'Meta page selection', ads_platform: 'Ad provider', google_region: 'Google region', google_time_period: 'Google time range', google_ad_format: 'Google ad format', google_platform: 'Google platform', meta_country: 'Meta country', meta_media_type: 'Meta media type', meta_active_status: 'Meta ad status', meta_platforms: 'Meta platforms', posted_limit: 'Post time range', results_limit: 'Post limit', ig_results_limit: 'Instagram post limit', linkedin_results_limit: 'LinkedIn post limit', linkedin_posted_limit: 'LinkedIn time range', limit: 'Ad limit', ads_limit: 'Ad limit' };
export const EVENT_LABELS = { page_view: 'Visited the website', module_viewed: 'Opened a tool', button_clicked: 'Activated a button', option_changed: 'Changed a setting', form_started: 'Started configuring', validation_failed: 'Encountered a validation issue', audit_requested: 'Requested an audit', audit_received: 'Received an audit result', audit_failed: 'Audit request failed in the browser', report_viewed: 'Viewed the report preview', export_downloaded: 'Downloaded a PDF', section_toggled: 'Toggled a settings section' };

/** Format approved configuration codes without interpreting them as user content. */
export function valueLabel(value) {
  if (Array.isArray(value)) return value.map(valueLabel).join(', ') || 'None selected';
  const labels = { selected: 'Specific advertiser / page chosen', not_selected: 'No specific advertiser / page', ANYWHERE: 'All regions', ALL: 'All countries', all: 'All', anywhere: 'All regions', google: 'Google', meta: 'Meta', both: 'Google + Meta', facebook: 'Facebook', instagram: 'Instagram', audience_network: 'Audience Network', messenger: 'Messenger', '24h': 'Last 24 hours', week: 'Last week', month: 'Last month', '3months': 'Last 3 months', '6months': 'Last 6 months', year: 'Last year' };
  if (typeof value === 'string' && /^[A-Z]{2}$/.test(value) && typeof Intl.DisplayNames === 'function') {
    try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(value) || value; } catch { /* Retain unknown codes without inventing a country. */ }
  }
  return labels[value] || String(value ?? 'Not recorded').replaceAll('_', ' ');
}

// ============================================================================
// REQUEST SNAPSHOTS
// Project configuration only; never spread pipeline payloads into telemetry.
// ============================================================================
/** Copy approved configuration fields from a dashboard runner's request payload. */
export function analyticsSettings(payload) {
  if (!payload || typeof payload !== 'object' || payload instanceof FormData) return {};
  const settings = {};
  Object.entries(payload).forEach(([key, value]) => {
    const normalized = key === 'platform' ? 'ads_platform' : key.startsWith('ads_') && key !== 'ads_platform' && key !== 'ads_limit' ? key.slice(4) : key;
    if (Object.hasOwn(SETTING_LABELS, normalized)) settings[normalized] = value == null && ['google_ad_format', 'google_platform'].includes(normalized) ? 'all' : value;
  });
  // Selected advertiser/page IDs are reduced to presence, never copied.
  if ('google_advertiser_id' in payload) settings.google_advertiser_selection = payload.google_advertiser_id ? 'selected' : 'not_selected';
  if ('meta_page_id' in payload) settings.meta_page_selection = payload.meta_page_id ? 'selected' : 'not_selected';
  return settings;
}
