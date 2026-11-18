// # GMB Audit manuscript
// Keep the supplied public copy intact and editorial bracket instructions out
// of the page. GBP in the document title is editorial naming; the module is GMB.
// The three existing headings stay in order. Their previous bodies claimed
// estimated visibility lift, market capture and ranking monitoring; D-17 limits
// those descriptions to the profile scores, competitor table and written fixes.
export const GMB_AUDIT_CONTENT = {
  hero: {
    h1: "GMB Audit: The Google Business Profile Audit Tool for Local SEO",
    subtitle:
      "Flawdits’ GMB Audit scores a Google Business Profile out of 100, shows how it compares with local competitors, and lists the fixes to make first, in a client-ready report.",
    badge: "Check your local search standing",
    ctaText: "Audit My GMB Listing →",
    summaryTitle: "What the GMB Audit returns",
    summary:
      "The GMB Audit returns a profile score out of 100 and a letter grade, three sub-scores (completeness, reviews and ratings, photos and media), the business details it detected, a table comparing the listing with local competitors, and a short list of priority recommendations. It is a snapshot of the listing on the day it was run.",
  },
  gmbPreview: {
    caption:
      "[Product screenshot placeholder] The GMB Audit module: business name, Google Maps URL and location fields feeding the score, detected details, and competitor table.",
  },
  contentBlocks: [
    {
      h2: "A GMB Audit Tool for Agencies, Not Just Solo Owners",
      body: "The GMB Audit gives agencies a client-ready report with a profile score, detected business details, a local competitor comparison, and priority recommendations.",
    },
    {
      h2: "A Local SEO Audit Report With Market Context",
      body: "The local competitor table compares rating, review count, and photo count against businesses ranking for the same local search. Green marks competitors you beat, red marks those ahead.",
    },
    {
      h2: "A Google My Business Listing Checker With a Priority List",
      body: "The report includes four written recommendations for the listing, such as completing the business description or adding photos.",
    },
  ],
  featureGrid: {
    h2: "What the GMB Audit Covers",
    items: [
      {
        title: "Profile Score",
        desc: "a score out of 100 with a letter grade.",
      },
      {
        title: "Score Breakdown",
        desc: "completeness, reviews and ratings, and photos and media, each out of 100.",
      },
      {
        title: "Detected Business Details",
        desc: "primary category, phone, website, hours, and description, shown as found or missing.",
      },
      {
        title: "Local Competitor Comparison",
        desc: "rating, review count, and photo count against businesses ranking for the same local search.",
      },
      {
        title: "Priority Fix List",
        desc: "four recommendations written for the listing.",
      },
    ],
  },
  // # D-10: Three real reports, businesses anonymised. Get client consent before
  // publishing. D-18: Photo counts need verification; preserve supplied figures
  // here without treating transcription as independent verification.
  examples: {
    h2: "Real Google Business Profile audits example",
    introduction:
      "These figures come from real Flawdits reports. The businesses are anonymised.",
    columns: [
      "",
      "Dental radiology clinic (India)",
      "Dental imaging centre (India)",
      "Commercial printer (Australia)",
    ],
    rows: [
      ["Profile score/grade", "64/100, B", "32/100, D", "73/100, B"],
      ["Profile Completeness", "80", "40", "60"],
      ["Reviews and Ratings", "100", "52", "64"],
      ["Photos and Media", "0", "0", "100"],
      ["Reviews/star rating", "248 / 4.9", "1 / 5.0", "15 / 4.9"],
      ["Photos", "0", "0", "34"],
      ["Competitor median (photos)", "8", "2", "20"],
      ["Website field", "Set", "Missing", "Set"],
      ["Description", "Missing", "Missing", "Missing"],
      ["Hours set", "Yes", "Yes", "Yes"],
      ["Local competitors compared", "5", "1", "8"],
    ],
    takeawaysTitle: "What these three reports show.",
    takeaways: [
      {
        lead: "A strong reputation with an empty gallery.",
        body: "The clinic had 248 reviews at 4.9 stars, far above its competitors’ median of 20, yet a photo score of 0. The report put adding a photo gallery first.",
      },
      {
        lead: "A thin profile.",
        body: "The imaging centre had one review, no website, and no description. The report’s first recommendation was to add the website link, and its second to write the business description.",
      },
      {
        lead: "A complete gallery, a missing description.",
        body: "The printer’s 34 photos earned a photos score of 100, but with no description and 15 reviews, its overall score stayed at 73. The report recommended a description first.",
      },
      {
        lead: "One gap in all three.",
        body: "None of the three listings had a business description.",
      },
    ],
  },
  audience: {
    h2: "Who uses the GMB Audit",
    items: [
      {
        h3: "Local SEO agencies",
        body: "Run the audit on a prospect’s listing before the first call and show the competitor table. For the website, Instagram, and LinkedIn results in the same document, run the Full Report.",
      },
      // # GMB naming follows the user's instruction to ignore GBP terminology.
      {
        h3: "GMB consultants",
        body: "Use the score and the fix list as a baseline, fix the listing, then re-run the audit to show the change.",
      },
      {
        h3: "Local business owners",
        body: "See in plain language what is missing from your listing and how many reviews and photos nearby competitors have.",
      },
    ],
  },
  ctaBand: {
    headline: "See how your Google listing compares with local competitors",
    subtitle: "",
    btnText: "Audit My GMB Listing →",
  },
  faqTitle: "Frequently asked questions",
  // # Public FAQ text excludes editorial D-19, D-17, D-18 and (new) markers.
  // D-19: Exact score weights are not published. D-17: No impact forecasting.
  // D-18: Photo counts describe what could be read, not guaranteed live totals.
  faqs: [
    {
      q: "What tool audits a Google Business Profile?",
      a: "The GMB Audit scores a listing out of 100, breaks the score into completeness, reviews and ratings, and photos and media, and compares it with local competitors.",
    },
    {
      q: "What does a Google Business Profile score mean?",
      a: "It summarises how complete and active a listing looks. Read the three sub-scores to see which area is holding it back. The exact weights are not published.",
    },
    {
      q: "How do I compare my Google listing with local competitors?",
      a: "The report lists businesses ranking for the same local search with their ratings, review counts, and photo counts, and marks which ones you are ahead of.",
    },
    {
      q: "What should I fix first on a Google Business Profile?",
      a: "The report ends with four priority recommendations written for your listing. In three real reports, the first items were a photo gallery, a website link, and a business description.",
    },
    {
      q: "What does the audit say about the possible impact of fixes?",
      a: "The audit lists what is missing and why it matters. It does not forecast calls, visits, or rankings.",
    },
    {
      q: "What do I need to run a GMB audit?",
      a: "The business name, the Google Maps URL, and the location.",
    },
    {
      q: "Does the audit work for several locations at once?",
      a: "No. Each listing is audited one at a time.",
    },
    {
      q: "Why does my report show 0 photos?",
      a: "The report counts the photos it could read. Check your live profile, and if photos are there, re-run the audit.",
    },
    {
      q: "How often should I re-run it?",
      a: "After you change the listing, so you can compare results.",
    },
  ],
  scoring: {
    h2: "What the audit checks and how it scores",
    inputTitle: "What you enter",
    input:
      "The business name, the Google Maps URL, and the location. In the Full Report, these are the optional Google Business Profile fields.",
    reportTitle: "What the report shows",
    columns: ["Report item", "What it shows"],
    rows: [
      [
        "Profile score and grade",
        "A score out of 100 with a letter grade, for example, 64/100, Grade B.",
      ],
      ["Profile Completeness", "How many core fields are filled, out of 100."],
      [
        "Reviews and Ratings",
        "A score out of 100, shown with the review count and star rating.",
      ],
      [
        "Photos and Media",
        "A score out of 100, shown with the photo count and the competitor median.",
      ],
      [
        "Business Details Detected",
        "Primary category, phone, website, whether hours are set, and whether a description exists.",
      ],
      [
        "Local Competitors",
        "A table of up to eight competing listings for the local search the report names, with rating, reviews and photos. Green marks competitors you beat, red marks those ahead.",
      ],
      [
        "Priority Recommendations",
        "Four written recommendations, such as completing the business description or adding photos.",
      ],
    ],
  },
};
