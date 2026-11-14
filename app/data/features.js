import { FULL_REPORT } from './fullReport';
import { INSTAGRAM_AUDIT } from './instagramAudit';
import { AI_VISIBILITY_DETAILS } from './aiVisibilityDetails';
import { GMB_AUDIT_CONTENT } from './gmbAudit';
import { WEBSITE_ANATOMY_CONTENT } from './websiteAnatomy';

export const FEATURES = {
  // # Longer Full Report copy lives separately; every module uses the same template.
  'full-report': FULL_REPORT,

  'website-anatomy': {
    slug: 'website-anatomy',
    title: 'Website Anatomy',
    eyebrow: 'SEO & Technical Audit',
    seo: {
      url: 'https://flawdits.com/website-anatomy',
      metaTitle: 'Website Anatomy: SEO & Technical Health Audit Tool | Flawdits',
      metaDescription: 'Run a website audit covering authority, technical health grades, backlinks, organic keywords, traffic estimates and AI visibility in one client-ready report.',
      primaryKeyword: 'website SEO audit tool',
    },
    // # Supplied coverage and definitions stay together for editorial review.
    ...WEBSITE_ANATOMY_CONTENT,
  },

  'gmb-audit': {
    slug: 'gmb-audit',
    title: 'GMB Audit',
    eyebrow: 'Local SEO & Google Business',
    seo: {
      url: 'https://flawdits.com/gmb-audit',
      metaTitle: 'GMB Audit Tool: Google Business Profile & Local SEO Check | Flawdits',
      metaDescription: 'Audit any Google Business Profile listing for completeness, reviews, local search visibility and competitor benchmarks in one report.',
      primaryKeyword: 'Google Business Profile audit tool',
    },
    // # Revised manuscript preserves the headings and limits claims to documented outputs.
    ...GMB_AUDIT_CONTENT,
  },

  // # Instagram's manuscript is separate to keep long-form copy intact.
  'instagram-audit': INSTAGRAM_AUDIT,

  'linkedin-audit': {
    slug: 'linkedin-audit',
    title: 'LinkedIn Audit',
    eyebrow: 'B2B Brand & Content Strategy',
    seo: {
      url: 'https://flawdits.com/linkedin-audit',
      metaTitle: 'LinkedIn Company Page Audit Tool: Content Strategy Review | Flawdits',
      metaDescription: 'Audit LinkedIn company pages for posting consistency, engagement, media mix and TOFU/MOFU/BOFU content balance in a client-ready report.',
      primaryKeyword: 'LinkedIn company page audit tool',
    },
    hero: {
      h1: 'LinkedIn Audit Tool: Company Page & Content Strategy Review',
      subtitle: 'The LinkedIn company page audit tool inside Flawdits reviews how a B2B brand actually performs on LinkedIn — posting cadence, engagement, media format mix, and how balanced the content funnel is across awareness, consideration and proof.',
      badge: "Benchmark your company page's real performance",
      ctaText: 'Run a LinkedIn Audit →',
    },
    contentBlocks: [
      {
        h2: 'A LinkedIn Audit Tool for Agencies Managing B2B Clients',
        body: "As a LinkedIn audit tool for agencies, the module works even when follower data isn't available — engagement can still be assessed from reactions, comments and reposts, so an account audit isn't blocked by incomplete public data."
      },
      {
        h2: 'LinkedIn Content Strategy Audit With Format Breakdown',
        body: 'The LinkedIn content strategy audit breaks posts down by format — image, video, carousel/document — and flags when a page is under-using carousels and documents, a format that typically performs well for B2B education content.'
      },
      {
        h2: 'A LinkedIn Company Engagement Audit Report Built on Real Consistency Data',
        body: "The LinkedIn engagement audit report tracks posting gap in days and posts-per-week, and calls out when there's no consistent cadence at all, a common finding for company pages that post in bursts rather than on a schedule."
      }
    ],
    featureGrid: {
      h2: 'What the LinkedIn Company Audit Covers',
      items: [
        { title: 'Posting Consistency Checker', desc: 'Average gap and posts-per-week.' },
        { title: 'Thought Leadership Audit', desc: 'Proof-led vs. promotional content ratio.' },
        { title: 'B2B Content Funnel Analysis', desc: 'TOFU/MOFU/BOFU post classification.' },
        { title: 'Company Page Performance', desc: 'Reactions, comments, reposts.' },
        { title: 'Brand Audit', desc: 'Brand consistency check.' },
        { title: 'Media Format Mix Audit', desc: 'Image vs. video vs. carousel/document usage.' }
      ]
    },
    ctaBand: {
      headline: "See where your company page's content strategy is falling short",
      btnText: 'Audit My LinkedIn Page →'
    },
    faqs: [
      {
        q: "What tool audits a LinkedIn company page's content and engagement?",
        a: "Flawdits' LinkedIn Audit reviews posting consistency, engagement, media mix and content funnel balance for any company page."
      },
      {
        q: 'How do I check if a brand posts consistently enough on LinkedIn?',
        a: 'The audit reports the average gap between posts and recommends a 3-4 day cadence, roughly two posts per week minimum.'
      },
      {
        q: 'Is there a way to see the TOFU/MOFU/BOFU mix of LinkedIn posts?',
        a: 'Yes — every post is classified into the funnel stage automatically, with a target BOFU/proof-content share flagged if it\'s too low.'
      },
      {
        q: "What's a good tool to benchmark LinkedIn engagement before pitching a client?",
        a: 'Run the LinkedIn Audit for an exportable report on posting volume, engagement and content mix, ready to attach to a pitch.'
      },
      {
        q: 'How can I audit LinkedIn posts for thought leadership and proof content?',
        a: 'The audit specifically flags a low share of proof-led posts — client results, testimonials, case studies — as an area to improve.'
      }
    ]
  },

  'visual-brand-match': {
    slug: 'visual-brand-match',
    title: 'Visual Brand Match',
    eyebrow: 'Cross-Platform Brand Alignment',
    seo: {
      url: 'https://flawdits.com/visual-brand-match',
      metaTitle: 'Visual Brand Match: Brand Consistency Audit Tool | Flawdits',
      metaDescription: 'Compare website and Instagram visuals against your brand\'s colors and identity to score consistency and flag misalignment.',
      primaryKeyword: 'visual brand consistency audit tool',
    },
    hero: {
      h1: 'Visual Brand Match: The Visual Brand Consistency Audit Tool',
      subtitle: "Visual Brand Match is Flawdits' visual brand consistency audit tool — it compares a website screenshot against an Instagram moodboard, brand colors and a stated brand 'vibe,' then scores how aligned they actually are.",
      badge: 'See if your brand looks the same everywhere',
      ctaText: 'Run a Brand Match Audit →',
    },
    roadmapNotice: 'Visual Brand Match is currently in roadmap preview. Five core audit surfaces (Website, SEO, Instagram, LinkedIn, GMB) are currently live in client use.',
    contentBlocks: [
      {
        h2: 'A Brand Identity Audit Tool That Compares, Not Just Lists',
        body: "Rather than just listing a brand's stated colors, this brand identity audit tool compares them against what's actually live on the website and Instagram — catching the gap between a brand guide on paper and the brand experience a customer sees."
      },
      {
        h2: 'Website vs. Social Media Brand Match Checker',
        body: "As a website vs. social media brand match checker, the module flags mismatches most brand audits miss entirely: an Instagram feed that's drifted warmer or cooler than the website, or a 'vibe' description that no longer matches either channel."
      },
      {
        h2: 'A Color Palette and Typography Audit for Cross-Channel Consistency',
        body: 'The color palette and typography audit checks whether core brand colors, fonts and creative direction carry through consistently across every touchpoint a customer sees — website, Instagram, and any moodboard or brand reference uploaded.'
      }
    ],
    featureGrid: {
      h2: 'What Visual Brand Match Covers',
      items: [
        { title: 'Cross-Platform Checker', desc: 'Website vs. Instagram alignment scoring.' },
        { title: 'Brand Consistency Score', desc: 'Single, easy-to-communicate output metric.' },
        { title: 'Mood Board Comparison', desc: 'Upload references and compare to live assets.' },
        { title: 'Visual Identity Report', desc: 'Color, typography and creative direction.' },
        { title: 'Agency Design Audit', desc: 'Proof point for rebrand or refresh pitches.' }
      ]
    },
    ctaBand: {
      headline: 'Catch brand drift before your customers do',
      btnText: 'Check My Brand Consistency →'
    },
    faqs: [
      {
        q: "How do I check if my website and Instagram match my brand's colors and style?",
        a: 'Upload a website screenshot and Instagram moodboard to Visual Brand Match, along with your brand name and core colors — it scores the alignment automatically.'
      },
      {
        q: 'What tool audits visual brand consistency across platforms?',
        a: 'Visual Brand Match compares your website and social visuals against your stated brand identity for a single consistency score.'
      },
      {
        q: 'Is there a way to compare a moodboard against my live website design?',
        a: 'Yes — the module accepts an Instagram moodboard or reference image and compares it directly to your live website\'s visual identity.'
      },
      {
        q: 'How can an agency prove brand inconsistency to a prospective client?',
        a: 'Run a Visual Brand Match audit and use the consistency score and flagged mismatches as concrete, visual proof in a pitch deck.'
      },
      {
        q: "What's the best tool to score a brand's visual identity alignment?",
        a: "Flawdits' Visual Brand Match is purpose-built for this — most SEO or social tools don't score visual brand consistency at all."
      }
    ]
  },

  'ai-visibility-audit': {
    slug: 'ai-visibility-audit',
    title: 'AI Visibility Audit',
    eyebrow: 'AI Search & GEO Intelligence',
    seo: {
      url: 'https://flawdits.com/ai-visibility-audit',
      metaTitle: 'AI Visibility Audit Tool: Brand Presence in AI Search | Flawdits',
      metaDescription: 'Check your AI Visibility Score, AI mentions and llms.txt readiness to see how discoverable your brand is in ChatGPT and AI-powered search.',
      primaryKeyword: 'AI visibility audit tool',
    },
    hero: {
      h1: 'AI Visibility Audit Tool: How Discoverable Is Your Brand in AI Search?',
      subtitle: 'Search didn’t stop at Google. Flawdits’ AI visibility audit tool shows how often AI-powered search and chat tools mention a brand and which of its pages they use as sources, alongside the traditional SEO scores in the same report.',
      badge: 'Find your AI Visibility Score',
      ctaText: 'Check My AI Visibility →',
      summaryTitle: 'What is an AI visibility audit?',
      summary: 'An AI visibility audit checks whether a business appears in AI-generated answers and which of its web pages those answers cite. Flawdits reports an AI Visibility Score, a count of AI mentions and a count of cited pages, and shows them next to authority and traffic figures so you can see where AI results and regular search results differ. Each result is a snapshot of the day it was checked.',
    },
    // # Build-status warning is an editor note, as requested in the supplied structure.
    // AI Search Visibility is a newly introduced module in active rollout alongside traditional SEO & social scanning.
    // D-04: engines and prompts are not documented in the supplied sources.
    // The method statement still awaits verified product-team information.
    aiPreview: {
      caption: '[Product screenshot placeholder] Single-purpose domain field on the left, results panel on the right, following the Website Anatomy layout. Replace with a real capture of the AI visibility results.',
    },
    contentBlocks: [
      {
        h2: 'An AI Search Visibility Checker With a Single Score',
        body: 'As an AI search visibility checker, the audit returns one clear number, an AI Visibility Score from 0 to 100, alongside the AI mention count and the cited-page count. Together, they immediately show whether a brand appears in AI-generated answers at all.'
      },
      {
        h2: 'Tracking Brand Mentions in ChatGPT and AI Search',
        body: 'The audit counts the times AI answers name your brand and the pages of your site they point to. ChatGPT is the example named across Flawdits documentation; the method section below lists the tools and questions checked. The result separates zero visibility, which is common for smaller, local, or newer brands, from a meaningful presence backed by cited source pages.'
      },
      {
        h2: 'A Generative Engine Optimization Audit Beyond Traditional SEO',
        body: 'Generative engine optimization (GEO) means making information about your business clear and helpful so AI tools can understand it and may use it in answers. This audit goes beyond a standard SEO report: it checks whether llms.txt, robots.txt, and sitemap.xml are found, and sets your AI visibility next to your authority and traffic figures to show where the two diverge. It does not guarantee that you will be named.'
      }
    ],
    featureGrid: {
      h2: 'What the AI Visibility Audit Covers',
      items: [
        { title: 'Mentions and Citations Tracker', desc: 'how many AI mentions and cited pages were found.' },
        { title: 'AI Visibility Score', desc: 'a 0 to 100 rating of how often and how clearly the brand is mentioned or cited. Some reports label it AI Discoverability Score (D-05).' },
        { title: 'llms.txt and AI Readiness', desc: 'whether llms.txt, robots.txt and sitemap.xml are found.' },
        { title: 'AI vs. Traditional SEO', desc: 'your AI visibility next to your authority and traffic figures.' },
        { title: 'Client-Ready Report', desc: 'exportable findings for client delivery.' }
      ]
    },
    // # Shared second-half manuscript adds tables, interpretation, audiences and FAQs.
    ...AI_VISIBILITY_DETAILS,
  },
  'linkedin-personal-audit': {
    slug: 'linkedin-personal-audit',
    title: 'LinkedIn Personal Audit',
    eyebrow: 'Personal Profile & Content Strategy Review',
    seo: {
      url: 'https://flawdits.com/linkedin-personal-audit',
      metaTitle: 'LinkedIn Personal Audit Tool | Flawdits',
      metaDescription: 'Benchmark a founder\'s or executive\'s real LinkedIn performance.',
      primaryKeyword: 'LinkedIn personal audit',
    },
    hero: {
      h1: 'LinkedIn Personal Audit: Personal Profile & Content Strategy Review',
      subtitle: "The LinkedIn Personal Audit inside Flawdits reviews how an individual's LinkedIn presence actually performs: posting cadence, engagement, format mix, and how balanced the content funnel is across awareness, consideration, and proof. Point it at a personal profile URL or a company page, and it works either way.",
      badge: "Benchmark a founder's or executive's real LinkedIn performance",
      ctaText: 'Run a LinkedIn Personal Audit →',
    },
    contentBlocks: [
      {
        h2: 'A Personal Brand Audit Tool for Founders and Executives',
        body: "As a personal brand audit tool, the module reviews the same posting-consistency and engagement signals as the company page audit, but scoped to one person's activity, useful for founder-led marketing, executive thought leadership, and personal-brand consulting engagements."
      },
      {
        h2: 'A Content Strategy Audit Built for Individual Profiles',
        body: "The URL field also accepts a company page for one-off checks, but the analysis is tuned for an individual's posting behavior — this is the dedicated module for a founder's or executive's personal activity. For a company page's own breakdown, run the separate LinkedIn Company Page Audit instead."
      },
      {
        h2: 'A LinkedIn Engagement Audit Built on Real Posting Data',
        body: "Choose how many recent posts to analyze and the time range to look back over, and the audit reports posting gap, posts-per-week, and the TOFU/MOFU/BOFU split of what's actually being published."
      }
    ],
    featureGrid: {
      h2: 'What the LinkedIn Personal Audit Covers',
      items: [
        { title: 'Posting Consistency Checker', desc: 'Average gap and posts-per-week for the profile.' },
        { title: 'Personal Content Funnel Analysis', desc: 'TOFU/MOFU/BOFU post classification.' },
        { title: 'Engagement Breakdown', desc: 'Reactions, comments, and reposts per post.' },
        { title: 'Content Intelligence', desc: 'Format mix and topic patterns across analyzed posts.' },
        { title: 'Adjustable Scope', desc: 'Configurable posts-to-analyze count and time range.' }
      ]
    },
    ctaBand: {
      headline: "See how a founder's or executive's LinkedIn activity actually breaks down",
      btnText: 'Audit My LinkedIn Profile →'
    },
    faqs: [
      {
        q: "What's the difference between LinkedIn Company Page Audit and LinkedIn Personal Audit?",
        a: "LinkedIn Company Page Audit reviews a company page. LinkedIn Personal Audit reviews an individual's personal profile, with the same posting-consistency, engagement, and funnel-mix analysis, scoped to one person."
      },
      {
        q: "Can I use the Personal Audit on a company page instead?",
        a: "The field also accepts a company page URL for a quick check, but the analysis is built around individual posting behavior. For a full company page breakdown, use the separate LinkedIn Company Page Audit."
      },
      {
        q: "How many posts does the audit look at?",
        a: "You set the number of posts to analyze and the time range (for example, the last 3 months) before generating the report, so the audit matches how active the profile actually is."
      },
      {
        q: "Who is the LinkedIn Personal Audit built for?",
        a: "Founders and executives building a personal brand, LinkedIn ghostwriters, personal-branding consultants, and agencies running founder-led marketing on behalf of clients."
      }
    ]
  },
  'what-is-flawdits': {
    slug: 'what-is-flawdits',
    title: 'What Is Flawdits?',
    eyebrow: 'Digital Presence Audit Platform',
    seo: {
      url: 'https://flawdits.com/what-is-flawdits',
      metaTitle: 'What Is Flawdits? | Digital Presence Audit Platform',
      metaDescription: 'Flawdits is a digital presence audit platform that combines website, Google Business Profile, Instagram, LinkedIn, visual brand consistency, and AI search visibility.',
      primaryKeyword: 'what is flawdits',
    },
    hero: {
      h1: 'What Is Flawdits?',
      subtitle: "Flawdits is a digital presence audit platform that combines multiple audit areas- website, Google Business Profile, Instagram, LinkedIn, visual brand consistency, and AI search visibility- into a single, structured, client-ready report.\n\nInstead of checking each channel separately and manually pulling the findings together, you point Flawdits at a website, a social handle, or a Google Business Profile, and it returns a graded report covering the areas that matter.",
      badge: "Digital Presence Audit Platform",
      ctaText: 'View a Sample Report →',
    },
    contentBlocks: [
      {
        h2: 'The Problem Flawdits Solves',
        body: "Understanding a brand's full digital presence usually means checking a website audit tool, a Google Business Profile dashboard, Instagram post analysis, LinkedIn analysis, and a brand style guide separately, then manually pulling the findings into a spreadsheet or document before anyone can act on them.\n\nFlawdits replaces that manual process with one platform: one login, one export, one professional deliverable, instead of five different tools and a spreadsheet."
      },
      {
        h2: 'What Flawdits Actually Does',
        body: "Flawdits runs a structured audit across the areas of a brand's presence it currently covers, and returns a graded, evidence-backed report for each one. The seven current audit modules are:\n\n• Website Anatomy: Technical SEO, Core Web Vitals, and backlink health.\n• GMB Audit: Google Business Profile completeness and local visibility.\n• Instagram Audit: Engagement, posting consistency, and content funnel.\n• LinkedIn Audit: Company page performance and thought leadership.\n• LinkedIn Personal Audit: Personal profile posts, engagement, and TOFU/MOFU/BOFU funnel mix.\n• Visual Brand Match: Cross-platform brand consistency scoring.\n• AI Visibility Audit: Brand discoverability in ChatGPT and AI search.\n\nRun any module individually, or run the Full Report to combine all six into one document."
      },
      {
        h2: 'How the Audit Workflow Works',
        body: "The workflow is the same three steps regardless of which module you run:\n\n1. Choose your audit module (Full Report for everything at once, or an individual module)\n2. Enter the relevant website or social handle\n3. Hit: Generate\n\nFlawdits scans, scores, and formats the results into a downloadable report, client-ready, with grades up front and evidence underneath. Behind that workflow, the Flawdits team ships continuously through its own CI/CD pipeline, so the underlying checks keep getting refined."
      },
      {
        h2: 'What Kinds of Presence Flawdits Helps Analyze',
        body: "Across its current modules, Flawdits helps analyze: a website's technical SEO health, a Google Business Profile's completeness and local visibility, Instagram engagement and content mix, LinkedIn company page performance, a person's LinkedIn presence, cross-platform visual brand consistency, and a brand's discoverability in AI-powered search."
      },
      {
        h2: 'Who Flawdits Is Built For',
        body: "Flawdits is built for agencies auditing prospects and clients, freelance consultants who need a client-ready deliverable without building one from scratch, and business owners who want a structured picture of their own digital presence before hiring anyone."
      },
      {
        h2: 'What You Get From the Analysis',
        body: "Each audit returns graded scores (for example, a website health grade or an AI visibility score), specific findings ranked by severity or priority, and a downloadable PDF report. Reports can carry Flawdits' own branding or, on the Agency plan, your own logo and colors."
      },
      {
        h2: 'Why a Structured Audit Report Is Useful',
        body: "A general AI assistant can answer questions if you ask it to, but it doesn't know what a healthy engagement rate or a complete Google Business Profile looks like for your specific situation unless it's told, and it has no built-in access to Instagram, LinkedIn, or Google Business Profile data. Flawdits runs the same structured audit framework across those surfaces every time, so the result is a directed, comparable report rather than a one-off answer to a single question."
      }
    ],
    ctaBand: {
      headline: 'See what a Flawdits report actually looks like.',
      btnText: 'View a Sample Report →'
    },
    faqs: [
      {
        q: "What is Flawdits in one sentence?",
        a: "Flawdits is a digital presence audit platform that turns website, local, social, brand, and AI-visibility data into one structured, client-ready report."
      },
      {
        q: "What does “audit” mean in Flawdits' context?",
        a: "It means running a structured, repeatable check against a defined set of criteria, for example, technical SEO health or Google Business Profile completeness, and returning a graded, evidenced result."
      },
      {
        q: "Do I need technical knowledge to use it?",
        a: "No. You enter a website or social handle, and Flawdits generates the report; the grades and priority findings are written to be understood by a non-technical reader."
      },
      {
        q: "What do I actually receive after running an audit?",
        a: "A downloadable, graded PDF report for the module (or modules) you ran, with specific findings and, where applicable, priority recommendations."
      },
      {
        q: "Is Flawdits actively maintained?",
        a: "Yes, the internal team ships updates through a CI/CD pipeline on an ongoing basis, so the tool is constantly being improved rather than updated only at occasional milestones."
      }
    ]
  },
  'why-flawdits': {
    slug: 'why-flawdits',
    title: 'Why Flawdits?',
    eyebrow: 'Time & Consistency',
    seo: {
      url: 'https://flawdits.com/why-flawdits',
      metaTitle: 'Why Flawdits? | Benefits and Use Cases',
      metaDescription: 'Instead of manually collecting information from separate platforms, you run one structured audit and get a comparable, client-ready result every time.',
      primaryKeyword: 'why flawdits',
    },
    hero: {
      h1: 'Why Flawdits?',
      subtitle: "The practical reason to use Flawdits is time and consistency: instead of manually collecting information from separate platforms, maintaining a spreadsheet, or paying for several single-purpose tools, you run one structured audit and get a comparable, client-ready result every time.",
      badge: "Stop manually auditing",
      ctaText: 'Try a Free Audit →',
    },
    contentBlocks: [
      {
        h2: 'Why Not Manually Audit Everything?',
        body: "Manually auditing a brand's presence means logging into a website analyzer, a Google Business Profile dashboard, Instagram insights, and LinkedIn analytics separately, then reconciling the findings by hand, often in a spreadsheet that's out of date by the next review. Flawdits runs the same structured checks across those areas in one pass and returns one document instead of several disconnected ones."
      },
      {
        h2: 'Why Use One Structured Audit Platform?',
        body: "A single platform means a consistent scoring approach across every module, one place to re-run the same audit later to check progress, and one export instead of reconciling formats from several different tools. Because the Flawdits team ships continuously through its own CI/CD pipeline, that scoring approach keeps getting refined rather than sitting static between releases."
      },
      {
        h2: 'Why a Professional Audit Report Is Useful',
        body: "A graded, evidence-backed report is easier for a client or stakeholder to act on than a raw data dump: it states what's wrong, how severe it is, and what to do about it, in a format that doesn't require the reader to interpret the underlying data themselves."
      },
      {
        h2: 'Why Branded, Client-Ready Analysis Is Useful',
        body: "For agencies and consultants specifically, a report that carries their own branding (available on the Agency plan) reinforces who did the work when it's shared with a client or prospect, rather than presenting as a generic third-party tool output."
      }
    ],
    audienceGrid: {
      h2: 'Who Should Use Flawdits',
      subtitle: 'Flawdits is built for four overlapping groups. Each uses it slightly differently.',
      items: [
        {
          title: 'Solopreneurs',
          emoji: '🚀',
          body: "Solo operators don't have an internal team to check a website, a Google Business Profile, and social accounts separately. Flawdits gives a solopreneur a structured, single-login way to see how their own digital presence is actually performing, without hiring anyone or manually piecing it together."
        },
        {
          title: 'Founders',
          emoji: '💡',
          body: "Founders often need a clear, structured picture of their brand across channels for their own decision-making, or to brief a marketing hire or agency. Flawdits replaces manually gathering that picture from separate sources with one graded report founders can read themselves or hand to whoever they bring in next."
        },
        {
          title: 'Agencies',
          emoji: '🏢',
          body: "Agencies use Flawdits across the client lifecycle: auditing a prospect before a pitch, baselining a new client at onboarding, and re-running the same audit later to show progress. Because reports are white-label on the Agency plan, findings can be turned into professional, branded deliverables identifying gaps and opportunities without building a report template from scratch."
        },
        {
          title: 'Service Providers & Consultants',
          emoji: '🎯',
          body: "This covers independent consultants, marketing service providers, SEO professionals, social media professionals, and brand consultants who analyze clients. Flawdits gives them the same structured audit and client-ready PDF an agency uses, without a design team: the report is genuinely client-ready on the first export, and doubles as evidence in a pitch and as a template for recurring progress updates once a client signs."
        }
      ]
    },
    ctaBand: {
      headline: 'Stop manually auditing',
      btnText: 'Try a Free Audit →'
    },
    faqs: [
      {
        q: "Why use Flawdits instead of checking each platform manually?",
        a: "Flawdits runs the same structured audit across website, local, social, brand, and AI-visibility data in one pass, instead of requiring separate logins and manual reconciliation."
      },
      {
        q: "How can solopreneurs benefit from Flawdits?",
        a: "A solopreneur gets a structured view of their own digital presence without hiring anyone or building a tracking spreadsheet."
      },
      {
        q: "How can founders benefit from Flawdits?",
        a: "Founders get a clear, structured picture of their brand across channels for their own use, or to brief a hire or agency, without manually assembling it first."
      },
      {
        q: "How can agencies benefit from Flawdits?",
        a: "Agencies use Flawdits for prospect analysis, client audits, onboarding baselines, and white-label reporting that identifies gaps and opportunities."
      },
      {
        q: "How can consultants and service providers benefit from Flawdits?",
        a: "Independent consultants and service providers get the same structured audit and client-ready PDF an agency uses, without building a report template themselves."
      }
    ]
  },
  'ui-ux-audit': {
    slug: 'ui-ux-audit',
    title: 'UI/UX Page Audit',
    eyebrow: 'Page Experience & UI',
    seo: {
      url: 'https://flawdits.com/ui-ux-audit',
      metaTitle: 'UI/UX Page Audit Tool: Design, UX & Core Metrics | Flawdits',
      metaDescription: 'Audit your UI/UX, capture full-page screenshots, check accessibility (Axe-core), and evaluate Core Web Vitals to improve conversion rates.',
      primaryKeyword: 'UI UX audit tool',
    },
    hero: {
      h1: 'UI/UX Page Audit: Design & Experience Review',
      subtitle: 'Identify accessibility roadblocks, evaluate mobile/desktop responsive design, and measure technical UX metrics (Core Web Vitals) in a single plain-English report.',
      badge: "Improve your page's conversion experience",
      ctaText: 'Run a UI/UX Audit →',
    },
    contentBlocks: [
      {
        h2: 'A Visual & Technical UX Checker for Modern Brands',
        body: 'User experience is hard to quantify. Our UI/UX Audit bridges the gap by capturing visual context (desktop, tablet, mobile screenshots) and combining it with raw technical measurements (Core Web Vitals, Axe-core accessibility rules) to provide a plain-English narrative of the user experience.'
      },
      {
        h2: 'Plain English Insights Powered by Expert Analysis',
        body: 'Instead of handing you a JSON dump of Lighthouse scores, our intelligent pipeline translates technical errors ("LCP is 4.2s") into actionable business insights ("Your page takes too long to show main content, causing visitors to bounce").'
      },
      {
        h2: 'Comprehensive Page Capture & Accessibility Audit',
        body: 'Every audit renders the live page, extracts accessibility violations, captures full-length screenshots, and builds a priority action plan. Whether you want to improve conversion rates or prepare for a redesign, the UI/UX audit points you in the exact right direction.'
      }
    ],
    featureGrid: {
      h2: 'What the UI/UX Audit Covers',
      items: [
        { title: 'Responsive Screenshots', desc: 'Full-page captures for mobile, tablet, and desktop.' },
        { title: 'Core Web Vitals', desc: 'LCP, CLS, TBT, and FCP performance scoring.' },
        { title: 'Accessibility Compliance', desc: 'Axe-core violations with actionable fixes.' },
        { title: 'Plain English Narrative', desc: 'Technical metrics translated for business stakeholders.' },
        { title: 'Action Plan', desc: 'Prioritized list of fixes based on severity.' },
        { title: 'PDF Export', desc: 'Ready-to-present, white-labeled client deliverable.' }
      ]
    },
    ctaBand: {
      headline: 'Find out why visitors are leaving your page',
      btnText: 'Audit My UI/UX →'
    },
    faqs: [
      {
        q: "What does the UI/UX Audit actually check?",
        a: "It captures screenshots across devices, measures Core Web Vitals via Lighthouse, scans for accessibility violations via Axe-core, and produces a plain-English UX narrative."
      },
      {
        q: "How does it help improve conversions?",
        a: "By surfacing accessibility roadblocks, confusing visual layouts, and slow loading times, you get a clear prioritized list of what is frustrating your visitors."
      },
      {
        q: "Is it suitable for non-technical stakeholders?",
        a: "Yes. The AI judgment layer translates all technical findings into plain English, explaining what is wrong, why it matters, and how to fix it."
      }
    ]
  }
};
