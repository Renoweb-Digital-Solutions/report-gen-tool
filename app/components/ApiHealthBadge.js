'use client';

import { useEffect, useState } from 'react';

export default function ApiHealthBadge() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/health`, {
          cache: 'no-store'
        });
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    };

    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status === 'online') return '#22c55e'; // Green
    if (status === 'offline') return '#ef4444'; // Red
    return '#94a3b8'; // Gray
  };

  const getStatusText = () => {
    if (status === 'online') return 'API Online';
    if (status === 'offline') return 'API Offline';
    return 'Checking API...';
  };

  return (
    <div
      className={`api-health-badge ${status}`}
      title={`Backend Status: ${getStatusText()}`}
    >
      <div className="api-health-dot" />
      <span className="api-health-text">{getStatusText()}</span>
    </div>
  );
}
