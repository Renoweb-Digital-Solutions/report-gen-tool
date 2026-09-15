'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, AlertCircle, MessageSquare, Search, ChevronDown, ChevronRight, ArrowRight, Sparkles, Send, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTicket, matchFaqs } from '@/app/lib/api';
import { FAQ_CATEGORIES } from '@/app/data/faqs';

export default function SupportModal({ onClose }) {
  // Step: 'faq' | 'ticket' | 'success'
  const [step, setStep] = useState('faq');
  const [query, setQuery] = useState('');
  const [faqMatches, setFaqMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [resolvedByFaq, setResolvedByFaq] = useState(false);

  // Ticket form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Feedback');
  const [ticketStatus, setTicketStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [ticketFaqMatches, setTicketFaqMatches] = useState([]);
  const [isTicketSearching, setIsTicketSearching] = useState(false);

  const debounceTimer = useRef(null);
  const ticketDebounceTimer = useRef(null);
  const inputRef = useRef(null);

  // Flatten all FAQs for sending to backend
  const allFaqs = FAQ_CATEGORIES.flatMap(cat => cat.faqs);

  // Debounced FAQ matching
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setResolvedByFaq(false);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value.trim().length < 8) {
      setFaqMatches([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const result = await matchFaqs(value, allFaqs);
        setFaqMatches(result.matches || []);
      } catch {
        setFaqMatches([]);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  }, [allFaqs]);

  // Debounced FAQ matching for Ticket Form Subject
  const handleTitleChange = useCallback((value) => {
    setTitle(value);

    if (ticketDebounceTimer.current) clearTimeout(ticketDebounceTimer.current);

    if (value.trim().length < 8) {
      setTicketFaqMatches([]);
      setIsTicketSearching(false);
      return;
    }

    setIsTicketSearching(true);
    ticketDebounceTimer.current = setTimeout(async () => {
      try {
        const result = await matchFaqs(value, allFaqs);
        setTicketFaqMatches(result.matches || []);
      } catch {
        setTicketFaqMatches([]);
      } finally {
        setIsTicketSearching(false);
      }
    }, 600);
  }, [allFaqs]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (ticketDebounceTimer.current) clearTimeout(ticketDebounceTimer.current);
    };
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleGoToTicket = () => {
    setTitle(query);
    setStep('ticket');
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setTicketStatus('loading');
    setErrorMsg('');

    try {
      await createTicket({ title, description, type });
      setTicketStatus('success');
      setStep('success');
      setTimeout(() => onClose(), 3500);
    } catch (err) {
      setTicketStatus('error');
      setErrorMsg(err.message || 'Failed to submit ticket');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <HelpCircle size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Support & Help</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {step === 'faq' && 'Search FAQs or submit a ticket'}
                {step === 'ticket' && 'Submit a support ticket'}
                {step === 'success' && 'Ticket submitted'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ============ STEP 1: FAQ SEARCH ============ */}
            {step === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {/* Search Input */}
                <div className="relative mb-5">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Describe your question or issue..."
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* AI Badge */}
                {query.length >= 8 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mb-4 text-[11px] text-indigo-600 font-semibold"
                  >
                    <Sparkles size={12} />
                    <span>AI-powered FAQ matching</span>
                  </motion.div>
                )}

                {/* Resolved state */}
                {resolvedByFaq && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center"
                  >
                    <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-emerald-800">Glad that helped!</p>
                    <p className="text-xs text-emerald-600 mt-1">Feel free to search again or close this window.</p>
                  </motion.div>
                )}

                {/* FAQ Matches */}
                {faqMatches.length > 0 && !resolvedByFaq && (
                  <div className="space-y-2.5 mb-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {faqMatches.length} matching FAQ{faqMatches.length > 1 ? 's' : ''} found
                    </p>
                    {faqMatches.map((faq, idx) => {
                      const isExpanded = expandedFaq === idx;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                            className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
                          >
                            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 leading-snug">{faq.q}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                                  {Math.round(faq.relevance * 100)}% match
                                </span>
                              </div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-4 pb-4 pt-0">
                                  <div className="pl-9 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                                    {faq.a}
                                  </div>
                                  <div className="pl-9 mt-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setResolvedByFaq(true);
                                        setFaqMatches([]);
                                        setExpandedFaq(null);
                                      }}
                                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                    >
                                      ✓ This answered my question
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* No results state */}
                {query.length >= 8 && !isSearching && faqMatches.length === 0 && !resolvedByFaq && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center"
                  >
                    <p className="text-sm text-amber-800 font-medium">No matching FAQs found for your query.</p>
                    <p className="text-xs text-amber-600 mt-1">You can submit a support ticket below.</p>
                  </motion.div>
                )}

                {/* Divider + Submit Ticket CTA */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <button
                    onClick={handleGoToTicket}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <Send size={16} />
                    <span>{faqMatches.length > 0 || resolvedByFaq ? "Still need help? Submit a ticket" : "Submit a support ticket"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                  >
                    <HelpCircle size={16} className="text-slate-400" />
                    <span>Browse all FAQs</span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ============ STEP 2: TICKET FORM ============ */}
            {step === 'ticket' && (
              <motion.div
                key="ticket"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {/* Back button */}
                <button
                  onClick={() => setStep('faq')}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 mb-5 transition-colors"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Back to FAQ search
                </button>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  {/* Type selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Type</label>
                    <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="Feedback"
                          checked={type === 'Feedback'}
                          onChange={(e) => setType(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className="p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-bold text-sm text-slate-500 transition-all">
                          💬 Feedback
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
                        <div className="p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 font-bold text-sm text-slate-500 transition-all">
                          🐛 Report Error
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Subject</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Briefly describe the issue or idea"
                        className="w-full p-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                        disabled={ticketStatus === 'loading'}
                      />
                      {isTicketSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ticket FAQ Matches inline */}
                  <AnimatePresence>
                    {ticketFaqMatches.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mt-1 mb-2">
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={10} />
                            Suggested FAQs
                          </p>
                          {ticketFaqMatches.slice(0, 3).map((faq, idx) => {
                            const isExpanded = expandedFaq === `ticket-${idx}`;
                            return (
                              <div
                                key={idx}
                                className="bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => setExpandedFaq(isExpanded ? null : `ticket-${idx}`)}
                                  className="w-full px-3 py-2.5 flex items-start gap-2 text-left hover:bg-indigo-50 transition-colors"
                                >
                                  <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <ChevronDown
                                      size={12}
                                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 leading-snug">{faq.q}</p>
                                  </div>
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                    >
                                      <div className="px-3 pb-3 pt-0">
                                        <div className="pl-7 text-xs text-slate-600 leading-relaxed border-t border-indigo-100 pt-2">
                                          {faq.a}
                                        </div>
                                        <div className="pl-7 mt-2">
                                          <button
                                            type="button"
                                            onClick={() => onClose()}
                                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                                          >
                                            ✓ This answered my question
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more details about your issue..."
                      rows={4}
                      className="w-full p-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-all"
                      disabled={ticketStatus === 'loading'}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={ticketStatus === 'loading'}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {ticketStatus === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ============ STEP 3: SUCCESS ============ */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 px-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Ticket Submitted!</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Thank you for your {type.toLowerCase()}. Our team will review it and get back to you shortly.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
