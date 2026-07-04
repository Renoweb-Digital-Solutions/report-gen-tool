'use client';

const TAB_MOCK_DATA = {
  full: {
    title: 'Full Audit Config',
    fields: [
      { label: 'Domain', val: 'example.com', delay: 0 },
      { label: 'Keywords', val: 'seo, branding', delay: 1 },
      { label: 'Competitors', val: 'competitor.com', delay: 2 }
    ],
    checklist: ['SEO & Keywords', 'Social Profiles', 'Brand Consistency'],
    stats: [
      { val: '92', lbl: 'SEO Score' },
      { val: 'A+', lbl: 'Health' },
      { val: '24K', lbl: 'Reach' }
    ],
    doneTitle: 'Full Report Ready'
  },
  website: {
    title: 'Website Config',
    fields: [
      { label: 'Domain', val: 'example.com', delay: 0 },
      { label: 'Country', val: 'United States', delay: 1 },
      { label: 'Language', val: 'English', delay: 2 }
    ],
    checklist: ['Technical SEO', 'Page Speed', 'Mobile Usability'],
    stats: [
      { val: '94', lbl: 'Perf Score' },
      { val: '0.8s', lbl: 'Load Time' },
      { val: '100', lbl: 'SEO' }
    ],
    doneTitle: 'Website Audit Ready'
  },
  gmb: {
    title: 'GMB Audit Config',
    fields: [
      { label: 'Business Name', val: 'Acme Corp', delay: 0 },
      { label: 'Location', val: 'New York, NY', delay: 1 },
      { label: 'Category', val: 'Software', delay: 2 }
    ],
    checklist: ['Profile Completeness', 'Reviews Analysis', 'Local Rankings'],
    stats: [
      { val: '4.8★', lbl: 'Rating' },
      { val: '142', lbl: 'Reviews' },
      { val: '#3', lbl: 'Local Rank' }
    ],
    doneTitle: 'GMB Audit Ready'
  },
  instagram: {
    title: 'Instagram Config',
    fields: [
      { label: 'Profile URL', val: 'instagram.com/acme', delay: 0 },
      { label: 'Target Audience', val: 'Gen Z, Tech', delay: 1 },
      { label: 'Hashtags', val: '#tech #software', delay: 2 }
    ],
    checklist: ['Follower Growth', 'Engagement Rate', 'Content Quality'],
    stats: [
      { val: '12.4K', lbl: 'Followers' },
      { val: '4.2%', lbl: 'Engagement' },
      { val: 'A', lbl: 'Quality' }
    ],
    doneTitle: 'Instagram Audit Ready'
  },
  linkedin: {
    title: 'LinkedIn Config',
    fields: [
      { label: 'Company Page', val: 'linkedin.com/company/acme', delay: 0 },
      { label: 'Industry', val: 'Technology', delay: 1 },
      { label: 'Company Size', val: '51-200', delay: 2 }
    ],
    checklist: ['Employee Network', 'Post Reach', 'Lead Generation'],
    stats: [
      { val: '5.2K', lbl: 'Followers' },
      { val: '18%', lbl: 'Click Rate' },
      { val: '340', lbl: 'Avg Likes' }
    ],
    doneTitle: 'LinkedIn Audit Ready'
  },
  visual: {
    title: 'Visual Identity Config',
    fields: [
      { label: 'Brand Name', val: 'Acme Corp', delay: 0 },
      { label: 'Core Colors', val: 'Blue, White', delay: 1 },
      { label: 'Vibe', val: 'Modern, Clean', delay: 2 }
    ],
    checklist: ['Logo Usage', 'Color Palette', 'Typography'],
    stats: [
      { val: '98%', lbl: 'Consistency' },
      { val: 'Pass', lbl: 'Contrast' },
      { val: 'High', lbl: 'Impact' }
    ],
    doneTitle: 'Visual Audit Ready'
  }
};

/**
 * GhostReportPreview — Looping workflow animation for the empty right panel.
 * Shows: Fill Form → Generating → Report Ready in a continuous cycle.
 */
export default function GhostReportPreview({ activeTab }) {
  // Fallback to 'full' if activeTab is somehow invalid
  const data = TAB_MOCK_DATA[activeTab] || TAB_MOCK_DATA.full;

  return (
    <div className="ghost-container">
      <div className="ghost-scene" key={activeTab}>

        {/* ── STAGE 1: Form Filling ── */}
        <div className="ghost-stage ghost-stage-form">
          <div className="ghost-form-card">
            {/* Top bar */}
            <div className="ghost-form-topbar">
              <span className="ghost-dot ghost-dot--red" />
              <span className="ghost-dot ghost-dot--yellow" />
              <span className="ghost-dot ghost-dot--green" />
            </div>

            {/* Form title */}
            <div className="ghost-form-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>{data.title}</span>
            </div>

            {/* Animated form fields */}
            {data.fields.map((field, idx) => {
              const delayClass = field.delay > 0 ? ` ghost-field-delay-${field.delay}` : '';
              const typingDelayClass = field.delay > 0 ? ` ghost-typing-delay-${field.delay}` : '';
              
              return (
                <div key={idx} className={`ghost-field${delayClass}`}>
                  <div className="ghost-field-label">{field.label}</div>
                  <div className="ghost-field-input">
                    <span className={`ghost-typing${typingDelayClass}`}>{field.val}</span>
                  </div>
                </div>
              );
            })}

            {/* Animated button */}
            <div className="ghost-btn-wrap">
              <div className="ghost-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
                Generate Report
              </div>
            </div>
          </div>
        </div>

        {/* ── STAGE 2: Processing ── */}
        <div className="ghost-stage ghost-stage-process">
          <div className="ghost-process-wrap">
            {/* Spinning ring */}
            <div className="ghost-spinner-ring">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(2,61,187,0.08)" strokeWidth="4" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ghostGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="140 80" className="ghost-spinner-arc" />
                <defs>
                  <linearGradient id="ghostGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#023dbb" />
                    <stop offset="100%" stopColor="#4ec8ef" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ghost-spinner-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
              </div>
            </div>

            <div className="ghost-process-label">Analyzing digital presence…</div>

            {/* Progress bar */}
            <div className="ghost-progress-track">
              <div className="ghost-progress-fill" />
            </div>

            {/* Status ticks */}
            <div className="ghost-checklist">
              {data.checklist.map((item, idx) => (
                <div key={idx} className={`ghost-check ghost-check-${idx + 1}`}>
                  <span className="ghost-check-icon">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STAGE 3: Report Ready ── */}
        <div className="ghost-stage ghost-stage-done">
          <div className="ghost-done-card">
            {/* Success badge */}
            <div className="ghost-done-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <div className="ghost-done-title">{data.doneTitle}</div>
            <div className="ghost-done-sub">Your audit has been generated</div>

            {/* Mini stat previews */}
            <div className="ghost-done-stats">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="ghost-done-stat-wrap">
                  {idx > 0 && <div className="ghost-done-stat-divider" />}
                  <div className={`ghost-done-stat ghost-done-stat-${idx + 1}`}>
                    <div className="ghost-done-stat-val">{stat.val}</div>
                    <div className="ghost-done-stat-lbl">{stat.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ghost-done-download">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom CTA ── */}
      <div className="ghost-cta">
        <div className="ghost-cta-text">
          <div className="ghost-cta-title">Your report will appear here</div>
          <div className="ghost-cta-desc">Fill in the form and hit Generate to see live insights</div>
        </div>
      </div>
    </div>
  );
}
