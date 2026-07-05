'use client';

import { useEffect, useState } from 'react';
import { BarChart, Globe, MapPin, Camera, Briefcase, Palette, LogOut } from 'lucide-react';

const TABS = [
  { id: 'full',       label: 'Full Report',        icon: BarChart, desc: 'SEO, social & brand' },
  { id: 'website',    label: 'Website Anatomy',     icon: Globe,    desc: 'Performance & health' },
  { id: 'gmb',        label: 'GMB Audit',           icon: MapPin,   desc: 'Google Business Profile' },
  { id: 'instagram',  label: 'Instagram Audit',     icon: Camera,   desc: 'Post & engagement analysis' },
  { id: 'linkedin',   label: 'LinkedIn Audit',      icon: Briefcase,desc: 'Company page review' },
  { id: 'visual',     label: 'Visual Brand Match',  icon: Palette,  desc: 'Color & identity check' },
];

export { TABS };

export default function TabNav({ activeTab, onTabChange, onLogout }) {
  return (
    <nav className="sidebar-nav" role="tablist" aria-label="Report sections" aria-orientation="vertical">
      <div className="sidebar-nav-header">
        <span className="sidebar-nav-label">Audit Modules</span>
      </div>
      <div className="sidebar-nav-items">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className={`sidebar-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="sidebar-tab-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              <span className="sidebar-tab-text">
                <span className="sidebar-tab-label">{tab.label}</span>
                <span className="sidebar-tab-desc">{tab.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="sidebar-nav-footer">
        <button 
          className="sidebar-logout-full-btn" 
          onClick={onLogout} 
          title="Log Out"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
}
