// # Instagram editorial copy
// Keep supplied wording and punctuation intact. Layout headings are separate
// from the manuscript paragraphs so future design edits cannot rewrite copy.
// Lines beginning with › are publishing instructions, not public content.
export const INSTAGRAM_AUDIT = {
  slug: "instagram-audit",
  title: "Instagram Audit",
  eyebrow: "Social Media & Funnel Intelligence",
  seo: {
    url: "https://flawdits.com/instagram-audit",
    metaTitle:
      "Instagram Audit Tool: Engagement & Content Funnel Analysis | Flawdits",
    metaDescription:
      "Analyze Instagram engagement rate, posting consistency, audience quality and TOFU/MOFU/BOFU content mix with post-by-post insights.",
    primaryKeyword: "Instagram audit tool",
  },
  hero: {
    h1: "Instagram Audit Tool: Engagement, Funnel & Content Insights",
    subtitle:
      "Flawdits’ Instagram audit tool goes past follower counts and looks at whether the content is actually working: engagement rate, posting consistency, audience quality, and how balanced the content mix is across the buyer journey.",
    badge: "Find out if your feed is actually converting",
    ctaText: "Run an Instagram Audit →",
    summary:
      "The Instagram Audit reviews up to 25 recent posts and returns your engagement rate against 1% and 2% follower benchmarks, how regularly you post, how your content splits between awareness, consideration, and decision-stage posts, and a note on each post with a recommended next improvement. It is delivered as a client-ready report.",
  },
  // # A labelled schematic occupies the supplied screenshot slot until an actual
  // product image is provided. Its caption remains the exact manuscript text.
  screenshot: {
    placeholder: "[Product screenshot placeholder]",
    caption:
      "Fig. 1: The Instagram Audit module: Instagram Username, Target Audience, Hashtags, and Results Limit fields, feeding the engagement and content-funnel analysis.",
  },
  engagement: {
    h2: "An Instagram Engagement Audit Built for Agencies",
    body: "As an Instagram engagement audit for agencies, the module compares actual engagement against follower-weighted benchmarks. A 40-follower account averaging 0.24 interactions per post (0.6%) tells a very different story from a 992-follower account averaging 34.23 (3.451%), and the audit is built to surface exactly that gap rather than leave you with a raw follower count.",
  },
  inputs: {
    h2: "What you enter. What the audit reads.",
    entered:
      "The Instagram username. You can also add a target audience and hashtags to sharpen the analysis, and set a results limit for how many posts to review.",
    reviewed:
      "Up to the requested number of recent posts. For each post, the audit reads the caption, the likes and comments, the spoken words in a video (as a transcript), and the visuals it can access. It then sorts every post into a funnel stage and writes a recommendation.",
  },
  // # Metric definitions transcribed from the supplied table. Keep each label
  // and explanation verbatim; these describe report interpretation, not UI logic.
  metrics: {
    h2: "How the numbers are worked out",
    columns: ["Metric", "What it means"],
    rows: [
      {
        metric: "Engagement rate",
        meaning:
          "Average interactions per post (likes plus comments) divided by followers. For example: a 992-follower account averaging 34.23 interactions per post has an engagement rate of 3.451%.",
      },
      {
        metric: "Expected engagement at 1% and 2%",
        meaning:
          "The interactions per post you would see at those rates. For example, at 992 followers: 9.92 and 19.84. Your real average is compared with these two yardsticks.",
      },
      {
        metric: "Engagement deficit",
        meaning:
          "How far the real average falls below the 1% benchmark. A result of 0 means it is at or above that benchmark.",
      },
      {
        metric: "Audience Quality Risk",
        meaning:
          "A Low, Medium, or High estimate of how mismatched followers and reactions look. It is inferred from engagement against followers, not from checking each follower, and it does not prove any account is fake.",
      },
      {
        metric: "Posting consistency",
        meaning:
          "How regularly you post. The report uses roughly two posts a week, with three to four days between posts, as its reference.",
      },
      {
        metric: "TOFU, MOFU, BOFU mix",
        meaning:
          "Share of posts built to attract new people (top of funnel), help them compare (middle), and prompt a decision (bottom), compared with a 60/20/20 target.",
      },
      {
        metric: "Posts with CTA, posts with comment hook",
        meaning:
          "The share of analysed posts that include a call to action, or a question that invites a reply.",
      },
    ],
  },
  strategy: {
    h2: "Instagram Content Strategy Audit, Post by Post",
    body: "The Instagram content strategy audit reviews up to 25 recent posts individually, covering captions, video transcripts and available visuals, and notes each post’s funnel stage, hook, call to action and comment prompt, not just aggregate numbers. Where a video transcript is available, the report breaks the post into hook, body, and call to action.",
  },
  funnel: {
    h2: "Instagram Profile Analysis Across TOFU, MOFU and BOFU",
    body: "This Instagram profile analysis tool classifies every post into TOFU, MOFU, or BOFU against an ideal 60/20/20 split. A feed that is 36% bottom-funnel sales content, well above the 20% target, gets flagged as “too sales-heavy,” with a specific recommendation to rebalance.",
  },
  capabilities: [
    "Engagement Rate Calculator: actual engagement against 1% and 2% follower benchmarks.",
    "Post-by-Post Content Audit: hook, body, and call-to-action breakdown per post where a transcript is available.",
    "TOFU / MOFU / BOFU Analysis: ideal against actual content funnel mix.",
    "Posting Consistency Checker: how often you post and the gaps between posts.",
    "Audience Quality Risk: a Low, Medium, or High estimate from engagement against followers.",
    "Client-Ready Report: exportable, agency-ready findings.",
  ],
  useCases: [
    {
      title: "Account handover & content reset",
      body: "Audit an account before you take it over or before a content reset, and show which post types and funnel stages need attention.",
    },
    {
      title: "Agency prospecting",
      body: "Run the audit on a prospect’s account and attach the report to your proposal. For the full picture, run the Full Report, which puts Instagram next to the website, Google Business Profile and LinkedIn results in one document.",
    },
    {
      title: "Account shortlisting",
      body: "Check engagement against follower count before you shortlist an account. Audience Quality Risk is a prompt to look closer, not proof of fake followers.",
    },
    {
      title: "Content planning",
      body: "Check whether the feed is too promotional, and which posts earn the comments and reactions worth repeating.",
    },
    {
      title: "Your next improvement",
      body: "See in plain language what your feed is doing, and what to change first.",
    },
  ],
  ctaBand: {
    headline: "See what's really working and what's too sales-heavy",
    subtitle: "Find out if your feed is actually converting",
    btnText: "Audit My Instagram →",
  },
  // # The user asked to ignore inline editorial references D-16, D-15 and D-30.
  // The public answers retain all actual copy; no account-access claim is added.
  faqs: [
    {
      q: "What tool analyzes my Instagram engagement rate and content mix?",
      a: "The Instagram Audit calculates your engagement rate against 1% and 2% follower benchmarks and sorts recent posts into a TOFU, MOFU and BOFU content funnel.",
    },
    {
      q: "How do I know if my Instagram content is too sales-heavy?",
      a: "The audit compares your content mix with a 60/20/20 target. When bottom-funnel posts sit far above their 20% share, the mix is flagged as “too sales heavy,” with advice on rebalancing. In one real report, 36% bottom-funnel content and calls to action on 96% of posts triggered that flag.",
    },
    {
      q: "Is there a tool that checks TOFU, MOFU and BOFU balance on Instagram?",
      a: "Yes. It is a core part of the Instagram Audit’s post-by-post content analysis.",
    },
    {
      q: "What’s a good way to audit an Instagram account before a marketing pitch?",
      a: "Run the Instagram Audit for an agency-ready report on engagement, consistency and funnel mix that you can attach to a proposal. To cover the prospect’s website and Google Business Profile too, run the Full Report.",
      links: [{ label: "Full Report", href: "/full-report" }],
    },
    {
      q: "How can I tell if my followers are low quality or inactive?",
      a: "The audit gives an Audience Quality Risk label of Low, Medium or High. It is estimated from engagement relative to follower count, not from checking followers one by one. A High label is a reason to investigate, not proof that followers are fake.",
    },
    {
      q: "How is Instagram engagement rate calculated?",
      a: "Average interactions per post (likes plus comments) divided by follower count. The report also shows the interactions you would expect at 1% and 2%.",
    },
    {
      q: "How many posts does the audit analyze?",
      a: "Up to 25 recent posts. If an account has posted less, fewer are analysed and the result is less reliable.",
    },
    {
      q: "Does a high engagement rate mean the account is healthy?",
      a: "Not always. A single standout post can lift the average. The report lists each post’s likes and comments so you can see whether results are consistent.",
    },
    {
      q: "What do I need to run an Instagram audit?",
      a: "Enter the account’s Instagram username.",
    },
    {
      q: "How often should I re-run it?",
      a: "After you change your content or posting rhythm, so you can compare results. The report is a snapshot of the day it was run.",
    },
  ],
};
