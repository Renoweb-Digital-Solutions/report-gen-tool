'use client';

/**
 * Shared admin shell for /admin and its users/tickets/analytics/feedback child routes.
 * Retains existing account, suspension and email actions. Section reads are
 * isolated; AnalyticsDashboard owns its filters, loading, retries and reporting.
 * Cookie authorization remains authoritative on every protected backend API.
 */
import { checkSession, logoutSession } from '@/app/features/auth/api';

import Link from 'next/link';
import AnalyticsDashboard from './AnalyticsDashboard';
import TicketDesk from './TicketDesk';
// The feedback inbox owns paginated reads/errors independently of account tools.
import FeedbackInbox from './FeedbackInbox';
import styles from './admin.module.css';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, ShieldCheck, LogOut, MessageSquare, RefreshCw, BarChart3, ChevronDown, Mail, Wand2, Send } from 'lucide-react';
import { getAdminUsers, getAdminTickets, suspendAdminUser, unsuspendAdminUser, generateAdminEmail, sendAdminEmail } from '@/app/lib/api';
import ThemeToggle from '@/app/components/ThemeToggle';

/**
 * Shared admin workspace consumed by /admin and dedicated users/tickets/analytics/feedback
 * routes. Existing account/email operations remain here; analytics reads are
 * isolated in AnalyticsDashboard and cannot disable account or ticket access.
 */
export default function AdminPanel({ initialSection = 'users' }) {
  // ========================================================================
  // SECTION DATA AND EXISTING ADMIN ACTION STATE
  // Server cookies authorize actions; route props and filters are display state.
  // ========================================================================
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  // Route-backed sections preserve deep links, reloads and browser navigation.
  const activeTab = initialSection;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  // Reject responses from a previously selected route or older refresh.
  const requestVersion = useRef(0);

  const [expandedUsers, setExpandedUsers] = useState({});

  /** Expand the account row breakdown by username; this changes display state only. */
  const toggleUserExpansion = (username) => {
    setExpandedUsers(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const [suspendModal, setSuspendModal] = useState({ isOpen: false, user: null, reason: '' });
  const [submittingSuspend, setSubmittingSuspend] = useState(false);

  const [emailModal, setEmailModal] = useState({ isOpen: false, type: 'feedback', context: '', subject: '', body: '', to_email: '', username: '' });
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  /** Request a draft for the existing email modal; retain editable content and show generation failures. */
  const handleGenerateEmail = async () => {
      setGeneratingEmail(true);
      try {
          const res = await generateAdminEmail({ type: emailModal.type, context: emailModal.context, username: emailModal.username });
          setEmailModal(prev => ({ ...prev, body: res.generated_body }));
      } catch (err) {
          alert('Error generating email: ' + err.message);
      } finally {
          setGeneratingEmail(false);
      }
  };

  /** Validate recipient/subject/body and invoke the existing send action only after an explicit admin click; close on success and preserve errors. */
  const handleSendEmail = async () => {
      if (!emailModal.to_email.trim() || !emailModal.subject.trim() || !emailModal.body.trim()) {
          alert('Please fill out recipient, subject and body');
          return;
      }
      setSendingEmail(true);
      try {
          await sendAdminEmail({ to_email: emailModal.to_email, subject: emailModal.subject, body: emailModal.body });
          alert('Email sent successfully!');
          setEmailModal({ isOpen: false, type: 'feedback', context: '', subject: '', body: '', to_email: '', username: '' });
      } catch (err) {
          alert('Error sending email: ' + err.message);
      } finally {
          setSendingEmail(false);
      }
  };

  /** Open the existing reason dialog, or require the existing confirmation before restoring an account; API authorization remains authoritative. */
  const handleSuspendClick = (user) => {
    if (user.is_suspended) {
        if (window.confirm(`Are you sure you want to unsuspend ${user.username}?`)) {
            unsuspendUserCall(user.username);
        }
    } else {
        setSuspendModal({ isOpen: true, user, reason: '' });
    }
  };

  /** Restore the selected account through the existing admin API and refresh account data; surface failures without changing local account status. */
  const unsuspendUserCall = async (username) => {
      try {
          await unsuspendAdminUser(username);
          fetchData(true);
      } catch (err) {
          alert('Error: ' + err.message);
      }
  };

  /** Require a reason and submit the existing account suspension operation; refresh only after success and retain server-owned mail behavior. */
  const handleSuspendSubmit = async () => {
      if (!suspendModal.reason.trim()) {
          alert('Please provide a reason');
          return;
      }
      setSubmittingSuspend(true);
      try {
          await suspendAdminUser(suspendModal.user.username, suspendModal.reason);
          setSuspendModal({ isOpen: false, user: null, reason: '' });
          fetchData(true);
      } catch (err) {
          alert('Error: ' + err.message);
      } finally {
          setSubmittingSuspend(false);
      }
  };

  // ========================================================================
  // READ ORCHESTRATION AND AUTHORIZATION
  // Independent outcomes prevent a reporting outage from blocking accounts.
  // ========================================================================
  /** Load section records after authorization. Read failures stay local, and version checks reject stale responses after navigation or a newer refresh. */
  const fetchData = async (isRefresh = false) => {
    const version = ++requestVersion.current;
    if (isRefresh) setRefreshing(true);
    try {
      // Read only the current section. Analytics has its own error/retry state.
      // Ticket counts are loaded separately, and cannot block the users view.
      const [userResult, ticketResult] = await Promise.allSettled([
        activeTab === 'users' ? getAdminUsers() : Promise.resolve(null),
        getAdminTickets(),
      ]);
      if (version !== requestVersion.current) return;
      if (activeTab === 'users' && userResult.status === 'rejected') throw userResult.reason;
      if (activeTab === 'tickets' && ticketResult.status === 'rejected') throw ticketResult.reason;
      if (userResult.status === 'fulfilled') setUsers(userResult.value?.users || []);
      if (ticketResult.status === 'fulfilled') setTickets(ticketResult.value?.tickets || []);
      setError(null);
    } catch (err) {
      if (version === requestVersion.current) setError(err.message || 'Could not load this section.');
    } finally {
      if (version === requestVersion.current) { setLoading(false); setRefreshing(false); }
    }
  };

  useEffect(() => {
    // Route transitions can reuse this client shell. Reauthorize/refetch the
    // current section and ignore an older route's pending work after cleanup.
    let active = true;
    setLoading(true);
    checkSession('admin').then(() => { if (active) fetchData(); }).catch(() => { if (active) window.location.href = '/admin/login'; });
    return () => { active = false; requestVersion.current += 1; };
  }, [activeTab]);

  /** Revoke the independent admin session and navigate to login; retain this workspace with an error if revocation fails. */
  const handleLogout = async () => {
    try { await logoutSession('admin'); window.location.href = '/admin/login'; }
    catch (error) { setError(error.message || 'Could not sign out. Please try again.'); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px', borderColor: 'rgba(48,143,239,0.3)', borderTopColor: 'var(--brand-blue)' }}></div>
          <p style={{ color: 'var(--color-dark)', fontWeight: 500 }}>Authenticating Session...</p>
        </div>
      </div>
    );
  }

  /** Merge persisted ticket mutations and invalidate any older inbox refresh. */
  const handleTicketSaved = (saved) => {
    requestVersion.current += 1;
    setRefreshing(false);
    setTickets(previous => previous.map(ticket => ticket._id === saved._id ? saved : ticket));
  };

  // Feedback is route-backed like the other sections and owns its own read state.
  const sectionTitle = activeTab === 'feedback' ? 'User Feedback' : activeTab === 'analytics' ? 'Product Analytics' : activeTab === 'tickets' ? 'Support Tickets' : 'User Accounts';
  const totalReports = users.reduce((acc, user) => acc + (user.report_count || 0), 0);
  const totalUsers = users.length;

  // ========================================================================
  // WORKSPACE RENDERING
  // Route links persist outside section errors; dialogs retain existing actions.
  // ========================================================================
  return (
    <div className={`admin-page-container ${styles.shell}`} style={{ minHeight: '100vh', background: 'var(--color-surface)', padding: '0', fontFamily: 'var(--font-primary)' }}>
      {/* Persistent route navigation is independent of data/table loading. */}
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.wordmark}>flawdits<span>ADMIN WORKSPACE</span></Link>
        <p className={styles.navLabel}>MANAGE</p>
        <nav aria-label="Administration">
          <Link href="/admin/users" aria-current={activeTab === 'users' ? 'page' : undefined}><Users size={19} />User Accounts</Link>
          <Link href="/admin/tickets" aria-current={activeTab === 'tickets' ? 'page' : undefined}><MessageSquare size={19} />Support Tickets{tickets.some(t => !t.admin_archived && ['Open', 'In Progress'].includes(t.status)) && <span className={styles.badge}>{tickets.filter(t => !t.admin_archived && ['Open', 'In Progress'].includes(t.status)).length}</span>}</Link>
          {/* Feedback identity and comments are only fetched inside this protected section. */}
          <Link href="/admin/feedback" aria-current={activeTab === 'feedback' ? 'page' : undefined}><MessageSquare size={19} />Feedback</Link>
          <Link href="/admin/analytics" aria-current={activeTab === 'analytics' ? 'page' : undefined}><BarChart3 size={19} />Analytics</Link>
        </nav>
        <div className={styles.railNote}><ShieldCheck size={18} /><span>Admin access<br /><small>Accounts, support & insights</small></span></div>
      </aside>
      <div className={styles.workspace}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div className="section-icon-chip">
                <ShieldCheck size={18} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-dark)', letterSpacing: '-0.02em', margin: 0 }}>{sectionTitle}</h1>
            </div>
            <p className="admin-header-subtitle" style={{ color: 'rgba(25,25,25,0.6)', fontSize: '14px', marginLeft: '40px', margin: 0 }}>{activeTab === 'feedback' ? 'See how users feel and what they want to share.' : activeTab === 'analytics' ? 'Understand what people use, choose and return to.' : activeTab === 'tickets' ? 'Keep customer questions and issues in one place.' : 'Manage accounts and review recorded report activity.'}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <button onClick={handleLogout} className="admin-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* A section read failure keeps navigation and account operations reachable. */}
        {error && <div role="alert" className={styles.sectionError}><strong>Could not load this section</strong><p>{error}</p><button onClick={() => fetchData(true)} disabled={refreshing}>Try again</button></div>}

        {/* Account metrics stay in their own workspace; analytics defines its own counts. */}
        {activeTab === 'users' && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '24px', marginBottom: '40px' }}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'var(--color-white)', padding: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Total Users</h3>
              <Users size={20} color="var(--brand-blue)" />
            </div>
            <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--brand-deep)', margin: 0 }}>{totalUsers}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'var(--color-white)', padding: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Recorded Reports</h3>
              <FileText size={20} color="var(--brand-cyan)" />
            </div>
            <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--brand-deep)', margin: 0 }}>{totalReports}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'var(--brand-gradient)', padding: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-button)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.15 }}>
              <Activity size={120} />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '16px' }}>Support Tickets</h3>
              <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{tickets.length} recorded</p>
            </div>
          </motion.div>
        </div>

        </>}

        {/* Section-specific content preserves account and support operations. */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          
          <div className={styles.toolbar}>
            <span>{sectionTitle}</span>
            {/* Feedback has its own refresh action and is a read-only inbox. */}
            {activeTab !== 'tickets' && activeTab !== 'feedback' && <button
              onClick={() => setEmailModal(prev => ({ ...prev, isOpen: true }))}
              style={{ marginLeft: 'auto', padding: '8px 12px', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-blue)', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}
            >
              <Mail size={14} /> Send Email
            </button>}
            {activeTab !== 'analytics' && activeTab !== 'feedback' && <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={{ marginLeft: 'auto', marginRight: '20px', padding: '8px 12px', background: refreshing ? 'rgba(25,25,25,0.05)' : 'white', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-deep)', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>}
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {activeTab === 'feedback' ? <FeedbackInbox /> : activeTab === 'analytics' ? <AnalyticsDashboard /> : activeTab === 'users' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr className="admin-table-header-row">
                    <th className="admin-table-th">Username</th>
                    <th className="admin-table-th">Email</th>
                    <th className="admin-table-th">Role</th>
                    <th className="admin-table-th">Reports</th>
                    <th className="admin-table-th" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(2,61,187,0.04)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(48,143,239,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--color-dark)' }}>{user.username}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'rgba(25,25,25,0.7)' }}>{user.email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '4px 12px', fontSize: '11px', fontWeight: 700, borderRadius: '20px', textTransform: 'uppercase',
                          background: user.role === 'admin' ? 'rgba(2,61,187,0.08)' : 'rgba(25,25,25,0.05)',
                          color: user.role === 'admin' ? 'var(--brand-deep)' : 'rgba(25,25,25,0.6)'
                        }}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => toggleUserExpansion(user.username)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', outline: 'none' }}
                          >
                            <span className="admin-reports-label text-xs font-bold uppercase" style={{ color: 'var(--color-text-muted)' }}>TOTAL</span>
                            <div className="admin-reports-total" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px', height: '24px', padding: '0 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', fontWeight: 700, fontSize: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                              {user.report_count || 0}
                            </div>
                            {user.report_breakdown && Object.keys(user.report_breakdown).length > 0 && (
                              <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transform: expandedUsers[user.username] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            )}
                          </button>
                          {expandedUsers[user.username] && user.report_breakdown && Object.keys(user.report_breakdown).length > 0 && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px', borderLeft: '2px solid var(--color-border)', overflow: 'hidden' }}>
                              {Object.entries(user.report_breakdown).map(([type, count]) => (
                                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
                                  <span style={{ color: 'var(--color-text-sub)', fontWeight: 500 }}>{type.replace(' Audit', '')}</span>
                                  <span style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{count}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setEmailModal(prev => ({ ...prev, isOpen: true, to_email: user.email, username: user.username }))}
                          style={{ padding: '6px', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleSuspendClick(user)}
                            style={{ padding: '6px 12px', background: user.is_suspended ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: user.is_suspended ? 'var(--color-success)' : 'var(--color-error)', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                          >
                            {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(25,25,25,0.4)', fontWeight: 500 }}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : <TicketDesk tickets={tickets} onTicketSaved={handleTicketSaved} onRefresh={() => fetchData(true)} />}
          </div>
        </motion.div>
      </div>

      {suspendModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0, fontSize: '20px', color: 'var(--color-dark)' }}>Suspend {suspendModal.user?.username}</h3>
            <p style={{ color: 'rgba(25,25,25,0.6)', marginBottom: '20px' }}>Please provide a reason for suspending this account. An email will be sent to the user automatically.</p>
            
            <textarea
              value={suspendModal.reason}
              onChange={e => setSuspendModal({...suspendModal, reason: e.target.value})}
              placeholder="e.g. Violation of terms of service"
              style={{ width: '100%', minHeight: '100px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '20px', fontFamily: 'inherit' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setSuspendModal({isOpen: false, user: null, reason: ''})}
                style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSuspendSubmit}
                disabled={submittingSuspend}
                style={{ padding: '10px 16px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '8px', cursor: submittingSuspend ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: submittingSuspend ? 0.7 : 1 }}
              >
                {submittingSuspend ? 'Suspending...' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {emailModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--color-white)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={20} color="var(--brand-blue)" /> AI Email Campaign
                </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {/* Left Column */}
                <div style={{ flex: '1 1 350px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--color-dark)' }}>1. Generate Template</h4>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>Email Type</label>
                        <select 
                            value={emailModal.type} 
                            onChange={e => setEmailModal({...emailModal, type: e.target.value})}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-surface)', color: 'var(--color-dark)' }}
                        >
                            <option value="feedback">Request Feedback</option>
                            <option value="marketing">Marketing / Outreach</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>Context / Topic (Optional)</label>
                        <textarea
                            value={emailModal.context}
                            onChange={e => setEmailModal({...emailModal, context: e.target.value})}
                            placeholder="Enter context, or leave blank for a default AI template..."
                            style={{ width: '100%', minHeight: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontFamily: 'inherit', background: 'var(--color-surface)', color: 'var(--color-dark)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button 
                            onClick={handleGenerateEmail}
                            disabled={generatingEmail}
                            style={{ padding: '10px 20px', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', cursor: generatingEmail ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                        >
                            <Wand2 size={16} /> {generatingEmail ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ flex: '1 1 400px', borderLeft: '1px solid var(--color-border)', paddingLeft: '32px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--color-dark)' }}>2. Review & Send</h4>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>Recipient Email</label>
                        <input 
                            type="email"
                            value={emailModal.to_email}
                            onChange={e => setEmailModal({...emailModal, to_email: e.target.value})}
                            placeholder="user@example.com"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-surface)', color: 'var(--color-dark)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>Email Subject</label>
                        <select 
                            value={emailModal.subject}
                            onChange={e => setEmailModal({...emailModal, subject: e.target.value})}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-surface)', color: 'var(--color-dark)' }}
                        >
                            <option value="">Select a subject...</option>
                            {emailModal.type === 'feedback' ? (
                                <>
                                    <option value="We value your feedback!">We value your feedback!</option>
                                    <option value="How was your experience with Flawdits?">How was your experience with Flawdits?</option>
                                    <option value="Help us improve Flawdits">Help us improve Flawdits</option>
                                </>
                            ) : (
                                <>
                                    <option value="New updates from Flawdits">New updates from Flawdits</option>
                                    <option value="Discover what's new on Flawdits">Discover what's new on Flawdits</option>
                                    <option value="A special message from the Flawdits team">A special message from the Flawdits team</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>Email Body (Editable)</label>
                        <textarea
                            value={emailModal.body}
                            onChange={e => setEmailModal({...emailModal, body: e.target.value})}
                            style={{ width: '100%', minHeight: '180px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontFamily: 'inherit', background: 'var(--color-surface)', color: 'var(--color-dark)' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                            onClick={() => setEmailModal({isOpen: false, type: 'feedback', context: '', subject: '', body: '', to_email: '', username: ''})}
                            style={{ padding: '10px 16px', background: 'transparent', color: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSendEmail}
                            disabled={sendingEmail}
                            style={{ padding: '10px 16px', background: 'var(--brand-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: sendingEmail ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', opacity: sendingEmail ? 0.7 : 1 }}
              >
                <Send size={16} /> {sendingEmail ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

    </div>
  );
}
