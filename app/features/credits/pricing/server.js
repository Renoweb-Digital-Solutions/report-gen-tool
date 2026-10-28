/**
 * Private Mongo pricing reader imported only by /api/credits/pricing/route.js.
 * Uses the user-configured server environment and reads credit_service's pricing
 * collection only. No wallet queries, writes, request-selected databases, credits
 * backend calls, raw driver errors or credentials cross the browser boundary.
 */
import 'server-only';
import { MongoClient } from 'mongodb';
import { normalizeRule, OPERATIONS } from './rules';

// ============================================================================
// REUSED SERVER CONNECTION, FRESH PAGE-OPEN PRICING READS
// Pool reuse avoids connecting per dashboard view. Rules are never held in a
// long-lived server cache: Express's active/effective/highest-version predicate
// is reapplied on every request. A failed connection can recover on the next call.
// ============================================================================
let connection;
let connectionUri;

/** Open the private database with bounded timeouts; never guess a local URI. */
async function database() {
  const uri = (process.env.CREDIT_PRICING_MONGO_URL || process.env.MONGO_URL || '').trim();
  if (!uri) throw new Error('Pricing is not configured');
  if (!connection || connectionUri !== uri) {
    const client = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 6000 });
    connectionUri = uri;
    connection = client.connect().catch(async () => {
      connection = undefined;
      await client.close().catch(() => {});
      throw new Error('Pricing is unavailable');
    });
  }
  return (await connection).db(process.env.CREDIT_PRICING_DB_NAME?.trim() || 'credit_service');
}

/** Read only currently authoritative public rules, one latest version per audit. */
export async function readPricing() {
  const db = await database();
  const now = new Date();
  const records = await db.collection('credit_pricing').aggregate([
    { $match: { application: 'FLAWDITS', operation: { $in: OPERATIONS }, active: true,
      effectiveFrom: { $lte: now }, $or: [{ effectiveTo: { $exists: false } }, { effectiveTo: { $gt: now } }] } },
    { $sort: { operation: 1, version: -1 } },
    { $group: { _id: '$operation', rule: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$rule' } },
    { $project: { _id: 0, application: 1, operation: 1, version: 1, pricingConfig: 1, effectiveFrom: 1, effectiveTo: 1 } },
  ], { maxTimeMS: 5000 }).toArray();
  // A malformed latest rule cannot silently fall back to an older cheaper rule.
  // Keep other valid operations available, with this operation shown unavailable.
  const rules = records.flatMap(record => {
    try { return [normalizeRule(record, now.getTime())]; } catch { return []; }
  });
  if (!rules.length) throw new Error('No active pricing');
  return { schemaVersion: 1, fetchedAt: now.toISOString(), rules };
}
