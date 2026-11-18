// # AI Visibility manuscript, second half
// Preserve all public wording, including the anonymised figures and punctuation.
// Editorial references and the unverified method placeholder stay in comments.
// D-04: Each method row must come from the product team. Do not publish a row
// you cannot verify. No engine list, prompt set, or scoring formula was supplied.
export const AI_VISIBILITY_DETAILS = {
  reportItems: {
    h2: "What the audit reports today",
    columns: ["Report item", "What it shows", "Where you see it"],
    rows: [
      [
        "AI Visibility Score",
        "A 0 to 100 rating with a plain-word label such as Low or Very Low",
        "Website Anatomy section and Full Report headline numbers",
      ],
      [
        "AI Mentions",
        "How many AI answers named the brand in the checks made",
        "Authority and visibility overview",
      ],
      [
        "Cited Pages",
        "How many of the site’s pages AI answers pointed to as sources",
        "Authority and visibility overview",
      ],
      [
        "llms.txt",
        "Found or Not Found",
        "Technical overview and AI search notes",
      ],
      [
        "robots.txt and sitemap.xml",
        "Found or Not Found",
        "Technical overview",
      ],
      [
        "Authority Score, organic keywords, organic traffic",
        "The traditional SEO view, shown beside the AI figures",
        "Authority and visibility overview",
      ],
    ],
  },
  // # D-10: The manuscript identifies these as real reports with names removed.
  // Render these exact examples without inferring why the two scores differ.
  examples: {
    h2: "Real AI visibility results Example",
    introduction: "These results come from two real Flawdits reports.",
    note: "Note: Business names have been removed due to confidentiality .",
    columns: [
      "",
      "Dental radiology clinic (India)",
      "CNC machining supplier (Australia)",
    ],
    rows: [
      ["AI Visibility Score", "33 (Low)", "14 (Very Low)"],
      ["AI mentions", "2", "9"],
      ["Cited pages", "2", "46"],
      ["llms.txt", "Not found", "Found"],
      ["Authority Score", "7 (Very Low)", "7 (Very Low)"],
      ["Organic keywords/traffic estimate", "11 / 9", "226 / 44"],
    ],
    conclusion:
      "What the reports said: the clinic’s report listed the missing llms.txt as a missed AI-readiness signal. The supplier’s report described the brand as weakly represented in AI-search discovery, and both reports recommended broader keyword coverage and stronger authority.",
  },
  interpretation: {
    h2: "How to read your result",
    items: [
      {
        lead: "A mention is not a citation, and neither is a ranking.",
        body: "A mention is your name appearing in an answer. A citation is one of your pages credited as a source. A ranking is your position in a regular results list. They are related but not interchangeable.",
      },
      {
        lead: "A low score is not a penalty.",
        body: "It means AI tools rarely brought up the brand in the checks made. It shows that clearer, more helpful information about the business online could help AI tools find and understand it.",
      },
      {
        lead: "Few cited pages do not mean poor pages.",
        body: "It only shows how often your pages were used as sources in that check.",
      },
      {
        lead: "Do not add the AI score to the SEO score.",
        body: "They use different checks and are shown side by side on purpose.",
      },
      {
        lead: "llms.txt is a helpful extra, not a guarantee.",
        body: "Not found means the scan did not find that optional file. It does not prove AI tools cannot see your website.",
      },
      {
        lead: "Re-run on a rhythm.",
        body: "AI answers shift over time, so a monthly or quarterly re-run shows the trend better than a single check.",
      },
    ],
  },
  audience: {
    h2: "Who uses the AI Visibility Audit?",
    items: [
      {
        h3: "SEO agencies adding AI search to their services",
        body: "Use the result as a baseline for a prospect, then re-run it on a schedule with clear expectations about what it can and cannot show. To present it alongside the website, Instagram, and Google Business Profile results, run the Full Report.",
      },
      {
        h3: "GEO and AEO consultants",
        body: "Use the score, mentions, and cited pages as a repeatable starting measure. Keep the same inputs between runs so the trend is meaningful.",
      },
      {
        h3: "Brand marketers",
        body: "See whether AI tools name your brand at all, and which of your pages they trust enough to cite.",
      },
      {
        h3: "Small businesses",
        body: "Find out in plain language whether AI tools know your business exists, and what basic readiness checks your site passes.",
      },
    ],
  },
  ctaBand: {
    headline: "Know if ChatGPT even knows your brand exists",
    subtitle: "Find your AI Visibility Score",
    // # D-03 remains unresolved: no standalone AI audit exists in this frontend.
    // Original CTA: Run My AI Visibility Audit →
    // Use the manuscript's explicit fallback until that flow is verified live.
    btnText: "Run a Full Report (includes AI visibility)",
    href: "/full-report",
  },
  faqTitle: "Frequently asked questions",
  faqs: [
    // # D-03 editorial marker excluded; the supplied public answer is unchanged.
    {
      q: "How do I check if my brand shows up in ChatGPT or AI search results?",
      a: "Run the AI Visibility Audit. It returns an AI Visibility Score, a count of AI mentions, and a count of cited pages for your domain. The same results appear in the Website Anatomy section of the Full Report.",
    },
    // # D-04: The referenced method section awaits a verified product statement.
    {
      q: "What is an AI visibility score and how is it measured?",
      a: "It is a rating from 0 to 100 showing how often and how clearly your brand is mentioned or cited across AI search and chat tools. It is a snapshot of the day it was checked. The method section above explains how it is calculated.",
    },
    {
      q: "Is there a tool to audit AI search readiness like llms.txt?",
      a: "Yes. Flawdits checks whether llms.txt, robots.txt, and sitemap.xml are found. llms.txt is an optional guide file for AI tools, so a result of not found is one readiness check, not a verdict.",
    },
    {
      q: "How is AI search visibility different from normal SEO rankings?",
      a: "A site can have regular search visibility, yet few AI mentions, because the two use different checks. In one real report, a site with 226 organic keywords had an AI Visibility Score of 14. The audit shows the two side by side, and they should not be added together.",
    },
    {
      q: "What tool tracks brand mentions across AI-powered search engines?",
      a: "The AI Visibility Audit reports how many times AI answers mentioned your brand and how many of your pages they cited in the checks it makes. See the method section for the tools and questions checked.",
    },
    {
      q: "What is the difference between a mention and a citation?",
      a: "A mention is your brand name appearing in an AI answer. A citation is one of your web pages being credited as a source.",
    },
    {
      q: "Does a low score mean my site has been penalised?",
      a: "No. A low score means AI tools rarely brought up your brand in the checks made. It is not a penalty.",
    },
    {
      q: "Does showing up in AI answers guarantee customers?",
      a: "No. Being mentioned can raise awareness, but it does not promise visits, leads or sales.",
    },
    {
      q: "How often should I re-run the audit?",
      a: "Monthly or quarterly. AI answers shift over time, so a regular re-run shows the trend more clearly than one result.",
    },
    {
      q: "Can I improve my AI Visibility Score?",
      a: "Making clear, helpful information about your business easy to find and understand is the recommended direction, and it also helps regular search and human readers. No audit can promise that AI tools will name you.",
    },
  ],
  // # Preserve the supplied eleventh question and its unfinished answer for the
  // editor. Do not render the product-team instruction as a public FAQ answer.
  pendingMethodFaq: {
    q: "Which AI tools and questions does the audit use?",
    a: "[Product team: paste the method statement from the table above.] D-04.",
  },
};
