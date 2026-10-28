/**
 * IndexedDB storage of public display-pricing rules, used by PricingProvider.
 * No user input, report, account identity or credentials are cached. Blocked or
 * unavailable browser storage rejects within 1.5 seconds; the provider continues
 * with in-memory pricing. Only transaction completion confirms a persisted write.
 */
const DATABASE = 'flawdits-credit-pricing';
const STORE = 'rules';
const KEY = 'FLAWDITS';

// ============================================================================
// BOUNDED BROWSER STORAGE
// Keep one versioned snapshot. IndexedDB can be disabled in private browsing or
// blocked by another tab; neither condition may block submitting an audit.
// ============================================================================
/** Open the dedicated pricing store, closing late connections after timeout. */
function open() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('Storage unavailable')); return; }
    let finished = false;
    const request = indexedDB.open(DATABASE, 1);
    const timer = setTimeout(() => finish(null, new Error('Storage timeout')), 1500);
    /** Settle once; a delayed successful open must not leak a connection. */
    function finish(db, error) {
      if (finished) { db?.close(); return; }
      finished = true;
      clearTimeout(timer);
      if (error) reject(error); else resolve(db);
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => finish(request.result);
    request.onerror = () => finish(null, new Error('Storage unavailable'));
    request.onblocked = () => finish(null, new Error('Storage blocked'));
  });
}

/** Read/write one snapshot and close the database on success, abort or timeout. */
async function transaction(mode, snapshot) {
  const db = await open();
  return new Promise((resolve, reject) => {
    let completed = false;
    let tx;
    let value;
    const timer = setTimeout(() => { try { tx?.abort(); } catch {} finish(new Error('Storage timeout')); }, 1500);
    /** Complete the transaction once, never masking a failed write as persisted. */
    function finish(error) {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      db.close();
      if (error) reject(error); else resolve(value);
    }
    try {
      tx = db.transaction(STORE, mode);
      const request = mode === 'readonly' ? tx.objectStore(STORE).get(KEY) : tx.objectStore(STORE).put(snapshot, KEY);
      request.onsuccess = () => { value = request.result; };
      tx.oncomplete = () => finish();
      tx.onerror = tx.onabort = () => finish(new Error('Storage unavailable'));
    } catch { finish(new Error('Storage unavailable')); }
  });
}

/** Load a candidate snapshot; the provider revalidates its schema and freshness. */
export function readCachedPricing() { return transaction('readonly'); }

/** Persist only the validated public rule projection received from Next's route. */
export function writeCachedPricing(snapshot) { return transaction('readwrite', snapshot); }
