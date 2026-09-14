'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sendAnalyticsEvent } from '@/app/lib/api';

const AnalyticsContext = createContext({ trackEvent: () => {} });

export function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const [visitorId, setVisitorId] = useState(null);
  const [canTrack, setCanTrack] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('analytics_consent');
      if (consent === 'accepted') {
        setCanTrack(true);
        initVisitorId();
      }
    };

    checkConsent();
    
    // Listen for custom event from CookieBanner if accepted during session
    window.addEventListener('analytics_consent_given', checkConsent);
    return () => window.removeEventListener('analytics_consent_given', checkConsent);
  }, []);

  const initVisitorId = () => {
    // Simple cookie parser
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    let vid = getCookie('flawdits_visitor_id');
    if (!vid) {
      vid = crypto.randomUUID();
      // Set cookie for 1 year
      const date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      document.cookie = `flawdits_visitor_id=${vid};expires=${date.toUTCString()};path=/`;
    }
    setVisitorId(vid);
  };

  const trackEvent = (eventName, eventData = {}) => {
    if (!canTrack || !visitorId) return;
    
    sendAnalyticsEvent({
      visitor_id: visitorId,
      event_type: eventName,
      event_data: eventData,
      url: window.location.pathname
    });
  };

  // Track page views automatically
  useEffect(() => {
    if (canTrack && visitorId && pathname) {
      trackEvent('page_view', { page: pathname });
    }
  }, [pathname, canTrack, visitorId]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext);
