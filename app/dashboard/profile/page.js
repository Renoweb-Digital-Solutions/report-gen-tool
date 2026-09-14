'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { getUserProfile, getUserTickets } from '@/app/lib/api';
import { User, Mail, FileText, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, ticketsData] = await Promise.all([
          getUserProfile(),
          getUserTickets()
        ]);
        setProfile(profileData);
        setTickets(ticketsData.tickets || []);
      } catch (err) {
        console.error(err);
        // Unauthorized, but we can just show empty
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
              
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center px-4">
                <div className="text-left">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reports</p>
                  <p className="text-xl font-bold text-blue-900">{profile?.report_count || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Role</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{profile?.role || 'User'}</p>
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
                        Submitted on {new Date(ticket.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
