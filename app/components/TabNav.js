'use client';

const TABS = [
  { id: 'full',       label: 'Full Report',        icon: '📊' },
  { id: 'website',    label: 'Website Anatomy',     icon: '🌐' },
  { id: 'gmb',        label: 'GMB Audit',           icon: '📍' },
  { id: 'instagram',  label: 'Instagram Audit',     icon: '📸' },
  { id: 'linkedin',   label: 'LinkedIn Audit',      icon: '💼' },
  { id: 'visual',     label: 'Visual Brand Match',  icon: '🎨' },
];

export { TABS };

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="tab-nav" role="tablist" aria-label="Report sections">
      <div className="tab-nav-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
