'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, FileText, Activity, ShieldCheck, LogOut, MessageSquare, Clock, CheckCircle2, RefreshCw, BarChart3 } from 'lucide-react';
import { getAdminUsers, getAdminTickets, getAnalyticsSummary } from '@/app/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [usersData, ticketsData, analyticsData] = await Promise.all([
        getAdminUsers(),
        getAdminTickets(),
        getAnalyticsSummary().catch(() => null)
      ]);
      setUsers(usersData?.users || []);
      setTickets(ticketsData?.tickets || []);
      setAnalytics(analyticsData || null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Access Denied');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    window.location.href = '/admin/login';
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

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', padding: '24px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--color-white)', maxWidth: '400px', width: '100%', padding: '32px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--color-border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--color-error)' }} />
          <div style={{ width: '64px', height: '64px', background: 'var(--color-error-bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldAlert size={32} color="var(--color-error)" />
          </div>
          <h1 className="form-panel-title">Access Denied</h1>
          <p className="form-panel-subtitle">Your session may have expired or you lack permissions.</p>
          <button onClick={() => window.location.href = '/admin/login'} className="btn-primary" style={{ marginTop: '24px' }}>
            Return to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const totalReports = users.reduce((acc, user) => acc + (user.report_count || 0), 0);
  const totalUsers = users.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', padding: '40px 24px', fontFamily: 'var(--font-primary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div className="section-icon-chip">
                <ShieldCheck size={18} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-dark)', letterSpacing: '-0.02em', margin: 0 }}>Admin Dashboard</h1>
            </div>
            <p style={{ color: 'rgba(25,25,25,0.6)', fontSize: '14px', marginLeft: '40px', margin: 0 }}>Overview of users and report generation activity.</p>
          </div>
          
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
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
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Reports Generated</h3>
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
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '16px' }}>System Status</h3>
              <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>All Systems Normal</p>
            </div>
          </motion.div>
        </div>

        {/* Table Section */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          
          <div style={{ padding: '0', borderBottom: '1px solid var(--color-border)', background: 'rgba(244,247,255,0.3)', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ padding: '20px', minWidth: '150px', background: activeTab === 'users' ? '#ffffff' : 'transparent', border: 'none', borderBottom: activeTab === 'users' ? '3px solid var(--brand-blue)' : '3px solid transparent', fontSize: '16px', fontWeight: 700, color: activeTab === 'users' ? 'var(--brand-deep)' : 'rgba(25,25,25,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Users size={18} /> User Accounts
            </button>
            <button 
              onClick={() => setActiveTab('tickets')}
              style={{ padding: '20px', minWidth: '150px', background: activeTab === 'tickets' ? '#ffffff' : 'transparent', border: 'none', borderBottom: activeTab === 'tickets' ? '3px solid var(--brand-blue)' : '3px solid transparent', fontSize: '16px', fontWeight: 700, color: activeTab === 'tickets' ? 'var(--brand-deep)' : 'rgba(25,25,25,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <MessageSquare size={18} /> Support Tickets
              {tickets.filter(t => t.status === 'Open').length > 0 && (
                <span style={{ background: 'var(--color-error)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                  {tickets.filter(t => t.status === 'Open').length} New
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              style={{ padding: '20px', minWidth: '150px', background: activeTab === 'analytics' ? '#ffffff' : 'transparent', border: 'none', borderBottom: activeTab === 'analytics' ? '3px solid var(--brand-blue)' : '3px solid transparent', fontSize: '16px', fontWeight: 700, color: activeTab === 'analytics' ? 'var(--brand-deep)' : 'rgba(25,25,25,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <BarChart3 size={18} /> Analytics
            </button>


            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={{ marginLeft: 'auto', marginRight: '20px', padding: '8px 12px', background: refreshing ? 'rgba(25,25,25,0.05)' : 'white', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-deep)', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {activeTab === 'analytics' ? (
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-deep)', marginBottom: '24px' }}>Traffic Overview (Last 30 Days)</h4>
                
                {analytics && analytics.chart_data && analytics.chart_data.length > 0 ? (
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" stroke="rgba(25,25,25,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(25,25,25,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-card)', fontWeight: 600 }}
                          itemStyle={{ color: 'var(--brand-blue)' }}
                        />
                        <Line type="monotone" dataKey="views" name="Page Views" stroke="var(--brand-blue)" strokeWidth={3} dot={{ r: 4, fill: 'var(--brand-blue)', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(25,25,25,0.5)' }}>
                    No analytics data available yet.
                  </div>
                )}
                
                {analytics && analytics.top_events && analytics.top_events.length > 0 && (
                  <div style={{ marginTop: '40px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-deep)', marginBottom: '24px' }}>Top Events</h4>
                    <div style={{ height: '250px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.top_events} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={true} vertical={false} />
                          <XAxis type="number" stroke="rgba(25,25,25,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="rgba(25,25,25,0.8)" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-card)', fontWeight: 600 }}
                            cursor={{ fill: 'rgba(48,143,239,0.05)' }}
                          />
                          <Bar dataKey="value" name="Count" fill="var(--brand-blue)" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'users' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Reports</th>
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
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 10px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {user.report_count || 0}
                        </div>
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
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Details</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'rgba(25,25,25,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => (
                    <tr key={ticket._id || idx} style={{ borderBottom: '1px solid rgba(2,61,187,0.04)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(48,143,239,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{ticket.username}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(25,25,25,0.5)', marginTop: '2px' }}>{ticket.email}</div>
                      </td>
                      <td style={{ padding: '16px 24px', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ 
                            padding: '2px 8px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase',
                            background: ticket.type === 'Error' ? 'rgba(239,68,68,0.1)' : 'rgba(48,143,239,0.1)',
                            color: ticket.type === 'Error' ? 'var(--color-error)' : 'var(--brand-blue)'
                          }}>
                            {ticket.type}
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--color-dark)' }}>{ticket.title}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(25,25,25,0.7)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                          {ticket.description}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        {ticket.status === 'Open' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '20px', background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
                            <Clock size={14} /> Open
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
                            <CheckCircle2 size={14} /> Closed
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', verticalAlign: 'top', textAlign: 'right', fontSize: '13px', color: 'rgba(25,25,25,0.5)', fontWeight: 500 }}>
                        {new Date(ticket.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(25,25,25,0.4)', fontWeight: 500 }}>No support tickets found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
