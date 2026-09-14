'use client';
import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTicket } from '@/app/lib/api';

export default function SupportModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Feedback');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    setStatus('loading');
    setErrorMsg('');
    
    try {
      await createTicket({ title, description, type });
      setStatus('success');
      // Automatically close after 3 seconds on success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to submit ticket');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <MessageSquare size={20} className="text-blue-600" />
            Support & Feedback
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Submitted!</h3>
                <p className="text-slate-500">Thank you for your {type.toLowerCase()}. We'll look into it right away.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="type" 
                          value="Feedback" 
                          checked={type === 'Feedback'}
                          onChange={(e) => setType(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className="p-3 text-center border border-slate-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-medium text-slate-600 transition-all">
                          Feedback
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="type" 
                          value="Error" 
                          checked={type === 'Error'}
                          onChange={(e) => setType(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className="p-3 text-center border border-slate-200 rounded-xl peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-700 font-medium text-slate-600 transition-all">
                          Report Error
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Briefly describe the issue or idea"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900 placeholder:text-slate-400"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more details..."
                      rows={4}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900 placeholder:text-slate-400 resize-none"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Submit Ticket'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
