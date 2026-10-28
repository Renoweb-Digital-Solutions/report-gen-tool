/**
 * Shared consumed-credit labels for profile history and admin UserRunHistory.
 * Only confirmed server values count as consumption. Zero is a real no-charge
 * outcome; missing historical records and unsettled charges remain distinct.
 * This pure formatter never estimates cost or reveals reservation accounting.
 */

// ============================================================================
// CONFIRMED USAGE DISPLAY
// Both history tables use the same contract so legacy unknowns never become 0.
// ============================================================================
/** Format an exact nonnegative credit count, pending state or missing record. */
export function creditUsageLabel(report) {
  if (report.credit_usage_status === 'confirmed' && Number.isInteger(report.credits_consumed) && report.credits_consumed >= 0) {
    return report.credits_consumed.toLocaleString();
  }
  return report.credit_usage_status === 'pending' ? 'Processing' : 'Not recorded';
}
