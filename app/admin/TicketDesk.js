'use client';

/**
 * Admin support inbox rendered by AdminWorkspace on /admin/tickets. This component
 * owns display filters, selection and accessible confirmation dialogs; the server
 * owns persisted status, private archive flags, revisions and email state. All
 * mutations merge only saved server rows. No user recipient or issue text can be
 * changed by these controls. Existing user-facing ticket visibility is preserved.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Archive, ArchiveRestore, CheckCircle2, Clock, Inbox, Loader2, Mail, MessageSquare, Search, X } from 'lucide-react';
import { updateAdminTicket, retryAdminTicketEmail } from '@/app/lib/api';
import styles from './tickets.module.css';

const STATUSES = ['Open', 'In Progress', 'Closed'];

/** Normalize naive database UTC timestamps; display all support timestamps in IST. */
function dateLabel(value) {
  if (!value) return 'Not recorded';
  const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Convert persisted delivery timestamps into milliseconds for the two-minute retry rule. */
function utcTime(value) {
  return value ? Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`) : NaN;
}

/** Pair status text with an icon so meaning never depends on colour alone. */
function Status({ status }) {
  const Icon = status === 'Closed' ? CheckCircle2 : status === 'In Progress' ? Loader2 : Clock;
  return <span className={`${styles.status} ${status === 'Closed' ? styles.closed : status === 'In Progress' ? styles.progress : styles.open}`}><Icon size={12} aria-hidden="true" />{status || 'Unknown'}</span>;
}

/**
 * Focus-managed confirmation for closure and explicit resends. Escape and Cancel
 * preserve ticket state; while saving, prevent dismissal or a second submission.
 * Trap focus, restore it on unmount, and clean up scroll/keyboard side effects.
 */
function ResolutionDialog({ ticket, kind, busy, error, onCancel, onSubmit }) {
  const [comment, setComment] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (ref.current?.querySelector('textarea') || ref.current?.querySelector('button'))?.focus();
    return () => {
      document.body.style.overflow = overflow;
      // Closing can remove its original button or filter the resolved row out.
      // Return focus to the current selected row/inbox rather than losing it.
      const target = previous instanceof HTMLElement && previous.isConnected ? previous : document.querySelector('[data-ticket-selection="true"]') || document.querySelector('[data-ticket-inbox]');
      if (target instanceof HTMLElement) target.focus();
    };
  }, []);
  useEffect(() => {
    /** Keep keyboard navigation within the dialog; block Escape only during save. */
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); if (!busy) onCancel(); }
      if (event.key !== 'Tab') return;
      const controls = [...(ref.current?.querySelectorAll('button:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || [])];
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); ref.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [busy, onCancel]);
  const retry = kind === 'retry';
  // A body portal escapes the workspace card's overflow/animation transforms,
  // ensuring the modal covers the viewport on both desktop and mobile.
  if (typeof document === 'undefined') return null;
  return createPortal(<div className={styles.overlay}>
    <section ref={ref} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="ticket-dialog-title" aria-describedby="ticket-dialog-description" aria-busy={busy} tabIndex={-1}>
      <header><span className={styles.dialogIcon}><Mail size={22} /></span><button type="button" aria-label="Cancel" disabled={busy} onClick={onCancel}><X size={19} /></button></header>
      <h2 id="ticket-dialog-title">{retry ? 'Resend resolution email?' : 'Close & resolve this ticket'}</h2>
      <p id="ticket-dialog-description">{retry ? 'This retries the saved resolution email. If a previous attempt reached the mail server without confirmation, the user may receive a duplicate.' : 'Explain what was fixed. We will save the ticket as closed and email the user their original issue and your resolution comment.'}</p>
      <div className={styles.issuePreview}><strong>{ticket.title}</strong><p>{ticket.description}</p><small>Resolution email to {ticket.email || 'No email available'}</small></div>
      <form onSubmit={event => { event.preventDefault(); if (!busy) onSubmit(comment.trim()); }}>
        {!retry && <label className={styles.commentLabel} htmlFor="resolution-comment">Resolution comment <span>Required · included in the email</span><textarea id="resolution-comment" value={comment} onChange={event => setComment(event.target.value)} required minLength={3} maxLength={4000} rows={6} disabled={busy} placeholder="Describe the fix and anything the user should do next…" /><small>{comment.length}/4000 characters</small></label>}
        {retry && ticket.resolution_comment && <div className={styles.savedComment}><strong>Saved resolution</strong><p>{ticket.resolution_comment}</p></div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <footer><button type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className={styles.primary} type="submit" disabled={busy || (!retry && comment.trim().length < 3)}>{busy ? 'Saving…' : retry ? 'Resend email' : 'Close & send email'}</button></footer>
      </form>
    </section>
  </div>, document.body);
}

/** Display the active/archive inbox and its selected detail without page-wide empty space. */
export default function TicketDesk({ tickets, onTicketSaved, onRefresh }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [archived, setArchived] = useState(false);
  const [selection, setSelection] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dialog, setDialog] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const saving = useRef(false);
  const refresh = useRef(onRefresh);
  refresh.current = onRefresh;

  // ========================================================================
  // DELIVERY OBSERVATION AND FILTERS
  // Poll only while actual notifications are pending/sending, for at most ninety
  // seconds per pending set. Mail is sent by the backend, never by these reads.
  // Counts describe the loaded inbox (existing API caps it at one thousand).
  // ========================================================================
  const pending = tickets.filter(ticket => ['pending', 'sending'].includes(ticket.notification?.state)).map(ticket => ticket._id).sort().join(',');
  useEffect(() => {
    if (!pending) return;
    let attempts = 0;
    const timer = setInterval(() => { if (++attempts > 30) { clearInterval(timer); return; } refresh.current(); }, 3000);
    return () => clearInterval(timer);
  }, [pending]);
  const active = tickets.filter(ticket => !ticket.admin_archived);
  const archivedCount = tickets.length - active.length;
  const visible = tickets.filter(ticket => Boolean(ticket.admin_archived) === archived && (status === 'all' || ticket.status === status) && [ticket.title, ticket.description, ticket.username, ticket.email].some(value => String(value || '').toLowerCase().includes(query.trim().toLowerCase())));
  const selected = visible.find(ticket => ticket._id === selection) || visible[0];
  const notification = selected?.notification || {};
  const waiting = ['pending', 'sending'].includes(notification.state);
  const retryable = notification.state === 'failed' || (waiting && Date.now() - utcTime(notification.attempted_at || notification.requested_at) >= 120000);

  // ========================================================================
  // SERVER-OWNED MUTATIONS
  // A synchronous ref blocks double activations before React renders busy state.
  // Failures keep existing records and typed comments; 409 requires review of the
  // refreshed ticket rather than silently overwriting another admin's changes.
  // ========================================================================
  async function save(ticket, changes, fromDialog = false) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setError(''); setDialogError(''); setNotice('');
    try {
      const response = await updateAdminTicket(ticket._id, { expected_revision: ticket.admin_revision || 0, ...changes });
      onTicketSaved(response.ticket);
      if (fromDialog) setDialog(null);
      setNotice(changes.archived !== undefined ? changes.archived ? 'Ticket archived privately. Its user view is unchanged.' : 'Ticket restored to the active inbox.' : changes.status === 'Closed' ? 'Ticket closed. Resolution email queued; delivery status will update below.' : 'Ticket status saved.');
    } catch (err) {
      const message = err.message || 'Could not save this ticket.';
      if (fromDialog) setDialogError(message); else setError(message);
      refresh.current();
    } finally { saving.current = false; setBusy(false); }
  }

  /** Resend only after confirmation; server validates the current notification token. */
  async function resend(ticket) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setDialogError(''); setNotice('');
    try {
      const response = await retryAdminTicketEmail(ticket._id, ticket.notification.id);
      onTicketSaved(response.ticket); setDialog(null); setNotice('Resolution email queued for another attempt.');
    } catch (err) { setDialogError(err.message || 'Could not retry this email.'); refresh.current(); }
    finally { saving.current = false; setBusy(false); }
  }

  /** Snapshot the selected record so a concurrent refresh cannot retarget the dialog. */
  function openDialog(ticket, kind = 'close') { setDialogError(''); setDialog({ ticket, kind }); }

  return <div className={styles.desk}>
    <div className={styles.metrics}>{[{ label: 'Open', value: active.filter(ticket => ticket.status === 'Open').length, icon: Inbox }, { label: 'In progress', value: active.filter(ticket => ticket.status === 'In Progress').length, icon: Clock }, { label: 'Closed', value: active.filter(ticket => ticket.status === 'Closed').length, icon: CheckCircle2 }, { label: 'Archived', value: archivedCount, icon: Archive }].map(item => { const Icon = item.icon; return <div key={item.label}><Icon size={18} /><span>{item.label}</span><strong>{item.value}</strong></div>; })}</div>
    <div className={styles.filters}>
      <div className={styles.switcher}><button aria-pressed={!archived} onClick={() => setArchived(false)}><Inbox size={15} />Inbox <span>{active.length}</span></button><button aria-pressed={archived} onClick={() => setArchived(true)}><Archive size={15} />Archived <span>{archivedCount}</span></button></div>
      <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>Search tickets</span><input type="search" placeholder="Search issue, user or email" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <label className={styles.statusFilter}><span className={styles.srOnly}>Filter by status</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option>{STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.notice}>{notice}</p>}
    {tickets.length >= 1000 && <p className={styles.notice}>Showing the latest 1,000 loaded tickets. Counts and filters apply to these records.</p>}
    <div className={styles.inbox}>
      <section className={styles.queue} aria-label="Ticket list" data-ticket-inbox tabIndex={-1}><div className={styles.queueHeading}><strong>{archived ? 'Archived tickets' : 'Support inbox'}</strong><span>{visible.length} matching</span></div>
        {visible.length ? <div className={styles.ticketList}>{visible.map(ticket => <button key={ticket._id} data-ticket-selection={selected?._id === ticket._id ? 'true' : undefined} aria-pressed={selected?._id === ticket._id} onClick={() => { setSelection(ticket._id); setError(''); }}><div><span className={styles.type}>{ticket.type || 'Support'}</span><Status status={ticket.status} /></div><strong>{ticket.title}</strong><p>{ticket.description}</p><footer><span>{ticket.username || 'User'}</span><time>{dateLabel(ticket.created_at)}</time></footer></button>)}</div> : <div className={styles.empty}><Inbox size={28} /><strong>{archived ? 'No archived tickets match' : 'Your inbox is clear'}</strong><p>{query || status !== 'all' ? 'Try another search or status filter.' : archived ? 'Archived tickets will appear here.' : 'New support requests will appear here.'}</p></div>}
      </section>
      <section className={styles.detail} aria-label="Ticket details">
        {selected ? <>
          <header className={styles.detailHeading}><div><span className={styles.eyebrow}>{selected.type || 'SUPPORT'} · #{selected._id.slice(-6).toUpperCase()}</span><h2>{selected.title}</h2><Status status={selected.status} /></div><button disabled={busy} className={styles.archiveButton} onClick={() => save(selected, { archived: !selected.admin_archived })}>{selected.admin_archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}{selected.admin_archived ? 'Restore' : 'Archive'}</button></header>
          <div className={styles.metadata}><span><strong>{selected.username || 'User'}</strong><small>{selected.email || 'Email unavailable'}</small></span><span><small>Submitted (IST)</small>{dateLabel(selected.created_at)}</span>{selected.updated_at && <span><small>Status updated (IST)</small>{dateLabel(selected.updated_at)}</span>}</div>
          <div className={styles.issue}><h3>Reported issue</h3><p>{selected.description}</p></div>
          <div className={styles.actions}><label>Ticket status<select value={selected.status || 'Open'} disabled={busy || waiting} onChange={event => { const value = event.target.value; if (value === 'Closed') openDialog(selected); else save(selected, { status: value }); }}>{!STATUSES.includes(selected.status) && <option value={selected.status || ''}>{selected.status || 'Unknown'}</option>}{STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>{selected.status !== 'Closed' && <button className={styles.primary} disabled={busy} onClick={() => openDialog(selected)}><CheckCircle2 size={16} />Close ticket</button>}{busy && <span role="status">Saving…</span>}</div>
          {selected.resolution_comment && <section className={styles.resolution}><h3><CheckCircle2 size={16} />Resolution shared with the user</h3><p>{selected.resolution_comment}</p>{selected.resolved_at && <small>Closed {dateLabel(selected.resolved_at)} IST</small>}</section>}
          {selected.status === 'Closed' && <section className={`${styles.delivery} ${notification.state === 'failed' ? styles.deliveryFailed : ''}`}><Mail size={18} /><div><strong>{notification.state === 'sent' ? 'Resolution email sent' : notification.state === 'failed' ? 'Resolution email could not be confirmed' : waiting ? retryable ? 'Email delivery needs attention' : 'Resolution email pending' : 'No resolution email recorded'}</strong><p>{notification.state === 'sent' ? `Accepted by the mail server ${dateLabel(notification.sent_at)} IST.` : notification.state === 'failed' ? 'The ticket remains closed. You can retry the saved email.' : waiting ? 'Status changes are paused until this delivery is completed. Refresh to check, or retry after two minutes if it remains pending.' : 'This ticket may have been closed before resolution notifications were introduced.'}</p></div>{retryable && <button disabled={busy} onClick={() => openDialog(selected, 'retry')}>Retry email</button>}</section>}
          <p className={styles.archiveNote}><Archive size={13} />Archiving only organises the admin inbox. It sends no email and does not hide or change the ticket for its user.</p>
        </> : <div className={styles.empty}><MessageSquare size={30} /><strong>No ticket selected</strong><p>Select a ticket from the inbox to review and manage it.</p></div>}
      </section>
    </div>
    {dialog && <ResolutionDialog ticket={dialog.ticket} kind={dialog.kind} busy={busy} error={dialogError} onCancel={() => { if (!saving.current) setDialog(null); }} onSubmit={comment => dialog.kind === 'retry' ? resend(dialog.ticket) : save(dialog.ticket, { status: 'Closed', resolution_comment: comment }, true)} />}
  </div>;
}
