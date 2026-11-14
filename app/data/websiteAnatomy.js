// # Website Anatomy manuscript
// Public passages retain the supplied wording. Bracketed publishing instructions
// and D-reference identifiers stay in comments. Keep example figures verbatim.
// D-06: Do not imply response time and HTML weight are Core Web Vitals scores.
export const WEBSITE_ANATOMY_CONTENT = {
  hero: {
    h1: "Website Anatomy: The SEO Audit Tool",
    subtitle:
      "Website Anatomy scans a website and returns its authority, health grades, ranked technical problems, backlink profile, organic keyword picture, and AI visibility in one client-ready report.",
    badge: "Grade your site's technical health in minutes",
    ctaText: "Audit My Website →",
    summaryTitle: "What Website Anatomy returns",
    summary:
      "Enter a website and Website Anatomy returns an Authority Score, a Website Health percentage with a grade for each technical area, a ranked list of problems with a recommended fix for each, a backlink summary, an organic keyword and traffic estimate, and an AI Visibility Score. It is a snapshot of the day it was run.",
  },
  websitePreview: {
    caption:
      "[Product screenshot placeholder] The Website Anatomy module: domain field and the results panel with Authority Score, Website Health, and AI Visibility.",
  },
  contentBlocks: [
    {
      h2: "A Website Health Check Tool That Grades, Not Just Lists",
      body: "Most crawlers dump a wall of warnings. Website Anatomy works as a website health check tool that grades HTTP, SSL, DNS, security headers, metadata and performance individually so you know at a glance whether a B-grade site has one fixable gap or ten.",
    },
    {
      // # The previous heading also promised Core Web Vitals in every scan.
      // Correct that claim along with its body; preserve the surrounding H2 order.
      h2: "Website Performance Checks",
      body: "The report shows server response time in milliseconds, page HTML weight in kilobytes, and a performance grade. Response time and HTML size are not a complete Core Web Vitals measurement.",
    },
    {
      h2: "A Technical SEO Audit Report With Specific Fixes",
      body: "Rather than a generic checklist, the technical SEO audit report lists each problem by severity — notice, warning or error — with the exact impact and the recommended fix. Missing a canonical tag or a Content-Security-Policy header shows up as a specific, actionable line item, not a vague score.",
    },
  ],
  featureGrid: {
    h2: "What Website Anatomy Covers",
    items: [
      {
        title: "Authority and Visibility Overview",
        desc: "Authority Score, Authority Health, organic keywords, organic traffic, referring domains and top country.",
      },
      {
        title: "Technical Health Grades",
        desc: "HTTP, SSL, DNS, security headers, metadata and performance grades.",
      },
      {
        title: "Ranked Problems",
        desc: "each issue as Error, Warning or Notice, with impact and fix.",
      },
      {
        title: "Backlink Profile",
        desc: "referring domains, total backlinks, follow and nofollow split.",
      },
      {
        title: "Keyword Intent Mix",
        desc: "a sample of ranking keywords and a keyword opportunity set, split by intent.",
      },
      {
        title: "AI Visibility and AI Search Readiness",
        desc: "AI Visibility Score, mentions, cited pages, llms.txt, robots.txt, sitemap.xml.",
      },
      { title: "Client-Ready Report", desc: "exportable findings." },
    ],
  },
  performance: {
    h2: "Core Web Vitals and performance, explained",
    definition:
      "Core Web Vitals are Google’s measures of how a page feels to use. Largest Contentful Paint (LCP) is how long the main content takes to appear; Google treats 2.5 seconds or less as good. Interaction to Next Paint (INP) is how quickly the page responds to taps and clicks; 200 milliseconds or less is good. Cumulative Layout Shift (CLS) is how much the layout jumps while loading; 0.1 or less is good.",
    reported:
      "Website Anatomy reports a Performance Grade, the server response time and the HTML size, plus performance notes such as the number of inline scripts. In one real report, a 3,255 ms response time and 222 KB of HTML gave a Performance Grade of C (55); in another, a 440 ms response and 25 KB of HTML gave an A (100). These are the signals the scan reports today.",
    // # D-06: Do not state that LCP, INP and CLS are measured until the product
    // owner confirms it. The glossary explanation above is not a scan-output claim.
  },
  authority: {
    h2: "Authority, backlinks and keywords",
    items: [
      {
        lead: "Authority Score",
        body: "summarises link strength. A low score means few trusted links, not a penalty.",
      },
      {
        lead: "Referring domains",
        body: "are the distinct sites linking to you. Total backlinks counts every link. Follow and nofollow show how many links pass authority signals.",
      },
      {
        lead: "Organic keywords and traffic",
        body: "are estimates of what the site ranks for and the visits it may receive. Treat them as direction, not as analytics.",
      },
      {
        lead: "Keyword intent",
        body: "shows whether ranking keywords are brand searches (navigational) or searches by people still comparing options. In both real reports below, most of the ranking sample was navigational, which the report reads as limited non-brand reach.",
      },
    ],
  },
  // # D-10: Real report figures, businesses anonymised. Keep the exact strings;
  // do not round values, combine different measures, or infer a scoring formula.
  examples: {
    h2: "Real Website Anatomy results example",
    columns: [
      "",
      "Dental radiology clinic (India)",
      "Industrial printing supplier (Australia)",
    ],
    rows: [
      ["Authority Score", "7 (Very Low)", "9 (Very Low)"],
      ["Website Health", "84%, Grade B", "75%, Grade B"],
      ["AI Visibility Score", "33 (Low)", "14 (Very Low)"],
      ["Organic keywords/traffic", "11 / 9", "154 / 137"],
      ["Referring domains/backlinks", "300 / 396", "387 / 524"],
      ["Follow / nofollow", "224 / 172", "232 / 292"],
      ["Security Headers", "Grade F (30)", "Grade F (20)"],
      [
        "Performance",
        "Grade A (100); 440 ms; 25 KB",
        "Grade C (55); 3,255 ms; 222 KB",
      ],
      ["llms.txt", "Not found", "Not found"],
      [
        "Ranking sample that is navigational",
        "100% (1 keyword)",
        "85.7% (7 keywords)",
      ],
    ],
    takeawaysTitle: "What these reports show.",
    takeaways: [
      {
        lead: "Good grades beside a weak authority score.",
        body: "Both sites scored a B for health yet a Very Low Authority Score. Technical health and link authority are separate measures.",
      },
      {
        lead: "A security-header gap in both.",
        body: "Both reports ranked a missing strict-transport-security header as an Error and listed further missing headers as Warnings.",
      },
      {
        lead: "A performance problem in one.",
        body: "The printer’s report flagged a 3,255 ms response time as a Warning and recommended server, caching and compression work.",
      },
    ],
    findingLabel: "One finding, as the report states it:",
    finding:
      "Severity: Error. Missing security header strict-transport-security. Impact: weakens browser-level protection and trust signals. Recommendation: review and fix in the technical optimisation backlog.",
  },
  audience: {
    h2: "Who uses Website Anatomy?",
    items: [
      {
        h3: "SEO agencies",
        body: "Run it on a prospect’s domain before a pitch and hand over the ranked problem list. To add Instagram, LinkedIn, Google Business Profile and UI/UX results in one document, run the Full Report.",
      },
      {
        h3: "Web developers and freelancers",
        body: "Use the Error, Warning and Notice rows as a technical backlog with a recommended fix for each.",
      },
      {
        h3: "Owners before a redesign",
        body: "Check what the current site does well and badly before you brief a designer.",
      },
    ],
  },
  ctaBand: {
    headline:
      "See your website’s health, authority and AI visibility in one scan",
    subtitle: "",
    btnText: "Audit My Website →",
  },
  faqTitle: "Frequently asked questions",
  faqs: [
    {
      q: "What tool runs a technical SEO audit on my website?",
      a: "Website Anatomy returns a Website Health score with grades for HTTP, SSL, DNS, security headers, metadata and performance, and a ranked list of problems with fixes.",
    },
    // # D-06: Confirm whether LCP, INP and CLS values are returned before
    // answering this more strongly. Preserve the supplied cautious public answer.
    {
      q: "Does the audit check Core Web Vitals?",
      a: "The scan reports a Performance Grade, server response time and HTML size.",
    },
    {
      q: "How do I check my backlink profile?",
      a: "The report shows referring domains, total backlinks and the follow and nofollow split.",
    },
    {
      q: "What does Authority Score mean?",
      a: "It is a 0 to 100 estimate of link authority from a third-party data provider. It is not a Google score.",
    },
    {
      q: "Can I check whether my site is ready for AI search?",
      a: "Yes. The report shows whether llms.txt, robots.txt and sitemap.xml are found, and an AI Visibility Score with mentions and cited pages.",
    },
    {
      q: "What is a security header, and why does the report flag them?",
      a: "Security headers are instructions a server sends to browsers. The report lists missing ones, such as strict-transport-security, as problems that weaken browser-level protection and trust signals.",
    },
    {
      q: "What is llms.txt?",
      a: "An optional file that guides AI tools to a site’s key content. Not found is a readiness check, not proof AI tools cannot see the site.",
    },
    {
      q: "Why is my health grade good but my authority score low?",
      a: "They measure different things. Health covers technical setup; authority covers links from other sites.",
    },
    {
      q: "Are the keyword and traffic figures from my own analytics?",
      a: "No. They are estimates from a third-party data provider.",
    },
    {
      q: "How often should I re-run the scan?",
      a: "After you fix issues, so you can compare results.",
    },
  ],
  reportItems: {
    h2: "What the scan reports",
    columns: ["Report item", "What it means"],
    rows: [
      // # D-11: Provider-origin definition; preserve the reported bands as given.
      {
        item: "Authority Score",
        meaning:
          "A 0 to 100 estimate of a site’s overall link authority, from a third-party SEO data provider. It is not a Google score. Bands seen: Very Low (7, 9).",
      },
      {
        item: "Authority Health",
        meaning:
          "A separate 0 to 100 rating shown with a label such as Critical. Bands are not published.",
      },
      {
        item: "Website Health",
        meaning:
          "A percentage with a grade, for example 84% Grade B (Good) and 75% Grade B (Good).",
      },
      {
        item: "Technical grades",
        meaning:
          "A grade and score for HTTP, SSL, DNS, Security Headers, Meta and Performance, each A to F.",
      },
      {
        item: "Errors, Warnings, Notices",
        meaning:
          "Problems ranked by severity. Each row lists the category, the problem, its impact and a recommended fix.",
      },
      {
        item: "Response time and HTML size",
        meaning:
          "Server response time in milliseconds and page HTML weight in kilobytes.",
      },
      {
        item: "robots.txt, sitemap.xml, llms.txt",
        meaning: "Found or Not Found.",
      },
      {
        item: "Organic keywords and traffic",
        meaning:
          "Estimated figures from a third-party data provider, not your own analytics.",
      },
      {
        item: "Referring domains, backlinks",
        meaning:
          "How many sites link to the domain and how many links exist, with a follow and nofollow split.",
      },
      {
        item: "Keyword intent",
        meaning:
          "Informational, commercial, transactional, navigational and other, for a ranking sample and for a keyword opportunity set.",
      },
      // # D-04: The AI method remains documented separately when verified.
      {
        item: "AI Visibility Score, mentions, cited pages",
        meaning: "See the AI Visibility Audit page.",
        href: "/ai-visibility-audit",
      },
    ],
  },
};
