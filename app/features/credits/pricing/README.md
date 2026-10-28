# Audit button credit estimates

The authenticated dashboard mounts `PricingProvider` once. It reads a recent
IndexedDB snapshot and fetches `/api/credits/pricing` from the same Next.js origin.
The route reads public Flawdits pricing directly from MongoDB on the Next server;
it never exposes or calls the Express credits backend from the browser.

## Server configuration

The existing private `MONGO_URL` is supported. An optional dedicated
`CREDIT_PRICING_MONGO_URL` overrides it. Database name is `credit_service`, with
optional override `CREDIT_PRICING_DB_NAME`. None of these variables may use the
`NEXT_PUBLIC_` prefix. Runtime operations only read `credit_pricing`.

The route selects `application: FLAWDITS`, allowlisted operations, `active: true`,
an effective start in the past and no expired effective end. The highest active
version per operation wins. Only operation/version/configuration/effective dates
are returned. A malformed latest rule is unavailable, never replaced with an
older rule or a guessed zero. Missing configuration/service access returns a safe
503 without driver errors or credentials.

## Browser storage and local calculation

- IndexedDB database: `flawdits-credit-pricing`.
- Object store: `rules`; record key: `FLAWDITS`; schema version: `1`.
- Only public pricing rules and their fetch timestamp are stored.
- Cached rules may provide a marked `~` estimate for up to ten minutes while a
  fresh request completes or when that request fails. Effective dates are checked.
- Opening the dashboard fetches again. React Strict Mode effects share an
  in-flight request. Switching modules and changing fields/sliders do not fetch.
- Blocked, denied or full IndexedDB does not stop in-memory estimates or audits.

`catalog.js` mirrors FastAPI's operation/volume/feature mappings. `rules.js`
matches Express's flat tiers and `ceil(unitCost * quantity * multiplier)` formula.
Composite reports sum independently rounded component prices. Full/Ads forms
share their actual submit-payload builder with the estimate to avoid pricing a
different set of selected modules or providers.

Every audit's existing `AnimatedSubmitButton` displays its local estimate. A
missing price shows **Price unavailable**; a full report without selections shows
**Select modules**. Price-fetch failure does not change existing submission or
validation behavior. Custom Ads dates without a backend pricing mapping have no
estimate. Standalone Ads can show a selected provider's price before target text
is entered; the existing form still requires a valid target before submission.

## Billing authority

No displayed credit amount, cached rule or pricing version is sent as spending
authority. FastAPI constructs its own reserve payload and Express calculates the
actual charge from active database rules. Editing IndexedDB or React state can
only alter the display. Browser estimates are never used to bypass credit checks.

Implementation verification includes a live read-only pricing-route response,
arithmetic comparisons with the Express source, and mapping comparisons with
FastAPI. Browser rendering and actual IndexedDB persistence remain manual checks.
