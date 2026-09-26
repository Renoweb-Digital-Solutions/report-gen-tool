'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { getUserProfile, getUserTickets, getUserReports } from '@/app/lib/api';
import AuthModal from '@/app/components/AuthModal';
import { User, Mail, FileText, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { KeyRound, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportPage, setReportPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, ticketsData, reportsData] = await Promise.all([
          getUserProfile(),
          getUserTickets(),
          getUserReports(1, 5)
        ]);
        setProfile(profileData);
        setTickets(ticketsData.tickets || []);
        setReports(reportsData.reports || []);
        setTotalReports(reportsData.total || 0);
      } catch (err) {
        console.error(err);
        // Unauthorized, but we can just show empty
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  const handlePageChange = async (newPage) => {
    setLoadingReports(true);
    try {
      const data = await getUserReports(newPage, 5);
      setReports(data.reports || []);
      setReportPage(newPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/?logout=true');
  };

  const getStatusBadge = (status) => {
    if (status === 'Open') return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold flex items-center gap-1"><Clock size={12}/> Open</span>;
    if (status === 'Closed') return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Closed</span>;
    return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold flex items-center gap-1">{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {showAuthModal && <AuthModal initialView="forgot_email" profileEmail={profile?.email} onClose={() => setShowAuthModal(false)} />}
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-12">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Col: Profile Details */}
          <div className="md:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{profile?.username || 'User'}</h1>
              <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-2">
                <Mail size={14} /> {profile?.email || 'N/A'}
              </p>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 px-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reports</p>
                    <p className="text-xl font-bold text-blue-900">{profile?.report_count || 0}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <button onClick={() => setShowAuthModal(true)} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all">
                    <KeyRound size={16} className="text-slate-500" /> Change Password
                  </button>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-bold rounded-xl transition-all">
                    <LogOut size={16} className="text-red-500" /> Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Col: Tickets List */}
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Your Support Tickets</h2>
                <p className="text-sm text-slate-500">Track the status of your feedback and error reports.</p>
              </div>
              
              <div className="divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>You haven't submitted any tickets yet.</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            ticket.type === 'Error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {ticket.type}
                          </span>
                          <h3 className="font-bold text-slate-900">{ticket.title}</h3>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">
                        {ticket.description}
                      </p>
                      <div className="mt-4 text-xs text-slate-400 font-medium">
                        Submitted on {new Date(ticket.created_at + (ticket.created_at.endsWith('Z') ? '' : 'Z')).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>

          {/* Bottom Row: Reports List */}
          <div className="md:col-span-3 mt-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Reports History</h2>
                  <p className="text-sm text-slate-500">View your previously generated reports.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold">Report Type</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 relative">
                    {loadingReports && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                      </div>
                    )}
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                          <FileText size={32} className="mx-auto text-slate-300 mb-3" />
                          <p>No reports generated yet.</p>
                        </td>
                      </tr>
                    ) : (
                      reports.map(report => (
                        <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{report.type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max ${
                              report.status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {report.status === 'Successful' ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {new Date(report.created_at + (report.created_at.endsWith('Z') ? '' : 'Z')).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalReports > 5 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-sm text-slate-500">
                    Showing <span className="font-bold text-slate-900">{(reportPage - 1) * 5 + 1}</span> to <span className="font-bold text-slate-900">{Math.min(reportPage * 5, totalReports)}</span> of <span className="font-bold text-slate-900">{totalReports}</span> Entries
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePageChange(reportPage - 1)}
                      disabled={reportPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={() => handlePageChange(reportPage + 1)}
                      disabled={reportPage * 5 >= totalReports}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

      </main>
    </div>
  );
}
