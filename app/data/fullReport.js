// # Full Report marketing content
// Keep this entry separate from the other modules so its longer coverage and
// workflow copy can evolve without changing their page structure. Editorial
// notes, unapproved client figures, and screenshot placeholders stay unpublished.
// Plan prices and allowances come from the same catalog as the Pricing page.
export const FULL_REPORT = {
  slug: "full-report",
  title: "Full Report",
  eyebrow: "Flagship Module",
  seo: {
    url: "https://flawdits.com/full-report",
    metaTitle: "Full Digital Presence Report | Flawdits",
    metaDescription:
      "Combine website health, authority, AI visibility, Instagram, LinkedIn, Google Business Profile and UI/UX findings in one graded, client-ready PDF.",
    primaryKeyword: "complete digital presence report",
  },
  hero: {
    h1: "Get a Complete Digital Presence Report in One Run",
    subtitle:
      "The Full Report is Flawdits’ flagship module: a complete digital presence report that combines your audits into a single, gradeable document. Instead of running separate checks and stitching the findings together by hand, you enter a website and, optionally, an Instagram handle, LinkedIn pages, and a Google Business Profile once, and Flawdits builds the whole picture for you.",
    badge: "One setup, every channel, one export",
    ctaText: "Start My Full Report",
    summary:
      "A Full Report is a graded, client-ready PDF. It shows website health, authority and AI visibility, Instagram performance, Google Business Profile strength and a website UI/UX review in one document, with prioritised recommendations in each section. It is a snapshot of the day it was run, not a monitoring dashboard.",
  },
  // # Opt into the source-to-export schematic instead of the shared audit mockup.
  preview: true,
  contentBlocks: [
    {
      h2: "An All-in-One Digital Audit Report",
      body: "This is the all-in-one digital audit report agencies use when a prospect needs to see the whole picture, not just an isolated SEO score or a single social media snapshot. Website health, Instagram engagement, LinkedIn activity, Google Business Profile completeness, and a website design review all appear side by side in the same export.",
    },
    {
      h2: "SEO, Social Media and Brand Audit in One Report",
      body: "Because it is an SEO, social media and brand audit in one report, the Full Report is designed to answer a single question at a glance: where is this brand strong, and where is it leaking opportunity? Each section carries its own scores and priority recommendations, so a reader can jump straight to the weakest area without digging through raw data.",
    },
    {
      h2: "A Digital Presence Score Report Clients Actually Understand",
      body: "A Full Report opens with the headline numbers: Authority Score, Website Health and AI Visibility Score, so non-technical stakeholders get the result before the detail. Each channel section then follows with its own scores, the evidence behind them and recommendations. It is the same format used in Flawdits’ sample PDF audit report: clear grades first, evidence and recommendations after.",
    },
    {
      h2: "An Executive Summary Built for Agency Client Audit Reports",
      body: "For agencies, this doubles as an agency client audit report ready to attach to a proposal. For in-house teams, it works as an executive summary of a digital audit for leadership: the kind of document that turns “we should look into our online presence” into a prioritised action list.\n\nRead the report through before you share it as your own advice, as you would with any client deliverable.",
    },
  ],
  featureGrid: {
    h2: "What the Full Report Covers",
    subtitle:
      "Every Full Report is assembled from the same sections. Which sections appear depends on the website and profiles you enter and on your plan.",
    items: [
      {
        title: "Website Anatomy & AI Visibility",
        desc: "Authority Score and Authority Health; estimated organic keywords and traffic, with a keyword intent mix; referring domains, total backlinks and the follow/nofollow split; a Website Health score with separate grades for HTTP, SSL, DNS, security headers, metadata and performance; robots.txt, sitemap.xml and llms.txt checks; technical problems ranked as Error, Warning or Notice, each with its impact and a recommended fix; and an AI Visibility Score with AI mentions and cited pages.",
        links: [
          { label: "Website Anatomy in detail", href: "/website-anatomy" },
        ],
      },
      {
        title: "Instagram Performance",
        desc: "Engagement rate measured against 1% and 2% follower benchmarks, posting consistency, a TOFU, MOFU and BOFU content mix compared with a 60/20/20 target, and post-by-post insights from up to 25 recent posts.",
        links: [
          { label: "Instagram Audit in detail", href: "/instagram-audit" },
        ],
      },
      {
        title: "LinkedIn Performance",
        desc: "Company page and personal profile results: posting consistency, engagement and content funnel mix.",
        links: [
          { label: "LinkedIn Company Page Audit", href: "/linkedin-audit" },
          {
            label: "LinkedIn Personal Profile Audit",
            href: "/linkedin-personal-audit",
          },
        ],
      },
      {
        title: "Google Business Profile",
        desc: "A profile score out of 100 with separate scores for completeness, reviews and ratings, and photos and media; the details detected on the listing; a comparison with local competitors; and a priority fix list.",
        links: [{ label: "GMB Audit in detail", href: "/gmb-audit" }],
      },
      {
        title: "Website UI/UX Review",
        desc: "Overall, visual design, usability, accessibility and performance scores, the detected tech stack, pros and cons, and recommendations grouped as High, Medium and Low priority.",
        links: [{ label: "UI/UX Audit in detail", href: "/ui-ux-audit" }],
      },
      {
        title: "Ads Library",
        desc: "Include an Ads Library review by adding a Google advertiser domain or Meta advertiser in the optional Ads Library section of your Full Report setup.",
      },
    ],
    note: "If a channel is not entered or cannot be found, the report shows a “Missing Asset” note instead of an empty section. These notes point to an opportunity to review. They are not proof of a mistake and not a forecast of lost sales.",
  },
  audienceGrid: {
    h2: "When to Use a Full Report",
    subtitle:
      "One structured deliverable for the moments when you need the whole picture.",
    items: [
      {
        title: "Before the First Sales Call",
        emoji: "🎯",
        body: "Run it on a prospect’s website and profiles before the first call. You arrive with specific, evidenced gaps instead of a generic pitch, and the same PDF can be attached to the proposal.",
      },
      {
        title: "At Client Onboarding",
        emoji: "📋",
        body: "Use it as the baseline deliverable for a new client. You get a structured report without building slides or spreadsheets by hand, so your time goes into the recommendations.",
      },
      {
        title: "For a Leadership Brief",
        emoji: "📊",
        body: "Use the headline numbers and the ranked recommendations to brief leadership on what is working, what is weak, and what to fix first.",
      },
      {
        title: "Before You Hire Anyone",
        emoji: "🔎",
        body: "Check your website, social profiles, and Google listing in one go before you hire anyone, so you know what to ask for.",
      },
    ],
    note: "Not the right tool if you need daily rank tracking, a live client dashboard, or one combined report across many locations. The Full Report is a point-in-time audit, and each Google Business Profile is audited one listing at a time.",
  },
  workflow: {
    h2: "How the Full Report works",
    steps: [
      {
        title: "Choose the Full Report",
        body: "Select it in the audit modules sidebar.",
      },
      {
        title: "Enter What You Have",
        body: "Add the website (required). Optionally add an Instagram username, a LinkedIn company page, a LinkedIn personal profile, and a Google Business Profile (business name, Google Maps URL and location). Optional details such as target audience and hashtags sharpen the analysis.",
      },
      {
        title: "Generate",
        body: "Flawdits scans the sources, scores each area and builds the report. A Full Report takes longer than a single-module report because it covers more sources.",
      },
      {
        title: "Review and Download",
        body: "Read the grades first, then the evidence and recommendations. Download the PDF. After fixes, run it again to see updated results.",
      },
    ],
  },
  ctaBand: {
    headline: "See Every Channel Graded in a Single Document",
    subtitle:
      "One setup, every channel, one export. Get clear grades, evidence and prioritised recommendations in a client-ready PDF.",
    btnText: "Start My Full Report",
  },
  faqs: [
    {
      q: "How can I get one report that scores my entire online presence?",
      a: "Run the Full Report. It combines Website Anatomy, Google Business Profile, Instagram and LinkedIn results, plus a website UI/UX review, into one PDF with scores for each area.",
    },
    {
      q: "What does a complete digital presence report include?",
      a: "Authority Score, Website Health and AI Visibility Score; technical issues ranked by severity; backlink and keyword summaries; Instagram and LinkedIn engagement and content mix; a Google Business Profile score with a local competitor comparison; and website UI/UX scores, all in one PDF.",
    },
    {
      q: "Is there a tool that grades my website health and social media together?",
      a: "Yes. The Full Report puts both in the same document, with a separate score for each area, so you can see which one is weakest without comparing separate tools.",
    },
    {
      q: "What is a digital presence score and how is it calculated?",
      a: "A digital presence score is a way to summarise several areas of your online presence in one view. In a Full Report the headline numbers are shown separately (Authority Score, Website Health and AI Visibility Score), followed by scores for each channel. Use the section scores to see what sits behind a number, because one number can hide an urgent problem.",
    },
    {
      q: "Who should use the Full Report instead of a single audit?",
      a: "Use the Full Report when you need the whole picture, such as a pitch, a client onboarding baseline or a leadership summary. Use a single module when you only need one channel.",
    },
    {
      q: "What is not included in a Full Report?",
      a: "It does not track rankings over time, does not monitor changes between runs, and audits one Google Business Profile listing at a time. Channels you do not enter appear as Missing Asset notes.",
    },
    {
      q: "Can I put my agency’s logo on the report?",
      a: "White-label branding, with your logo and colours in place of Flawdits’, is available on the Agency (Custom) plan. See For Agencies and Pricing.",
      links: [
        { label: "For Agencies", href: "/for-agencies" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      q: "Is the Full Report a one-time snapshot?",
      a: "Yes. It reflects the day it was run. Run it again after you fix issues. For AI visibility, a monthly or quarterly re-run gives the clearest trend.",
    },
    {
      q: "How long does a Full Report take?",
      a: "A Full Report takes longer than a single-module report because it covers more sources. The time depends on how many channels you include.",
    },
  ],
};
