'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    if (consent !== 'accepted') {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    setShow(false);
    window.dispatchEvent(new Event('analytics_consent_given'));
  };

  const handleDecline = () => {
    // Strict block: if declined, we still save to avoid annoying them, but don't dispatch event
    localStorage.setItem('analytics_consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto border border-slate-700">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">We value your privacy</h3>
              <p className="text-sm text-slate-400">
                We use strictly necessary cookies to make our site work. We'd also like to set analytics cookies to help us improve your experience. Tracking will remain disabled unless you accept.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button 
                onClick={handleDecline}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white transition-colors text-sm"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-colors text-sm"
              >
                Accept Analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
