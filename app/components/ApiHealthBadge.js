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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11.5px',
        color: 'rgba(25, 25, 25, 0.7)',
        background: 'rgba(25, 25, 25, 0.03)',
        padding: '6px 12px',
        borderRadius: '16px',
        border: '1px solid rgba(25, 25, 25, 0.06)',
        userSelect: 'none',
      }}
      title={`Backend Status: ${getStatusText()}`}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          transition: 'background-color 0.3s ease',
          boxShadow: status === 'online' ? '0 0 8px rgba(34, 197, 94, 0.4)' : 'none'
        }}
      />
      <span style={{ fontWeight: 500 }}>{getStatusText()}</span>
    </div>
  );
}
