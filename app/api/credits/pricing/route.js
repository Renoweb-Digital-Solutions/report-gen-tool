/**
 * Dashboard's same-origin display-pricing endpoint, consumed by PricingProvider.
 * Server-only Mongo credentials stay behind readPricing. The public response is
 * fixed to allowlisted pricing rules; no user query, wallet or service key is used.
 * Failure is a safe 503, never a guessed/free estimate or raw Mongo exception.
 */
import { readPricing } from '@/app/features/credits/pricing/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// FRESH DISPLAY SNAPSHOT
// The browser stores validated rules in IndexedDB. Disallow HTTP/static caching
// so opening the dashboard refreshes active pricing even after admin changes.
// ============================================================================
/** Return public Flawdits pricing only; backend billing remains authoritative. */
export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    return Response.json(await readPricing(), { headers });
  } catch {
    return Response.json({ message: 'Credit estimates are temporarily unavailable.' }, { status: 503, headers });
  }
}
