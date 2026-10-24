'use client';

/**
 * Marketing-facing interaction workspace rendered by the dedicated admin route.
 * Aggregates and safe session timelines come from admin-protected analytics APIs.
 * Browser signals and existing server report records remain separately labelled;
 * absence of telemetry is never presented as a pipeline failure or completion.
 * Filters share one query, stale responses are ignored, and failures get a retry.
 */
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BarChart3, CheckCircle2, ChevronRight, Download, Filter, MousePointer2, RefreshCw, Route, SlidersHorizontal, Users } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalyticsSession, getAnalyticsSummary, downloadAnalyticsPdf, downloadBlob } from '@/app/lib/api';
import { MODULE_LABELS, CONTROL_LABELS, EVENT_LABELS, SETTING_LABELS, valueLabel } from '@/app/lib/analyticsCatalog';
import styles from './analytics.module.css';

const VIEWS = [{ id: 'overview', label: 'Overview', icon: BarChart3 }, { id: 'modules', label: 'Modules', icon: Activity }, { id: 'options', label: 'Options & Actions', icon: SlidersHorizontal }, { id: 'journeys', label: 'User Journeys', icon: Route }];
const STAGES = [{ event: 'module_viewed', label: 'Opened a tool' }, { event: 'form_started', label: 'Started configuring' }, { event: 'audit_requested', label: 'Requested an audit' }, { event: 'audit_received', label: 'Received a result' }, { event: 'report_viewed', label: 'Viewed the preview' }];
const number = new Intl.NumberFormat('en-IN');

/** Render ISO API timestamps in the same IST timezone as the reporting window. */
function displayTime(value, short = false) {
  if (!value) return 'Not available';
  // Motor returns naive UTC datetimes for stored records; never treat them as local.
  const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...(short ? { hour: '2-digit', minute: '2-digit', second: '2-digit' } : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) });
}

/** A consistent no-data message; zero activity is different from a failed fetch. */
function Empty({ title = 'No activity in this period', children }) {
  return <div className={styles.empty}><MousePointer2 size={26} aria-hidden="true" /><strong>{title}</strong><p>{children || 'Try a wider date range or another module. Only consented activity recorded after this release appears here.'}</p></div>;
}

/** Compact accessible section frame used across the four views. */
function Panel({ title, caption, children, className = '' }) {
  return <section className={`${styles.panel} ${className}`}><div className={styles.panelHeading}><h3>{title}</h3>{caption && <p>{caption}</p>}</div>{children}</section>;
}

/** Show the real count alongside every bar; colour is never the only encoding. */
function RankedBars({ rows, onChoose }) {
  const max = Math.max(1, ...rows.map(row => row.count));
  return rows.length ? <div className={styles.ranks}>{rows.map(row => <div className={styles.rank} key={row.id}>
    <div>{onChoose ? <button onClick={() => onChoose(row.id)}>{row.label}<ChevronRight size={14} /></button> : <span>{row.label}</span>}<strong>{number.format(row.count)}</strong></div>
    <div className={styles.barTrack}><span style={{ width: `${row.count / max * 100}%` }} /></div>
  </div>)}</div> : <Empty />;
}

/** Fetch and display analytics without coupling report generation to this UI. */
export default function AnalyticsDashboard() {
  const [view, setView] = useState('overview');
  const [period, setPeriod] = useState('30');
  // Keep the last applied preset while a custom range is still being edited.
  const [presetDays, setPresetDays] = useState(30);
  const [module, setModule] = useState('');
  const [draftDates, setDraftDates] = useState({ start: '', end: '' });
  const [dates, setDates] = useState(null);
  const [rangeError, setRangeError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [optionMode, setOptionMode] = useState('submitted');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  // Export errors stay separate from reporting so existing data remains usable.
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  // ========================================================================
  // QUERY STATE AND STALE-RESPONSE PROTECTION
  // Apply custom dates together, avoiding misleading intermediate query windows.
  // API failures clear previous data so old counts cannot masquerade as new ones.
  // ========================================================================
  const filters = useMemo(() => ({ ...(dates ? dates : { days: presetDays }), module }), [presetDays, dates, module]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setData(null); setSelectedSession(null);
    getAnalyticsSummary(filters).then(result => { if (active) setData(result); }).catch(err => { if (active) setError(err.message || 'Could not load analytics.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters, refresh]);

  useEffect(() => {
    let active = true;
    setSession(null); setSessionError('');
    if (!selectedSession) { setSessionLoading(false); return; }
    setSessionLoading(true);
    getAnalyticsSession(selectedSession, filters).then(result => { if (active) setSession(result); }).catch(err => { if (active) setSessionError(err.message || 'Could not load this session.'); }).finally(() => { if (active) setSessionLoading(false); });
    return () => { active = false; };
  }, [selectedSession, filters, refresh]);

  /** Validate inclusive calendar dates client-side; server enforces the same limit. */
  function applyDates(event) {
    event.preventDefault();
    const span = (Date.parse(draftDates.end) - Date.parse(draftDates.start)) / 86400000;
    if (!draftDates.start || !draftDates.end || !Number.isFinite(span) || span < 0 || span >= 90) {
      setRangeError('Choose a start and end date covering 1–90 days.'); return;
    }
    setRangeError(''); setDates({ ...draftDates });
  }

  // ========================================================================
  // DISPLAY MODELS
  // Counts remain backend-derived. Module opens represent recorded panel views,
  // while people are distinct pseudonymous visitors, not authenticated accounts.
  // ========================================================================
  const events = Object.fromEntries((data?.events || []).map(row => [row._id, row.count]));
  const modules = Object.entries(MODULE_LABELS).filter(([id]) => id !== 'site' && (!module || id === module)).map(([id, label]) => {
    const rows = (data?.modules || []).filter(row => row._id.module === id);
    const count = event => rows.find(row => row._id.event === event)?.count || 0;
    return { id, label, opens: count('module_viewed'), requests: count('audit_requested'), received: count('audit_received'), views: count('report_viewed'), failures: count('audit_failed'), people: rows.find(row => row._id.event === 'module_viewed')?.people || 0 };
  });
  const popular = [...modules].filter(row => row.opens > 0).sort((a, b) => b.opens - a.opens);
  const serverRecords = (data?.server_reports || []).reduce((sum, row) => sum + row.count, 0);
  const funnel = STAGES.map((stage, index) => ({ ...stage, count: (data?.funnel || []).reduce((sum, row) => sum + (row._id >= index + 1 ? row.count : 0), 0) }));
  const options = (data?.[optionMode] || []).filter(row => `${MODULE_LABELS[row._id.module]} ${SETTING_LABELS[row._id.setting]} ${valueLabel(row._id.value)}`.toLowerCase().includes(search.toLowerCase()));
  const actions = (data?.actions || []).filter(row => `${MODULE_LABELS[row._id.module]} ${CONTROL_LABELS[row._id.control]} ${EVENT_LABELS[row._id.event]}`.toLowerCase().includes(search.toLowerCase()));

  /** Open a module drilldown without losing the selected calendar window. */
  function chooseModule(id) { setModule(id); setView('modules'); }

  // ========================================================================
  // PDF DOWNLOAD
  // Freeze the displayed calendar/module scope when clicked. Export all summary
  // sections rather than a screenshot of the active tab. Fetch fresh server data
  // using admin credentials; no customer content or client totals are submitted.
  // ========================================================================
  /** Download an actual PDF; preserve the dashboard on timeout or server failure. */
  async function handleDownloadPdf() {
    if (!data || loading || exporting) return;
    const scope = { start: data.start, end: data.end, module };
    setExporting(true); setExportError('');
    try {
      const blob = await downloadAnalyticsPdf(scope);
      downloadBlob(blob, `flawdits-analytics-${module || 'all'}-${scope.start}-to-${scope.end}.pdf`);
    } catch (err) {
      setExportError(err.name === 'TimeoutError' ? 'PDF download timed out. Please retry.' : err.message || 'Could not download the PDF.');
    } finally { setExporting(false); }
  }

  return <div className={styles.dashboard}>
    <div className={styles.intro}>
      <div><span className={styles.eyebrow}>PRODUCT INTELLIGENCE</span><h2>See what people actually use.</h2><p>From their first click to their next report.</p></div>
      <div className={styles.headerActions}>
        <button className={styles.pdfButton} onClick={handleDownloadPdf} disabled={loading || !data || exporting} aria-busy={exporting} title="Download all analytics sections for the displayed dates and module"><Download size={15} />{exporting ? 'Preparing PDF…' : 'Download PDF'}</button>
        <button className={styles.refresh} onClick={() => setRefresh(value => value + 1)} disabled={loading}><RefreshCw size={15} />{loading ? 'Loading…' : 'Refresh data'}</button>
      </div>
    </div>
    {exportError && <div role="alert" className={styles.error}><strong>PDF download failed</strong><p>{exportError}</p><button onClick={handleDownloadPdf} disabled={exporting || loading || !data}>Try again</button></div>}
    <div className={styles.filters}>
      <Filter size={17} aria-hidden="true" />
      <label>Period<select value={period} onChange={event => { setPeriod(event.target.value); if (event.target.value !== 'custom') { setDates(null); setPresetDays(Number(event.target.value)); setRangeError(''); } }}><option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="custom">Custom dates</option></select></label>
      <label>Module<select value={module} onChange={event => setModule(event.target.value)}><option value="">All modules & website</option>{Object.entries(MODULE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <span className={styles.timeNote}>{data ? `${data.start} — ${data.end} · IST` : 'Calendar dates in IST'}</span>
    </div>
    {period === 'custom' && <form className={styles.dateForm} onSubmit={applyDates}><label>From<input type="date" required value={draftDates.start} onChange={event => setDraftDates(value => ({ ...value, start: event.target.value }))} /></label><label>To<input type="date" required value={draftDates.end} onChange={event => setDraftDates(value => ({ ...value, end: event.target.value }))} /></label><button type="submit">Apply dates</button>{rangeError && <p role="alert">{rangeError}</p>}{!dates && <small>Showing the previous preset until dates are applied.</small>}</form>}
    <nav className={styles.tabs} aria-label="Analytics views">{VIEWS.map(item => { const Icon = item.icon; return <button key={item.id} aria-pressed={view === item.id} onClick={() => setView(item.id)}><Icon size={16} />{item.label}</button>; })}</nav>

    {loading ? <div role="status" className={styles.loading}><Activity size={24} /><strong>Gathering your insights…</strong><span>Loading the selected period.</span></div> : error ? <div role="alert" className={styles.error}><strong>Analytics could not be loaded</strong><p>{error}</p><button onClick={() => setRefresh(value => value + 1)}>Try again</button></div> : data && <>
      {!data.collection_enabled && <p className={styles.notice}>Collection is paused. Previously recorded activity remains available.</p>}
      <div className={styles.metrics}>
        {[{ label: 'Tracked visitors', value: data.totals.people, icon: Users, detail: 'Distinct consented browser visitors; not account totals.' }, { label: 'Audits requested', value: events.audit_requested || 0, icon: MousePointer2, detail: 'Requests initiated in the browser; not completed audits.' }, { label: 'Server report records', value: serverRecords, icon: CheckCircle2, detail: 'Existing server history across all users, including those without analytics consent.' }, { label: 'Preview views', value: events.report_viewed || 0, icon: BarChart3, detail: 'Report preview marker visible for at least one second; not proof of reading.' }].map(metric => { const Icon = metric.icon; return <div className={styles.metric} key={metric.label}><div><span>{metric.label}</span><Icon size={18} /></div><strong>{number.format(metric.value || 0)}</strong><p>{metric.detail}</p></div>; })}
      </div>

      {view === 'overview' && <>
        <div className={styles.twoColumns}>
          <Panel title="Which tools get attention?" caption="Recorded module opens. Select a tool to explore it."><RankedBars rows={popular.map(row => ({ id: row.id, label: row.label, count: row.opens }))} onChoose={chooseModule} /></Panel>
          <Panel title="What happened in this period?" caption="Observations from recorded activity, without guessed explanations."><div className={styles.insights}>
            {popular.length ? <><div><Activity size={19} /><p><strong>{popular[0].label}</strong> had the most recorded opens: {number.format(popular[0].opens)}.</p></div><div><Users size={19} /><p><strong>{number.format(data.totals.sessions)}</strong> tracked sessions generated {number.format(data.totals.events)} events.</p></div><div><ArrowRight size={19} /><p><strong>{number.format(events.audit_failed || 0)}</strong> audit request failures were observed in browsers. This is not a server outage count.</p></div></> : <Empty />}
          </div></Panel>
        </div>
        <Panel title="Activity over time" caption="Daily interactions and audit requests. Page views are excluded from interactions.">
          {data.totals.events ? <><div className={styles.legend}><span>● Interactions</span><span>● Audit requests</span></div><div className={styles.chart} role="img" aria-label={`Daily activity from ${data.start} to ${data.end}. Detailed counts follow in a table.`}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.daily} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--color-border)" /><XAxis dataKey="date" tickFormatter={value => value.slice(5)} tick={{ fontSize: 11 }} minTickGap={24} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--color-white)', color: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: 12 }} /><Area isAnimationActive={false} type="linear" dataKey="interactions" name="Interactions" stroke="#308fef" fill="#308fef" fillOpacity={0.13} strokeWidth={2} /><Area isAnimationActive={false} type="linear" dataKey="requests" name="Audit requests" stroke="#0d9488" fill="#0d9488" fillOpacity={0.06} strokeWidth={2} /></AreaChart></ResponsiveContainer></div><details className={styles.details}><summary>View daily counts</summary><div className={styles.tableWrap}><table><thead><tr><th>Date (IST)</th><th>Interactions</th><th>Audit requests</th></tr></thead><tbody>{data.daily.map(row => <tr key={row.date}><td>{row.date}</td><td>{row.interactions}</td><td>{row.requests}</td></tr>)}</tbody></table></div></details></> : <Empty />}
        </Panel>
      </>}

      {view === 'modules' && <Panel title="How each tool is used" caption="Browser-observed activity. Opens can repeat; people counts are distinct visitors who opened the module."><div className={styles.tableWrap}><table><thead><tr><th>Module</th><th>People</th><th>Opens</th><th>Requests</th><th>Results received</th><th>Preview views</th><th>Request failures</th></tr></thead><tbody>{modules.map(row => <tr key={row.id}><td><button className={styles.textButton} onClick={() => chooseModule(row.id)}>{row.label}<ChevronRight size={13} /></button></td><td>{number.format(row.people)}</td><td>{number.format(row.opens)}</td><td>{number.format(row.requests)}</td><td>{number.format(row.received)}</td><td>{number.format(row.views)}</td><td>{number.format(row.failures)}</td></tr>)}</tbody></table></div>{!modules.length && <Empty title="Select an audit module">The Website filter contains general website activity.</Empty>}
        <div className={styles.panelFoot}>Use Options & Actions to explore settings for the selected module.</div>
      </Panel>}

      {view === 'options' && <>
        <div className={styles.optionToolbar}><div className={styles.segment}><button aria-pressed={optionMode === 'submitted'} onClick={() => setOptionMode('submitted')}>Submitted settings</button><button aria-pressed={optionMode === 'changes'} onClick={() => setOptionMode('changes')}>Configuration changes</button></div><label className={styles.search}>Find an option or action<input type="search" placeholder="Search settings or buttons" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
        <Panel title={optionMode === 'submitted' ? 'What people chose when requesting an audit' : 'What people changed while configuring'} caption={optionMode === 'submitted' ? 'Final approved settings on browser requests. Platform lists represent combinations; defaults are included when sent.' : 'Each recorded change, including checked and unchecked states. These are not final submitted choices.'}>
          {options.length ? <div className={styles.tableWrap}><table><thead><tr><th>Setting</th><th>Choice</th><th>Module</th>{optionMode === 'changes' && <th>Checkbox state</th>}<th>{optionMode === 'submitted' ? 'Requests' : 'Changes'}</th></tr></thead><tbody>{options.map((row, index) => <tr key={index}><td>{SETTING_LABELS[row._id.setting] || 'Other setting'}</td><td><span className={styles.choice}>{valueLabel(row._id.value)}</span></td><td>{MODULE_LABELS[row._id.module]}</td>{optionMode === 'changes' && <td>{typeof row._id.checked === 'boolean' ? row._id.checked ? 'Checked' : 'Unchecked' : '—'}</td>}<td><strong>{number.format(row.count)}</strong></td></tr>)}</tbody></table></div> : <Empty title="No matching settings recorded" />}
          <div className={styles.panelFoot}>Top 100 configuration combinations in the selected period. Customer text and identifiers are excluded.</div>
        </Panel>
        <Panel title="Buttons & actions" caption="Named controls make actions understandable even when button labels change.">{actions.length ? <div className={styles.tableWrap}><table><thead><tr><th>Action</th><th>Module</th><th>Signal</th><th>People</th><th>Occurrences</th></tr></thead><tbody>{actions.map((row, index) => <tr key={index}><td>{CONTROL_LABELS[row._id.control]}</td><td>{MODULE_LABELS[row._id.module]}</td><td>{EVENT_LABELS[row._id.event]}</td><td>{number.format(row.people)}</td><td><strong>{number.format(row.count)}</strong></td></tr>)}</tbody></table></div> : <Empty title="No matching actions recorded" />}<div className={styles.panelFoot}>Top 100 actions. A Generate click and an audit request are different signals.</div></Panel>
      </>}

      {view === 'journeys' && <>
        <Panel title="From opening a tool to viewing a result" caption="Ordered steps within the selected period, counted once per session and module. Result receipt is a browser observation.">
          {funnel[0].count ? <div className={styles.funnel}>{funnel.map((step, index) => <div key={step.event}><span className={styles.stepNumber}>{index + 1}</span><div><span>{step.label}</span><div className={styles.barTrack}><span style={{ width: `${step.count / funnel[0].count * 100}%` }} /></div></div><strong>{number.format(step.count)}</strong><small>{index ? `${Math.round(step.count / funnel[0].count * 100)}% of opens` : 'Session / module pairs'}</small></div>)}</div> : <Empty />}
          <div className={styles.panelFoot}>Missing steps can reflect consent changes, a closed tab or blocked telemetry. They do not establish why a user stopped.</div>
        </Panel>
        <div className={styles.journeyGrid}>
          <Panel title="Recent sessions" caption="Up to 40 sessions in your current filters.">{data.sessions.length ? <div className={styles.sessionList}>{data.sessions.map((row, index) => <button key={row._id} aria-pressed={selectedSession === row._id} onClick={() => setSelectedSession(row._id)}><span><strong>Session {String(index + 1).padStart(2, '0')}</strong><small>{displayTime(row.last_seen)} IST</small><small>{row.modules.map(id => MODULE_LABELS[id]).join(' · ')}</small></span><span>{row.count} events<ChevronRight size={14} /></span></button>)}</div> : <Empty />}</Panel>
          <Panel title="Interaction timeline" caption="Anonymous, chronological activity. Customer content is never included.">
            {!selectedSession ? <Empty title="Choose a session">Select a session to follow its recorded actions.</Empty> : sessionLoading ? <p role="status" className={styles.panelFoot}>Loading session…</p> : sessionError ? <div role="alert" className={styles.error}><p>{sessionError}</p><button onClick={() => setRefresh(value => value + 1)}>Try again</button></div> : session && <><ol className={styles.timeline}>{session.events.map((event, index) => <li key={index}><span className={styles.timelineDot} /><div><small>{displayTime(event.timestamp, true)} IST · {MODULE_LABELS[event.module]}</small><strong>{EVENT_LABELS[event.event_type]}</strong>{event.event_data.control && <p>{CONTROL_LABELS[event.event_data.control]}</p>}{event.event_data.setting && <p>{SETTING_LABELS[event.event_data.setting]}: {valueLabel(event.event_data.value)}{typeof event.event_data.checked === 'boolean' ? event.event_data.checked ? ' · Checked' : ' · Unchecked' : ''}</p>}{typeof event.event_data.duration_ms === 'number' && <p>Response after {(event.event_data.duration_ms / 1000).toFixed(1)} seconds</p>}</div></li>)}</ol>{session.truncated && <p className={styles.notice}>Showing the first 200 events in this filtered session.</p>}</>}
          </Panel>
        </div>
      </>}

      <details className={styles.methodology}><summary>What these numbers mean</summary><p>Interaction analytics cover visitors who accepted analytics and allowed collection. A visitor represents a browser identifier, not a verified person or account. Admin routes are excluded.</p><p>Server report records come from existing report history across all users. They are not the denominator for browser conversion rates. Successful and partial statuses are preserved below.</p><div className={styles.serverBreakdown}>{data.server_reports.length ? data.server_reports.map((row, index) => <span key={index}>{row._id.type} · {row._id.status}: <strong>{number.format(row.count)}</strong></span>) : <span>No server report records in this period.</span>}</div><p>Raw interactions expire after 90 days. Earliest retained interaction: {displayTime(data.earliest_retained_event)}. Historical page views cannot reconstruct previous clicks. Detailed report sections and iframe contents are not tracked.</p></details>
      <footer className={styles.footer}><span><CheckCircle2 size={13} />Consent-based · No session replay</span><span>Updated {displayTime(data.generated_at)} IST</span></footer>
    </>}
  </div>;
}
