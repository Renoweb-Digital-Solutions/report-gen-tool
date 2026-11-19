/**
 * Artifact side panel for real Website Anatomy documents and other tool results.
 * AgentWorkspace retains every returned artifact and selects one for this panel.
 * Full report artifacts retain the existing module's HTML and PDF export. Other
 * tool results expose only their returned metrics, findings, warnings and evidence.
 * Unknown future tools remain readable through an escaped JSON fallback.
 */
'use client';

import { useEffect, useRef } from 'react';
import { Download, ExternalLink, FileText, Globe, X } from 'lucide-react';
import AgentText from './AgentText';
import WebsiteAnatomyArtifact from './WebsiteAnatomyArtifact';
import styles from './agent.module.css';

// ============================================================================
// UNTRUSTED RESULT BOUNDARIES
// Provider values may be null or nested objects. Convert leaf content to text and
// allow only HTTP(S) links, never executable URL schemes or embedded credentials.
// ============================================================================

/** Keep absent fields visibly distinct from real zero/false metric values. */
function display(value) {
  if (value === null || value === undefined || value === '')
    return 'Not available';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

/** Resolve provider links without permitting javascript:, data:, or credentials. */
function safeUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** Render evidence as inert text when it is not a safe external destination. */
function EvidenceLink({ url, children }) {
  const href = safeUrl(url);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink size={12} />
    </a>
  ) : (
    <span>{children}</span>
  );
}

/** Project the website adapter's bounded summary, without inventing missing scores. */
function WebsiteReport({ data }) {
  const metrics = [
    ['Pages inspected', data.crawl?.pages_inspected],
    ['Issues found', data.crawl?.issues_count],
    ['Website health', data.crawl?.website_health_score],
    ['AI search health', data.crawl?.ai_search_health_score],
  ];
  return (
    <>
      <div className={styles.reportEyebrow}>
        <Globe size={14} /> WEBSITE INTELLIGENCE
      </div>
      <h2>{display(data.website?.domain)}</h2>
      <EvidenceLink url={data.website?.start_url}>
        {display(data.website?.start_url)}
      </EvidenceLink>
      <div className={styles.metrics}>
        {metrics.map(([label, value]) => (
          <div key={label}>
            <strong>{display(value)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h3>What needs attention</h3>
      {Array.isArray(data.findings) && data.findings.length ? (
        data.findings.map((finding, index) => (
          <article className={styles.finding} key={index}>
            <span className={styles.severity}>
              {display(finding.severity || finding.category || 'Finding')}
            </span>
            <h4>{display(finding.title || finding.message)}</h4>
            {finding.title && finding.message && (
              <p>{display(finding.message)}</p>
            )}
          </article>
        ))
      ) : (
        <p className={styles.muted}>
          No findings were included in this summary.
        </p>
      )}
      <h3>Pages inspected</h3>
      {Array.isArray(data.pages) &&
        data.pages.map((page, index) => (
          <article className={styles.pageCard} key={index}>
            <EvidenceLink url={page.url}>
              {display(page.title || page.url)}
            </EvidenceLink>
            <p>{display(page.meta_description)}</p>
            <span className={styles.muted}>
              HTTP {display(page.status_code)} · {display(page.word_count)}{' '}
              words
            </span>
            {page.error && <p>{display(page.error)}</p>}
          </article>
        ))}
      {Array.isArray(data.limitations) &&
        data.limitations.filter(Boolean).map((limitation, index) => (
          <p className={styles.reportNote} key={index}>
            {display(limitation)}
          </p>
        ))}
    </>
  );
}

/** Show the ads adapter's raw provider records; it does not return legacy audit verdicts. */
function AdsReport({ data }) {
  const ads = Array.isArray(data.ads) ? data.ads : [];
  return (
    <>
      <div className={styles.reportEyebrow}>ADS LIBRARY INTELLIGENCE</div>
      <h2>{display(data.query)}</h2>
      <p className={styles.muted}>
        {display(data.platform)} · {display(data.count)} ads returned
      </p>
      {!ads.length && (
        <div className={styles.emptyReport}>
          No ads were returned for this search. Try a different advertiser or
          country.
        </div>
      )}
      {ads.map((ad, index) => (
        <article className={styles.pageCard} key={index}>
          <h3>
            {display(
              ad.page_name ||
                ad.advertiser_name ||
                ad.advertiser ||
                `Ad ${index + 1}`,
            )}
          </h3>
          <AgentText
            text={display(
              ad.ad_creative_body ||
                ad.body ||
                ad.primaryText ||
                ad.text ||
                ad.title ||
                'Ad details',
            )}
          />
          <EvidenceLink
            url={
              ad.ad_snapshot_url || ad.preview_url || ad.detailsLink || ad.url
            }
          >
            View ad source
          </EvidenceLink>
          <details className={styles.rawData}>
            <summary>All ad details</summary>
            <pre>{JSON.stringify(ad, null, 2)}</pre>
          </details>
        </article>
      ))}
    </>
  );
}

// ============================================================================
// PANEL LIFECYCLE AND EXPORT
// This is a non-modal complementary region: desktop chat remains usable. Focus
// enters its close control on selection; the parent restores the opener on close.
// Escape works only inside the panel, leaving other dashboard dialogs independent.
// ============================================================================

/** Render a selected document with PDF export, or a generic result with JSON export. */
export default function AgentReportPanel({ artifact, active, onClose }) {
  const closeRef = useRef(null);
  // Background completion in a hidden dashboard tab must not steal focus.
  useEffect(() => {
    if (active) closeRef.current?.focus();
  }, [artifact.id, active]);
  const envelope = artifact.result.data || {};
  const data = envelope.data || {};
  const verified =
    artifact.result.status === 'completed' && envelope.status === 'success';

  /** Export locally held data and revoke its object URL after the browser consumes it. */
  function downloadData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(artifact.result, null, 2)], {
        type: 'application/json',
      }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `flawdits-${artifact.result.tool === 'website.audit' ? 'website' : 'agent'}-report.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <aside
      id="agent-report-panel"
      className={styles.reportPanel}
      aria-label="Agent report"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <header className={styles.reportToolbar}>
        <span>
          <FileText size={16} /> Report
        </span>
        <div>
          {/* Branded documents provide their PDF action beside the document title;
              generic tool results retain the original JSON data export. */}
          {!artifact.report && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={downloadData}
              title="Download report data"
              aria-label="Download report data"
            >
              <Download size={17} />
            </button>
          )}
          <button
            type="button"
            className={styles.iconButton}
            ref={closeRef}
            onClick={onClose}
            aria-label="Close report"
          >
            <X size={19} />
          </button>
        </div>
      </header>
      {artifact.report ? (
        <WebsiteAnatomyArtifact
          key={artifact.id}
          report={artifact.report}
          verified={verified}
        />
      ) : (
        <div className={styles.reportBody}>
          <span
            className={`${styles.resultStatus} ${verified ? styles.verified : styles.unverified}`}
          >
            {verified ? 'Completed' : 'Unverified / partial result'}
          </span>
          {artifact.result.tool === 'website.audit' ? (
            <WebsiteReport data={data} />
          ) : artifact.result.tool === 'ads_library.search' ? (
            <AdsReport data={data} />
          ) : (
            <>
              <h2>Agent result</h2>
              <pre className={styles.json}>{JSON.stringify(data, null, 2)}</pre>
            </>
          )}
          <section className={styles.reportSummary}>
            <h3>Agent summary</h3>
            <AgentText text={artifact.result.message} />
          </section>
          {Array.isArray(envelope.warnings) && envelope.warnings.length > 0 && (
            <section className={styles.warnings}>
              <h3>Keep in mind</h3>
              {envelope.warnings.map((warning, index) => (
                <p key={index}>{display(warning)}</p>
              ))}
            </section>
          )}
          {Array.isArray(envelope.evidence) && envelope.evidence.length > 0 && (
            <section className={styles.evidence}>
              <h3>Sources & evidence</h3>
              {envelope.evidence.map((item, index) => (
                <div key={index}>
                  <EvidenceLink url={item.url}>
                    {display(item.url || item.source)}
                  </EvidenceLink>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </aside>
  );
}
