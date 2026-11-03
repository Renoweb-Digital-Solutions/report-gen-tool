/**
 * Static glossary copy transcribed from the user-supplied 32-page
 * "Flawdits all Glossarys question and answers.pdf".
 *
 * Consumed by components/glossary/GlossaryClient.js for browser-local search,
 * topic filtering, alphabetical browsing, and pagination. No API or PDF reader
 * is required at runtime. Questions and answers retain the source wording;
 * only extraction whitespace is normalized. Short term labels are navigation
 * aids; the complete question remains the authoritative heading context.
 *
 * Preserve stable entry/category IDs when editing: the client uses these for
 * list identity and filter matching. Add content here rather than in the UI.
 */

// ============================================================================
// TOPIC INDEX
// Keep the source document's 14 sections and ordering for familiar report lookup.
// ============================================================================
export const GLOSSARY_CATEGORIES = [
  {
    id: "topic-1",
    name: "Understanding Your Report",
  },
  {
    id: "topic-2",
    name: "Website Authority and Search Visibility",
  },
  {
    id: "topic-3",
    name: "AI Visibility",
  },
  {
    id: "topic-4",
    name: "Social Media (Instagram and LinkedIn)",
  },
  {
    id: "topic-5",
    name: "Content Funnel",
  },
  {
    id: "topic-6",
    name: "Google Business Profile and Local Search",
  },
  {
    id: "topic-7",
    name: "Website Design and User Experience",
  },
  {
    id: "topic-8",
    name: "Ads Library",
  },
  {
    id: "topic-9",
    name: "Brand and Business Terms",
  },
  {
    id: "topic-10",
    name: "Parts of Your Report",
  },
  {
    id: "topic-11",
    name: "Flawdits Tools and Extra Terms",
  },
  {
    id: "topic-12",
    name: "Reports, Scores and Priorities",
  },
  {
    id: "topic-13",
    name: "Brand, Design and Usability",
  },
  {
    id: "topic-14",
    name: "Business, Agency and Sales Terms",
  },
];

// ============================================================================
// QUESTION AND ANSWER COLLECTION
// Each entry belongs to one topic; full answers remain searchable even when closed.
// ============================================================================
export const GLOSSARY_ENTRIES = [
  // Understanding Your Report: source questions and their complete explanations.
  {
    id: "term-001",
    category: "topic-1",
    term: "Audit",
    question: "What is an audit, and what is a digital presence audit?",
    answer:
      "An audit is a careful check of something to find what is working well and what needs attention. A digital presence audit does this for how your business appears online: your website, social media pages, Google listing, reviews and brand images. Together these are your digital presence, like your shop window on the internet. The audit points out what is working and what needs attention, much like a health check for your business online, and gives you a starting point for deciding what to fix. Missing or mismatched details make it harder for people to understand or trust you.",
  },
  {
    id: "term-002",
    category: "topic-1",
    term: "Audit finding",
    question: "What is an audit finding, and what is a recommendation?",
    answer:
      "An audit finding is one thing the check-up noticed. It can be a problem, such as a missing business description, or a good point, such as a strong photo collection. A recommendation is the suggested next step that usually comes with a finding. Example: add a clear business description. Treat it as guidance to review, not a promise that the change will lift rankings or sales.",
  },
  {
    id: "term-003",
    category: "topic-1",
    term: "Report labels and severity",
    question:
      "What do labels like Very Low, Low, Moderate, Good and Critical mean?",
    answer:
      "These are plain-word summaries placed next to a number. Very Low and Critical point to areas that need attention first. Moderate means somewhere in the middle. Good means the area is mostly healthy. They help you spot priorities without studying every number.",
  },
  {
    id: "term-004",
    category: "topic-1",
    term: "Benchmark",
    question: 'What is a benchmark, and what does "versus benchmark" mean?',
    answer:
      'A benchmark is a reference point used to judge a result. A number on its own can be hard to read. Example: if your Instagram posts average 3 interactions and the benchmark is 1.26, you can see you are above that mark. "Versus benchmark" simply means your result is being compared with that reference value. In the Ads Library section, the Visibility Score versus benchmark works the same way: 0% against a benchmark of 70% shows the gap, and here it means none of the expected setup was found. Always check what the percentage measures before judging it.',
  },
  {
    id: "term-005",
    category: "topic-1",
    term: "Error, Warning and Notice",
    question:
      "What do Error, Warning and Notice mean, and what do their totals show?",
    answer:
      "These show how serious a technical issue is. Error means a problem that should be fixed soon. Warning means something likely to cause trouble. Notice means a small point worth knowing about. Think of them as red, orange and yellow lights. The totals count the items the scan flagged in each group. Example: 1 error, 6 warnings, 5 notices. The totals do not show how serious each individual item is, so open the findings before choosing what to fix first.",
  },
  {
    id: "term-006",
    category: "topic-1",
    term: "Priority recommendation",
    question:
      "What is a priority recommendation, and what do High, Medium and Low priority mean?",
    answer:
      "A priority recommendation is a suggested action ranked by importance. Putting them in order gives you a priority action list, so you can decide what to do first. High priority (or Critical Fixes) items are worth doing first. Medium priority (or Quick Wins) items are smaller, quicker improvements. Low priority (or Long-term Improvements) can wait. This helps you avoid trying to fix everything at once. A broken enquiry form usually matters more than a small design tweak, and your budget, goals and the effort needed also affect the best order.",
  },
  {
    id: "term-007",
    category: "topic-1",
    term: "Technical backlog",
    question: "What is a technical backlog?",
    answer:
      "A technical backlog is a to-do list of website fixes that a developer works through over time. Example: renewing a security certificate, then shortening a page description, then speeding up the site.",
  },
  {
    id: "term-008",
    category: "topic-1",
    term: "White-label report",
    question: "What is a white-label report?",
    answer:
      "A white-label report shows your own logo and colours in place of Flawdits'. Agencies and freelancers use it so reports look like their own work when shared with clients. On Flawdits, this branding is available on the Agency plan.",
  },

  // Website Authority and Search Visibility: source questions and their complete explanations.
  {
    id: "term-009",
    category: "topic-2",
    term: "SEO",
    question: "What is SEO?",
    answer:
      "SEO stands for search engine optimization. It means helping your website show up when people search on Google or similar sites. Better visibility can bring more visitors, but nobody can guarantee a particular position.",
  },
  {
    id: "term-010",
    category: "topic-2",
    term: "Search engine",
    question: "What is a search engine and what is a search result?",
    answer:
      "A search engine, such as Google, is a tool that finds web pages for what you type. The list it shows you is the search results. Businesses want to appear near the top because most people click the first few.",
  },
  {
    id: "term-011",
    category: "topic-2",
    term: "Organic traffic",
    question: "What is organic traffic, and how is it estimated?",
    answer:
      "Organic traffic is the visitors who reach your website through unpaid search results. They found you by searching, not by clicking an advert. Example: someone searches for a local printer and clicks your site. The report shows a traffic estimate, which is an informed guess at how many visits a website gets. It is good for spotting broad patterns but may not match the numbers in your own visitor records. A very low organic traffic figure means the tool estimates few visits from unpaid search. Different tools give different figures, so treat it as an estimate and check whether you appear for searches that match your services and location.",
  },
  {
    id: "term-012",
    category: "topic-2",
    term: "Authority Score",
    question: "What is Authority Score, and what do low and high scores mean?",
    answer:
      "Authority Score is a number showing how trusted and well known your website looks to search tools. It leans heavily on how many respected websites link to yours. It is not an official Google score. Think of it like a reputation score built from who vouches for you. A low score (like 9, Very Low) means few trusted websites point to yours, so search tools see you as less established. This is common for smaller or newer sites and does not mean your website is bad. A high score means the tool sees your website as having stronger trust signals than lower-scoring sites. That is a good comparison point, but it does not guarantee high search positions, visitors or sales.",
  },
  {
    id: "term-013",
    category: "topic-2",
    term: "Authority Health",
    question: "What is Authority Health?",
    answer:
      "Authority Health is a companion number describing how healthy your website's trust-building signals are. A label like Critical means this is one of the first areas to work on. It is a snapshot, not a permanent rating.",
  },
  {
    id: "term-014",
    category: "topic-2",
    term: "Backlink",
    question: "What is a backlink, and what does Total Backlinks mean?",
    answer:
      "A backlink is a link from another website to yours. It works like a recommendation. Example: a local news site mentions your business and links to your page. Quality matters more than quantity. Total Backlinks is the number of links found pointing to your website. Several links can come from the same site, so it can be larger than the number of referring domains. It does not show how valuable the links are.",
  },
  {
    id: "term-015",
    category: "topic-2",
    term: "Referring domains",
    question:
      "What are referring domains, and how are they different from backlinks?",
    answer:
      "A referring domain is a separate website that links to you. Backlinks count every link, while referring domains count the websites those links come from. If one website links to you ten times, that is ten backlinks but one referring domain. Example: 524 backlinks from 387 referring domains means many links come from different sites, while some sites link more than once. More different, relevant websites is usually a healthier sign. A low number of referring domains means links were found from only a few websites. That can limit how people and search tools discover you, but a small local business may not need as many as a national publisher. Referring Domains: Moderate means the number sits in the middle band of the report's scale. It is not a universal target. A few relevant, trusted sites can be worth more than many unrelated ones.",
  },
  {
    id: "term-016",
    category: "topic-2",
    term: "Follow and no-follow links",
    question: "What are follow and no-follow links?",
    answer:
      "A follow link is one that search tools may count as a vote of trust. A no-follow link asks them not to count it. Both can still send real visitors to you. A healthy mix is normal.",
  },
  {
    id: "term-017",
    category: "topic-2",
    term: "Backlink profile",
    question: "What is a backlink profile?",
    answer:
      "A backlink profile is the full picture of the links pointing to your website: how many there are, which websites they come from, and what types they are. It shows how the wider internet sees and trusts you.",
  },
  {
    id: "term-018",
    category: "topic-2",
    term: "Top Country",
    question: "What does Top Country mean?",
    answer:
      "Top Country is the country sending your website the most visitors. Example: au with 113 means Australia is the largest source, with 113 visits counted.",
  },
  {
    id: "term-019",
    category: "topic-2",
    term: "Topical authority",
    question: "What is topical authority?",
    answer:
      "Topical authority means being seen as a go-to source on a subject because you cover it in depth. Example: a printer with many helpful guides on labels and overlays looks more expert than one with a single page.",
  },
  {
    id: "term-020",
    category: "topic-2",
    term: "Traffic Dependency Risk",
    question: "What does Traffic Dependency Risk mean?",
    answer:
      "It warns that your visitors come from too few places. If that one source slows down, your visits drop. Having several ways for people to find you makes your business steadier.",
  },
  {
    id: "term-021",
    category: "topic-2",
    term: "Website visibility",
    question: "What is website visibility?",
    answer:
      "Website visibility is how easily people can find your website when they search or look for you online. High visibility means you show up often when people look for what you offer. Example: a bakery that appears when someone searches for fresh bread near them has good visibility.",
  },
  {
    id: "term-022",
    category: "topic-2",
    term: "Keyword",
    question: "What is a keyword?",
    answer:
      'A keyword is a word or phrase people type into a search box. Example: "membrane switch manufacturer". Keywords show what people want, so they guide what your pages should talk about.',
  },
  {
    id: "term-023",
    category: "topic-2",
    term: "Organic keywords",
    question:
      'What are organic keywords, and what do "Very Limited" or a low count mean?',
    answer:
      "Organic keywords are the search phrases for which your website appears in unpaid results. The report shows how many. Example: 154 means your site shows up for 154 different phrases. Very Limited, or a low count, means your site appears for only a small number of search phrases. This often means people searching for your products and services in general terms are not finding you yet. The next step is to check which useful searches you are missing and add helpful pages, not to chase a bigger number for its own sake.",
  },
  {
    id: "term-024",
    category: "topic-2",
    term: "Keyword coverage",
    question: "What is keyword coverage?",
    answer:
      "Keyword coverage is how many of the important phrases in your field your website addresses. Wider coverage means more chances to be found by different kinds of searchers.",
  },
  {
    id: "term-025",
    category: "topic-2",
    term: "Brand and non-brand keywords",
    question: "What is the difference between brand and non-brand keywords?",
    answer:
      'Brand keywords include your business name, such as "Sun Industries". Non-brand keywords describe what you offer without your name, such as "custom silicone keypad". Non-brand searches matter because they reach people who do not know you yet.',
  },
  {
    id: "term-026",
    category: "topic-2",
    term: "Search intent",
    question: "What is search intent?",
    answer:
      "Search intent is the reason behind a search. Someone may want to learn, compare, buy or find a specific website. Matching your pages to intent helps the right people land on them.",
  },
  {
    id: "term-027",
    category: "topic-2",
    term: "Informational, commercial and transactional keywords",
    question: "What are informational, commercial and transactional keywords?",
    answer:
      'These are three kinds of search, based on what the person wants to do. Informational keywords are searches by people who want to learn something. Example: "how does a membrane keypad work". They are often at the start of a buying journey. Commercial keywords are searches by people comparing options before choosing. Example: "best membrane switch suppliers". They are weighing who to trust. Transactional keywords are searches by people ready to act, such as buy or request a quote. Example: "order custom labels online".',
  },
  {
    id: "term-028",
    category: "topic-2",
    term: "Navigational keywords",
    question:
      "What are navigational keywords, and what does Navigational Keyword Dependence mean?",
    answer:
      'Navigational keywords are searches by people trying to reach a particular website, usually by typing a business name. Example: someone typing "Sun Industries" to find your site. Navigational Keyword Dependence means most of your search visibility comes from people who already know your name. That is good for loyalty, but it shows you are not yet reaching new customers who search by topic.',
  },
  {
    id: "term-029",
    category: "topic-2",
    term: "Other Keywords",
    question: "What are Other Keywords?",
    answer:
      "Other is a group for searches that do not fit neatly into the four types above, or whose purpose is unclear. Example: a very short or unusual phrase where it is hard to tell whether the person wants to learn, compare or buy.",
  },
  {
    id: "term-030",
    category: "topic-2",
    term: "Keyword Intent Distribution",
    question:
      "What is Keyword Intent Distribution, and how do Current Ranking Intent and Keyword Opportunity Intent differ?",
    answer:
      "Keyword Intent Distribution is a breakdown, in percentages, of the types of searches in a set of keywords. It shows whether searchers are mostly learning, comparing, buying or looking for you by name. Current ranking intent shows the kinds of searches your site already appears for. Keyword opportunity intent shows the kinds of searches people make in your field that you could aim for. One is where you are, the other is where you could go.",
  },
  {
    id: "term-031",
    category: "topic-2",
    term: "Ranking",
    question: "What does ranking mean?",
    answer:
      "Ranking is your position in search results for a phrase. Position one is the top. Rankings move often and no one can promise a fixed position.",
  },
  {
    id: "term-032",
    category: "topic-2",
    term: "Competitor",
    question: "What is a competitor, and what is a competitor comparison?",
    answer:
      "A competitor is another business that sells similar products or services to the same kind of customers. Example: if you print labels in Perth, other label printers in Perth are your competitors. A competitor comparison puts details about your business next to those businesses, such as ratings, reviews, photos or search visibility, so you can see where you are ahead and where you can catch up. It is most useful when the competitors serve similar customers in the same area.",
  },
  {
    id: "term-033",
    category: "topic-2",
    term: "Authority deficit",
    question:
      "What is an authority deficit, and how can a website improve its Authority Score?",
    answer:
      "An authority deficit is the report's way of saying your website's trust signals fall short of where it would like them. Use it as a prompt to look at your links, useful content and mentions elsewhere, not as a verdict on your business. To improve the score, publish useful, trustworthy pages and earn genuine links from relevant websites. Avoid buying poor-quality links, which can harm trust. Changes take time, and one tool's score may not match what Google does.",
  },
  {
    id: "term-034",
    category: "topic-2",
    term: "SEO audit",
    question: "What is an SEO audit, and what is technical SEO?",
    answer:
      "An SEO audit is a review of the parts of a website that affect how easily people find it through search engines, such as page titles, content, links, speed and security. It points out improvements but cannot promise a higher position. Technical SEO is the behind-the-scenes setup that helps search tools reach, read and trust your website. Visitors rarely see it, but it affects how smoothly your site works and whether it can be found.",
  },
  {
    id: "term-035",
    category: "topic-2",
    term: "HTTPS and SSL",
    question:
      'What are HTTPS and SSL, and what does "SSL expiration in 64 days" mean?',
    answer:
      'HTTPS is the secure version of the connection a browser uses to open a website. It protects information passed between the visitor and the site, such as form details. SSL is the security feature that makes a website address start with https and shows a padlock in the browser. Look for the padlock before entering personal or payment details. Your site\'s SSL certificate has an expiry date. "SSL expiration in 64 days" means it is valid for 64 more days. After that, browsers may warn visitors that the site is not safe, so set a reminder to renew it in good time.',
  },
  {
    id: "term-036",
    category: "topic-2",
    term: "Page title",
    question: "What is a page title?",
    answer:
      "A page title is the name of a specific page. It often shows as the clickable heading in search results and in the browser tab. A clear title helps people decide if the page matches what they want.",
  },
  {
    id: "term-037",
    category: "topic-2",
    term: "LCP",
    question: "What is LCP?",
    answer:
      "LCP stands for Largest Contentful Paint. It measures how long the biggest item on the screen, such as a large heading or picture, takes to appear. If it takes too long, the page feels slow to open.",
  },
  {
    id: "term-038",
    category: "topic-2",
    term: "CLS (Cumulative Layout Shift)",
    question:
      "What is CLS (Cumulative Layout Shift), and what is a layout shift?",
    answer:
      "A layout shift is when parts of a page move while it loads. Example: you go to tap a button and an image appears above it, pushing it down so you tap the wrong thing. It is annoying and can lose visitors. CLS stands for Cumulative Layout Shift and measures how much things move around while a page loads. Less movement makes a page feel steadier.",
  },
  {
    id: "term-039",
    category: "topic-2",
    term: "FCP",
    question: "What is FCP?",
    answer:
      "FCP stands for First Contentful Paint. It measures how long it takes for the first piece of content, such as text or a picture, to appear. It shows how soon the page starts to show something, not when it is fully ready.",
  },
  {
    id: "term-040",
    category: "topic-2",
    term: "TBT",
    question: "What is TBT?",
    answer:
      "TBT stands for Total Blocking Time. It measures how long a page is too busy to respond to taps and clicks while loading. It helps developers find work that delays the page, though it is not one of Google's main Core Web Vitals.",
  },
  {
    id: "term-041",
    category: "topic-2",
    term: "INP",
    question: "What is INP?",
    answer:
      "INP stands for Interaction to Next Paint. It measures how quickly a page visibly reacts when you click, tap or open a menu. A poor result makes a page feel sluggish even if the first screen loaded fast.",
  },
  {
    id: "term-042",
    category: "topic-2",
    term: "Mobile-friendly design",
    question:
      "What is mobile-friendly design, and what is mobile-specific user experience?",
    answer:
      "It means a website is comfortable to use on a phone or tablet, with its small screen and finger taps: readable text, easy-to-tap buttons, forms that are not frustrating, and no need to zoom or scroll sideways. A site can work well on a computer and still feel awkward on a phone.",
  },
  {
    id: "term-043",
    category: "topic-2",
    term: "Website security",
    question: "What is website security?",
    answer:
      "It is the set of protections that keep a website and its visitors safe, such as secure connections and safe browser settings. A basic scan spots some concerns but is not a full security test.",
  },
  {
    id: "term-044",
    category: "topic-2",
    term: "Inline scripts",
    question:
      'What are inline scripts, what does "86 inline scripts" mean, and what does externalising mean?',
    answer:
      "Scripts are small programs that make a page do things. Inline scripts are written directly inside the page rather than in separate files, which makes the page heavier and harder to manage. A finding such as 86 inline scripts means the scan found 86 of them. Externalising means moving them to separate files that load more efficiently. A developer should check which are needed before changing any.",
  },
  {
    id: "term-045",
    category: "topic-2",
    term: "Website Health",
    question: "What is Website Health?",
    answer:
      "Website Health is a score showing how well your website passes a set of technical checks, such as security, speed and setup. Example: 75% (Grade B, Good) means most checks passed, with some fixes recommended.",
  },
  {
    id: "term-046",
    category: "topic-2",
    term: "DNS",
    question:
      'What is DNS, and what does "Single A record (no DNS redundancy)" mean?',
    answer:
      "DNS is the internet's address book. It turns your website name into the location of the computer that holds your site, so visitors can reach it. An A record is the entry that points your website name to its location. Only one entry means there is no backup if that location has trouble. Adding a backup can keep your site reachable.",
  },
  {
    id: "term-047",
    category: "topic-2",
    term: "CDN",
    question: "What is a CDN?",
    answer:
      "CDN stands for content delivery network. It keeps copies of your website in many places around the world so pages load faster and the site stays up if one location fails.",
  },
  {
    id: "term-048",
    category: "topic-2",
    term: "Security headers",
    question:
      "What are security headers, what does a missing one mean, and what does a Security Headers Grade of F mean?",
    answer:
      "Security headers are hidden instructions your website sends to a visitor's browser telling it how to stay safe. They are normally added by a developer. A missing security header means one of these protective instructions is not set up, which leaves a small gap that can weaken protection and trust. How much it matters depends on the header and your site, so have a developer review it rather than adding settings blindly. In the sample report, the security header checks scored 20 and received an F because several browser safety instructions were missing. The grade alone does not prove the site has been attacked or that any information has leaked.",
  },
  {
    id: "term-049",
    category: "topic-2",
    term: "Strict-Transport-Security",
    question: "What is Strict-Transport-Security?",
    answer:
      "It tells browsers to always use the secure version of your site. This stops visitors from being switched to an unsafe version by mistake.",
  },
  {
    id: "term-050",
    category: "topic-2",
    term: "Content-Security-Policy",
    question: "What is Content-Security-Policy?",
    answer:
      "It is a list of the sources your site trusts for scripts, styles and images. Anything else is blocked, which helps stop harmful code from being slipped in.",
  },
  {
    id: "term-051",
    category: "topic-2",
    term: "X-Content-Type-Options",
    question: "What are X-Content-Type-Options?",
    answer:
      "It tells the browser to treat each file as the type your site says it is. This prevents the browser from guessing wrongly and running something harmful.",
  },
  {
    id: "term-052",
    category: "topic-2",
    term: "X-Frame-Options",
    question: "What are X-Frame-Options?",
    answer:
      "It stops other websites from showing your pages inside their own page. This protects against clickjacking, a trick where a visitor is fooled into clicking something hidden.",
  },
  {
    id: "term-053",
    category: "topic-2",
    term: "Referrer-Policy",
    question: "What is Referrer-Policy?",
    answer:
      "It controls how much information about where a visitor came from gets shared when they click a link on your site. It protects privacy.",
  },
  {
    id: "term-054",
    category: "topic-2",
    term: "Permissions-Policy",
    question: "What is Permissions-Policy?",
    answer:
      "It limits which browser features your site can use, such as the camera or location. Restricting what you do not need lowers risk.",
  },
  {
    id: "term-055",
    category: "topic-2",
    term: "HTTP Grade",
    question: "What is the HTTP Grade?",
    answer:
      "It rates how well your site responds to basic web requests. A high grade, like A, means the basic connection works as expected.",
  },
  {
    id: "term-056",
    category: "topic-2",
    term: "Meta Grade",
    question: "What are the Meta Grade and a Meta Grade of A?",
    answer:
      "The Meta Grade rates the short descriptive text that search results display about your pages. A high grade means these descriptions are in good shape. In the sample report, a Meta Grade of A scored 95, so most page detail checks passed. It does not mean every title and description is perfect, so still read the specific notes.",
  },
  {
    id: "term-057",
    category: "topic-2",
    term: "Meta description",
    question:
      'What is a meta description, and what does "may truncate: 169 chars" mean?',
    answer:
      "A meta description is the short summary shown under your page title in search results. A clear one helps people decide to click. Truncate means cut off. A description over about 160 characters (such as 169) may be shortened with dots in search results, so part of your message gets lost. Trim it so the key point is seen.",
  },
  {
    id: "term-058",
    category: "topic-2",
    term: "Performance Grade",
    question:
      "What is the Performance Grade, and what does a Performance Grade of C mean?",
    answer:
      "The Performance Grade rates how fast and smoothly your pages load and respond. A lower grade, like C, means visitors may wait longer than they would like. In the sample report, a C scored 55, which shows room to improve speed or loading. Real visitors' experience varies by device and connection, so test important pages before choosing fixes.",
  },
  {
    id: "term-059",
    category: "topic-2",
    term: "Response Time (ms)",
    question: "What is Response Time (ms)?",
    answer:
      "Response time is how long your site takes to start replying after someone asks for a page. It is measured in milliseconds (ms), thousandths of a second. 3,255ms is about 3.3 seconds, which feels slow.",
  },
  {
    id: "term-060",
    category: "topic-2",
    term: "HTML size and page weight",
    question: "What are HTML size and page weight?",
    answer:
      "HTML size is the size of the main page file your site sends to visitors. Page weight is how big a whole page is, including its text and images. The bigger they are, the longer a page takes to load, especially on a phone with a slow connection.",
  },
  {
    id: "term-061",
    category: "topic-2",
    term: "Minified",
    question: "What does minified mean?",
    answer:
      "A minified file has had unneeded spaces and notes removed so it is smaller and loads faster. Visitors see no difference, except speed.",
  },
  {
    id: "term-062",
    category: "topic-2",
    term: "Caching and compression",
    question: "What are caching and compression?",
    answer:
      "Caching saves a copy of a page so it loads quicker next time. Compression squeezes files smaller before sending. Both make your site faster.",
  },
  {
    id: "term-063",
    category: "topic-2",
    term: "Crawling and crawl efficiency",
    question: "What is crawling and crawl efficiency?",
    answer:
      "Search tools send automated visitors to read your pages. This is crawling. Crawl efficiency is how easily they can do it. A slow site wastes their time and may mean some pages are missed.",
  },
  {
    id: "term-064",
    category: "topic-2",
    term: "Robots.txt file",
    question:
      'What is a robots.txt file, and what does "Robots.txt: Found" mean?',
    answer:
      "It is a small file that tells search tools which parts of your site they may read. Found means the scan found yours, which is good. Finding it does not prove its instructions are right, so have someone check that useful pages are not blocked by mistake.",
  },
  {
    id: "term-065",
    category: "topic-2",
    term: "Sitemap.xml file",
    question:
      'What is a sitemap.xml file, and what does "Sitemap.xml: Found" mean?',
    answer:
      "It is a list of your important pages that you hand to search tools, like a map, to help them discover your pages. Found means the scan found yours. It helps, but it does not guarantee every page will appear in results. The list should be current.",
  },
  {
    id: "term-066",
    category: "topic-2",
    term: "Core Web Vitals",
    question: "What are Core Web Vitals?",
    answer:
      "Core Web Vitals are Google's checks of the visitor experience: how quickly the main content appears, how fast the page reacts to taps and clicks, and whether things jump around while loading. In your report, speed shows up as response time, page size and a performance grade.",
  },
  {
    id: "term-067",
    category: "topic-2",
    term: "Page speed",
    question: "What is page speed?",
    answer:
      "Page speed is how quickly a page loads and becomes ready to use. People leave slow sites, so speed affects both visitors and search visibility. Example: a page that appears in two seconds keeps more visitors than one that takes eight.",
  },

  // AI Visibility: source questions and their complete explanations.
  {
    id: "term-068",
    category: "topic-3",
    term: "AI visibility",
    question: "What is AI visibility, and what is an AI Visibility Audit?",
    answer:
      "AI visibility is how often your business appears when people ask AI tools, such as chat assistants, for information. It is separate from your position in regular search results. An AI Visibility Audit checks whether your business appears in AI answers and which of your pages are used as sources. It looks at brand mentions, cited pages and readiness, and shows a snapshot of one moment.",
  },
  {
    id: "term-069",
    category: "topic-3",
    term: "AI-powered search",
    question: "What is AI-powered search?",
    answer:
      "AI-powered search means getting answers from an AI tool that writes a response, instead of scrolling a list of links. Not every AI tool works the same way, so results differ between them.",
  },
  {
    id: "term-070",
    category: "topic-3",
    term: "AI mention",
    question:
      "What is an AI mention, and what does a low number of mentions mean?",
    answer:
      "An AI mention is when an AI answer names your business or brand. Example: someone asks for printers in Perth and your company is named. The report shows how many mentions were found. A low number means your brand was named in few of the AI answers checked. It does not prove no AI tool ever mentions you. Results vary by question, tool and time, so treat the figure as a snapshot.",
  },
  {
    id: "term-071",
    category: "topic-3",
    term: "Cited page",
    question:
      "What is a cited page, and what does a low number of cited pages mean?",
    answer:
      "A cited page is a page from your website that an AI answer points to as a source. A mention names you, while a citation credits a page of yours. A low number means few of your pages were pointed to as sources in the AI results checked. It does not mean your pages are poor. It only shows how often they were used as sources in that check.",
  },
  {
    id: "term-072",
    category: "topic-3",
    term: "Mentions, citations and search rankings",
    question:
      "What is the difference between a mention, a citation and a search ranking?",
    answer:
      "A mention is your name appearing in an answer. A citation is one of your pages being credited as a source. A ranking is your position in a regular list of search results. They are related but not the same, so one cannot stand in for another.",
  },
  {
    id: "term-073",
    category: "topic-3",
    term: "AI Visibility and Discoverability Scores",
    question:
      "What are the AI Visibility Score and the AI Discoverability Score, and what does a low score mean?",
    answer:
      "The AI Visibility Score is a rating from 0 to 100 showing how often and how clearly your brand is mentioned or cited across AI search and chat tools, such as ChatGPT. The AI Discoverability Score is a 0 to 100 rating of how easily AI tools surface your brand. It is closely related, and your report uses the name shown on its label. Either one is a snapshot of the day it was checked, not a guarantee. Re-checking every month or every few months shows the trend. A low score (like 14, Very Low) means AI tools rarely brought up your brand in the checks made. This is not a penalty. It is a sign that clearer, more helpful information about your business online could help AI tools find and understand you.",
  },
  {
    id: "term-074",
    category: "topic-3",
    term: "AI readiness",
    question: "What is AI readiness?",
    answer:
      "AI readiness is how well your website is set up to be understood by AI tools, for example with clear pages and helpful guidance files.",
  },
  {
    id: "term-075",
    category: "topic-3",
    term: "llms.txt file",
    question: 'What is an llms.txt file, and what does "not found" mean?',
    answer:
      "It is a plain file on your website that gives AI tools a short, tidy guide to your business and key pages. Not Found means the scan did not find that optional file, so you do not have one yet. It does not prove AI tools cannot see your website. It is a helpful extra, not a guarantee of appearing in answers. Treat it as one readiness check and decide whether it suits your goals.",
  },
  {
    id: "term-076",
    category: "topic-3",
    term: "AI answers and customer guarantees",
    question: "Does showing up in AI answers guarantee customers?",
    answer:
      "No. Being mentioned can raise awareness, but it does not promise visits, leads or sales. Treat it as one more way people may discover you.",
  },
  {
    id: "term-077",
    category: "topic-3",
    term: "Generative Engine Optimization (GEO)",
    question: "What is Generative Engine Optimization (GEO)?",
    answer:
      "GEO means making information about your business clear and helpful so AI answer tools can understand it and may use it in replies. It does not guarantee you will be named. The same helpful content also serves ordinary search and human readers.",
  },
  {
    id: "term-078",
    category: "topic-3",
    term: "AI versus traditional SEO",
    question: "What does an AI-versus-traditional-SEO comparison show?",
    answer:
      "It places your AI visibility result next to your website search result so you can see if they differ. Example: some search visibility but few AI mentions. The two scores use different checks and should not be added together.",
  },

  // Social Media (Instagram and LinkedIn): source questions and their complete explanations.
  {
    id: "term-079",
    category: "topic-4",
    term: "Social media audit",
    question: "What is a social media audit?",
    answer:
      "A social media audit is a check of how a business page performs on a platform such as Instagram or LinkedIn. It looks at audience size, interaction, how often you post and what kinds of posts you share.",
  },
  {
    id: "term-080",
    category: "topic-4",
    term: "Engagement",
    question:
      "What is engagement, and what are reactions, comments and reposts?",
    answer:
      "Engagement is any action people take on your posts. On Instagram this means likes, comments and saves. On LinkedIn it means reactions, comments and reposts. A reaction is a like or similar response, a comment is a written reply, and a repost is when someone shares your post with their own followers. Engagement shows whether people care, not just whether they scrolled past.",
  },
  {
    id: "term-081",
    category: "topic-4",
    term: "Engagement rate",
    question:
      "What is the engagement rate, and what is follower-weighted engagement?",
    answer:
      "Engagement rate compares the interactions your posts get with the size of your audience. Example: 126 followers and an average of 3 interactions per post gives roughly 2.4%. It helps compare accounts of different sizes. That is the idea behind follower-weighted engagement: 3 interactions from 10 followers is strong, while 3 interactions from 10,000 followers is weak. It is one clue, not a full measure of success.",
  },
  {
    id: "term-082",
    category: "topic-4",
    term: "Expected engagement rates",
    question: "What are the expected engagement rates at 1% and 2%?",
    answer:
      "These are example targets. With 126 followers, 1% would be about 1.26 interactions per post and 2% about 2.52. They give you a yardstick to compare your real average against.",
  },
  {
    id: "term-083",
    category: "topic-4",
    term: "Engagement deficit and an engagement gap",
    question:
      'What are an engagement deficit and an engagement gap, and what does "0 below the 1% benchmark" mean?',
    answer:
      'An engagement deficit, also called an engagement gap, is the difference between your actual engagement and a target or comparison level in the report. It shows whether you are below that reference. A deficit of 0 means you met or beat that target. So "0 below the 1% benchmark" means the calculation found no shortfall below that reference. It does not mean engagement is perfect. Read it together with the benchmark and your average activity, and still review your content and how often you post.',
  },
  {
    id: "term-084",
    category: "topic-4",
    term: "Audience Quality Risk",
    question:
      "What is Audience Quality Risk, and does a high risk prove followers are fake?",
    answer:
      "Audience Quality Risk estimates the chance that some followers are inactive, unrelated or not real people. Low means little worry. It is estimated from how followers react, not from checking each follower one by one. A high risk label (also shown as Follower Quality Risk: High) means your follower and engagement numbers look mismatched enough to look into. It does not prove followers are fake, and it does not name or prove any individual account is fake. Causes can include inactive followers, few reactions compared with the number of followers, or content that does not prompt a response.",
  },
  {
    id: "term-085",
    category: "topic-4",
    term: "Low-quality audiences and bot-heavy followers",
    question: "What are a low-quality audience and a bot-heavy follower base?",
    answer:
      "A low-quality audience is followers who are unlikely ever to react or buy, for example inactive accounts or automated accounts that pretend to be people. A bot is an automated account run by software. A bot-heavy base means many followers are not real people, which makes your numbers look better than they are.",
  },
  {
    id: "term-086",
    category: "topic-4",
    term: "Vanity growth",
    question: "What is vanity growth?",
    answer:
      "It is chasing a bigger follower count for shows, such as buying followers. It looks good but brings no real interest.",
  },
  {
    id: "term-087",
    category: "topic-4",
    term: "Organic growth and reactivation",
    question:
      'What are organic growth, organic reactivation and "Organic Reset Needed"?',
    answer:
      "Organic means without paid advertising. Organic growth means gaining attention, followers or engagement through useful content, genuine recommendations and steady activity. It is not instant. Reactivation means waking up followers who stopped paying attention. Example: sharing useful tips that people want to save and comment on. Organic Reset Needed is a suggestion in the report to rebuild genuine interest instead of repeating sales posts or using shortcuts. Share useful advice, show real work and invite conversation. It is not a platform setting.",
  },
  {
    id: "term-088",
    category: "topic-4",
    term: "Posting consistency",
    question:
      'What is posting consistency, and what does "Irregular" mean for posting?',
    answer:
      "Posting consistency is how regularly you post. A steady rhythm, such as twice a week, keeps you in front of people and helps platforms show your content. Irregular means the gaps between posts vary a lot, with long quiet stretches. Regular timing is easier for followers to expect.",
  },
  {
    id: "term-089",
    category: "topic-4",
    term: "Posting gaps and frequency",
    question: 'What are posting gaps, posts per week and "Gaps Within 4 Days"?',
    answer:
      "The posting gap is the average number of days between posts. Posts per week is how many you share in a typical week. The report suggests about two posts a week, with three to four days between posts. Example: a 12-day gap and 0.58 posts per week means posting is occasional and uneven. Gaps Within 4 Days shows how often your posts were four days or less apart. 0% means none of the gaps met that rule. It describes your posting rhythm, not how many people saw the posts.",
  },
  {
    id: "term-090",
    category: "topic-4",
    term: "Post volume and sample size",
    question:
      "What are post volume and Posts Analyzed, and why does a limited sample matter?",
    answer:
      "Post volume is how many posts were checked, also shown as Posts Analyzed. The Instagram review looks at up to 25 recent posts. With only a few, such as 5, the report has less evidence and conclusions are less reliable, so it suggests checking 20 to 25 for a clearer picture. This is called a limited sample. Example: five LinkedIn posts may not show your long-term pattern. A post volume problem means too few recent posts were found for a confident review, or you post less often than the report suggests. Use the result as a first impression and look at more posts before big decisions.",
  },
  {
    id: "term-091",
    category: "topic-4",
    term: "Algorithm",
    question:
      "What is the algorithm, and what does Algorithm Behavior mean in the social report?",
    answer:
      "The algorithm is the set of rules a platform uses to decide which posts to show to which people. Platforms do not share the details and they change their rules, so no one can fully control it. Algorithm Behavior is a short note in the social report on what platforms may pay attention to, such as saves, shares, comments and watching. Treat it as general guidance.",
  },
  {
    id: "term-092",
    category: "topic-4",
    term: "Saves, shares and audience retention",
    question:
      "What are saves, shares, retention, watch time and audience retention?",
    answer:
      "A save is when someone bookmarks your post. A share is when they send it on. Retention (also called audience retention) and watch time describe how much of a video people keep watching before they leave. If many leave near the start, the opening may not be holding attention. Platforms often treat these as signs that content is worth showing to more people.",
  },
  {
    id: "term-093",
    category: "topic-4",
    term: "Hook",
    question: "What is a hook, and what does scroll-stopping mean?",
    answer:
      'A hook is the opening line or image of a post meant to make people stop and look. Example: "Most labels fail for one simple reason." A scroll-stopping post is one interesting enough that people pause instead of swiping past.',
  },
  {
    id: "term-094",
    category: "topic-4",
    term: "Call to action (CTA)",
    question:
      "What is a call to action (CTA), a CTA post and a call-to-action button?",
    answer:
      'A call to action tells people what to do next. Example: "Message us for a quote" or "Link in bio". A CTA post is a post that includes a clear next step, such as contacting you, visiting a page or requesting a quote. Without one, interested people may not know how to take the next step, though a post can still be useful without one, depending on its purpose. On a website, a call-to-action button invites a next step, such as Request a Quote. It should stand out and say what will happen. If it looks like any other link, visitors may not know where to go.',
  },
  {
    id: "term-095",
    category: "topic-4",
    term: "Comment hook",
    question:
      "What is a comment hook, and what do the Posts with CTA and Posts with comment hook percentages mean?",
    answer:
      'A comment hook is a question or prompt that invites people to reply. Example: "Which finish do you prefer, matte or gloss?" The Posts with CTA and Posts with comment hook percentages show how many of your analysed posts included a call to action or a prompt to comment. Example: 52% means just over half of the posts did.',
  },
  {
    id: "term-096",
    category: "topic-4",
    term: "Reel",
    question: "What is a Reel?",
    answer:
      "A reel is a short video on Instagram, usually shown in a scrolling feed. Reels are often seen by people who do not follow you yet, so they are a common way to be discovered. Example: a 20-second clip of your team making a product.",
  },
  {
    id: "term-097",
    category: "topic-4",
    term: "Carousel",
    question: "What is a carousel?",
    answer:
      "A carousel is a single post with several images or pages that people swipe through. On LinkedIn, these can also be documents.",
  },
  {
    id: "term-098",
    category: "topic-4",
    term: "Captions and hashtags",
    question: "What is a caption and what are hashtags?",
    answer:
      "A caption is the text written with a post. Hashtags are words starting with the # symbol that group posts by topic so people can discover them.",
  },
  {
    id: "term-099",
    category: "topic-4",
    term: "Transcript analysis",
    question: "What is transcript analysis, and what are video insights?",
    answer:
      "Transcript analysis means turning the spoken words in a video into text and reviewing the message. The report uses it to understand what a video is saying. Video insights are observations drawn from video content the report could reach, such as the spoken words and the topic. If the video could not be accessed, the review may be incomplete.",
  },
  {
    id: "term-100",
    category: "topic-4",
    term: "Visual analysis and visual insights",
    question: "What are visual analysis and visual insights?",
    answer:
      "Visual analysis is a review of what a post's images or video frames show: what is pictured, the subject, layout, any text on screen and the overall look. Visual insights are the observations that come out of it. They describe the picture, not how every viewer will react. Where the report says Visual Insight: Unavailable, the visuals could not be reviewed.",
  },
  {
    id: "term-101",
    category: "topic-4",
    term: "Media understanding and creative analysis",
    question:
      'What are media understanding, media analysis and "Creative elements analyzed"?',
    answer:
      "Media analysis means reviewing what is inside a post, such as the picture, video frames, spoken words and caption. This can reveal details a text-only review would miss. Media understanding describes how many posts were reviewed using captions, images and spoken words together, so it tells you how complete the review was. Creative elements analyzed is the number of pieces inside a post that were reviewed, such as images, video clips or spoken parts. A higher number means the review had more to work with. Example: a video reviewed from three parts shows 3.",
  },
  {
    id: "term-102",
    category: "topic-4",
    term: "Content angle",
    question: "What is a content angle?",
    answer:
      "A content angle is the main idea or approach of a post, such as a behind-the-scenes look or a customer story. Other means it did not fit a clear group.",
  },
  {
    id: "term-103",
    category: "topic-4",
    term: "Media format mix",
    question: "What are a media format mix and media mix?",
    answer:
      "It is the split between the types of posts you use, such as images, videos, carousels and multi-page posts. A varied mix keeps your feed interesting. More types are not always better. Pick formats that make your message clear and that your team can keep up.",
  },
  {
    id: "term-104",
    category: "topic-4",
    term: "On-image text and a logo lockup",
    question: "What are on-image text and a logo lockup?",
    answer:
      "On-image text is words placed on the picture itself so the message is clear even without the caption. A logo lockup is your logo placed neatly, often in a corner, so people know whose post it is.",
  },
  {
    id: "term-105",
    category: "topic-4",
    term: "Proof elements and proof content",
    question: "What are proof elements and proof content?",
    answer:
      "Proof content shows evidence that you deliver, such as customer results, reviews or finished work. Proof elements are the individual details inside a post that show your claim is true, such as a named client, a finished product, numbers or a customer quote.",
  },
  {
    id: "term-106",
    category: "topic-4",
    term: "Follower count",
    question: "What is follower count, and what does it tell me?",
    answer:
      "Follower count is how many accounts have chosen to follow your page. It tells you how big the audience is. It does not show how many are active, interested or likely to buy, and it does not prove people see every post, trust you or become customers. A smaller, interested audience can be worth more than a large, silent one. Read it together with engagement, posting patterns and your business goals.",
  },
  {
    id: "term-107",
    category: "topic-4",
    term: "Audience quality and audience-market fit",
    question: "What are audience quality and audience-market fit?",
    answer:
      "Audience quality describes how closely your followers match the people you want to reach and how actively they respond. Followers who ask questions or show interest are worth more than a large number with no connection to you. Audience-market fit means your followers are the same kind of people who would actually buy from you. A large audience of the wrong people does little for your business.",
  },
  {
    id: "term-108",
    category: "topic-4",
    term: "Posted limit: three months",
    question: "What does Posted limit: 3 months mean?",
    answer:
      "It means the report only looked at posts from about the last three months. Older posts are not included, so an account that posts rarely may show very few posts.",
  },
  {
    id: "term-109",
    category: "topic-4",
    term: "Image post",
    question: "What is an image post?",
    answer:
      "An image post is a social post whose main content is a picture or graphic. Clear images with a useful caption work best, since a picture alone may not explain why your offer matters.",
  },
  {
    id: "term-110",
    category: "topic-4",
    term: "Post-by-post content intelligence",
    question: "What is post-by-post content intelligence?",
    answer:
      "It is the report's separate review of each post. It can combine the caption, format, likely purpose, spoken words, visuals and suggested improvements. It explains why a post got a certain label.",
  },
  {
    id: "term-111",
    category: "topic-4",
    term: "LinkedIn company page",
    question:
      "What is a LinkedIn company page, and what is a LinkedIn Company Page Audit?",
    answer:
      "A LinkedIn company page represents a business on LinkedIn. It can describe the company and share updates for customers, partners and job seekers. It is different from a personal profile, which represents one person. The Company Page Audit reviews a business's public LinkedIn page and its posts, including activity, reactions, comments, reposts, posting rhythm and content mix. Results depend on which post details can be accessed.",
  },
  {
    id: "term-112",
    category: "topic-4",
    term: "LinkedIn personal profile",
    question:
      "What is a LinkedIn personal profile, and what is a LinkedIn Personal Profile Audit?",
    answer:
      "A personal profile represents one person, their experience and their posts. Posts from a personal profile can build recognition around that person's expertise, such as a founder's. The Personal Profile Audit reviews one person's LinkedIn posts and helps them see whether their posts share useful ideas, evidence and next steps. It differs from the Company Page Audit because it focuses on an individual rather than a business page. Both use the same posting and content mix guides, so results are easy to compare.",
  },
  {
    id: "term-113",
    category: "topic-4",
    term: "Stable and Problem labels",
    question:
      "What do the Stable and Problem labels mean in the LinkedIn audit?",
    answer:
      "They are quick labels. Stable means the area looks acceptable. Problem means it needs attention. Read the numbers beside them, and remember a label based on five posts is less certain than one based on many. In the sample, Follower Availability: Stable means the report could still review reactions, comments and reposts even without the follower numbers it wanted for a follower-based rate. It does not prove the follower count is healthy. Post Understanding: Stable means no major issue was found in the post details the report could check. Some posts in the sample could not be fully read because only links were available. It describes the evidence available.",
  },
  {
    id: "term-114",
    category: "topic-4",
    term: "Content mix: 60/20/20",
    question:
      "What is the 60/20/20 mix, and what does an imbalanced content mix mean?",
    answer:
      "The 60/20/20 mix is the suggested split in your report: about 60% of posts for discovery (TOFU), 20% for exploring (MOFU) and 20% for deciding (BOFU). It keeps your feed from being all selling or all general chat. An imbalanced content mix means your split is far from that. Example: Funnel Imbalance: TOFU 24%, MOFU 56%, BOFU 20% means about a quarter of the checked posts were for people discovering a topic, over half were for people comparing options, and a fifth were for people ready to decide. The mix leans toward the middle stage and has too little content for newcomers, which suggests adding more introductory content.",
  },
  {
    id: "term-115",
    category: "topic-4",
    term: "Instagram Audit",
    question: "What is an Instagram Audit?",
    answer:
      "It reviews an Instagram account's recent posts, followers, reactions, posting rhythm and content mix. It helps spot patterns to look into, though a small sample may not show long-term performance.",
  },

  // Content Funnel: source questions and their complete explanations.
  {
    id: "term-116",
    category: "topic-5",
    term: "Content funnel",
    question: "What is a content funnel, and what is a customer journey?",
    answer:
      "A customer journey is the path a person takes from noticing a need, to learning about options, choosing a provider, and sometimes returning. People do not always follow the same order. A content funnel is a way of describing that journey, from first hearing about you to choosing you. Content is sorted by what it is meant to do at each step. These steps are not rules that every person must follow.",
  },
  {
    id: "term-117",
    category: "topic-5",
    term: "TOFU (Top of the Funnel)",
    question:
      "What is TOFU (Top of the Funnel), also called awareness-stage content?",
    answer:
      "TOFU is content for people just discovering a problem or topic, who are not ready to buy. It helps someone recognise a problem or learn about a topic. Examples: a post showing how a product is made, beginner guides, common mistakes and simple answers to frequent questions. The goal is to be noticed and helpful.",
  },
  {
    id: "term-118",
    category: "topic-5",
    term: "MOFU (Middle of the Funnel)",
    question:
      "What is MOFU (Middle of the Funnel), also called consideration-stage content?",
    answer:
      "MOFU is content for people who are exploring ways to solve their problems and comparing options. It may explain alternatives, show how a service works or answer practical worries. Example: a post explaining how a printing method makes labels last longer. The goal is to build understanding and trust and to help people choose wisely, not to pressure them.",
  },
  {
    id: "term-119",
    category: "topic-5",
    term: "BOFU (Bottom of the Funnel)",
    question:
      "What is BOFU (Bottom of the Funnel), also called decision-stage content?",
    answer:
      "BOFU is content for people close to choosing a provider. It helps them choose a specific provider or next step, using examples of work, customer feedback, clear service details or a quote request. Example: a post about a 20-year customer partnership, with a clear way to get in touch. It should make the next action and the reasons to trust you easy to see.",
  },
  {
    id: "term-120",
    category: "topic-5",
    term: "Funnel labels in your report",
    question: "Where do posts get their TOFU, MOFU or BOFU label in my report?",
    answer:
      "Each analysed post is sorted into TOFU, MOFU or BOFU and compared with the suggested 60/20/20 split. Captions are used, and where available, spoken words and visuals too. If one stage is far too big, the report flags it. Example: too many sales posts are flagged as too sales heavy. The label is a guide, not a strict rule.",
  },
  {
    id: "term-121",
    category: "topic-5",
    term: "Testimonial",
    question: "What is a testimonial?",
    answer:
      "A testimonial is a statement from a happy customer about their experience with you.",
  },
  {
    id: "term-122",
    category: "topic-5",
    term: "Case study",
    question: "What is a case study?",
    answer:
      "A case study is a short story of how you helped a customer: the problem, what you did and the result.",
  },
  {
    id: "term-123",
    category: "topic-5",
    term: "Thought leadership",
    question: "What is thought leadership?",
    answer:
      "Thought leadership is sharing useful knowledge and opinions that show you understand your field well. Example: a guide to choosing the right material for outdoor labels.",
  },
  {
    id: "term-124",
    category: "topic-5",
    term: "Sales-heavy or sales-led content",
    question:
      "What is sales-heavy or sales-led content, and how is it different from informative content?",
    answer:
      "Sales-led content focuses on a product, offer or reason to enquire. Sales-heavy content mostly asks people to buy, book or enquire. Some sales posts are useful for people ready to act, but a feed made only of promotions leaves little room for advice, proof or conversation, and people who are still learning may lose interest. Informative content helps people understand a problem or compare approaches. Both help when matched to the reader's situation.",
  },
  {
    id: "term-125",
    category: "topic-5",
    term: "Content mix",
    question: "What is content mix?",
    answer:
      "It is the balance of different kinds of posts in an account, such as tips, examples of work, behind-the-scenes updates, customer stories and offers. The right mix depends on what your audience needs.",
  },

  // Google Business Profile and Local Search: source questions and their complete explanations.
  {
    id: "term-126",
    category: "topic-6",
    term: "Google Business Profile (GBP or GMB)",
    question:
      "What is a Google Business Profile (GBP or GMB), and what is a Google Business Profile audit?",
    answer:
      "A Google Business Profile is the free listing that appears on Google Search and Maps when people look for your business. It shows your address, phone number, hours, photos and reviews. Some reports abbreviate it as GBP or GMB. GMB stands for Google My Business, the earlier name for what Google now calls Google Business Profile. Flawdits uses GMB in the name of its Google listing check, which looks at one listing at a time. The audit checks the business details shown on Google Search and Maps, such as category, hours, description, photos and reviews. It finds missing or inconsistent details but cannot guarantee a map position.",
  },
  {
    id: "term-127",
    category: "topic-6",
    term: "Local search",
    question: "What is local search, and what is local search visibility?",
    answer:
      'Local search is when people look for businesses near them, such as "printer near me". Google shows nearby results, often with a map. Local search visibility is how easily your business appears when people look for nearby services in an area. It depends on how accurate your profile is, how relevant it is to the search, location and reviews. A score is an indicator, not a guaranteed map position.',
  },
  {
    id: "term-128",
    category: "topic-6",
    term: "Local pack",
    question: "What is the local pack?",
    answer:
      "The local pack is the short list of three or so businesses with a map shown at the top of local searches. Appearing there brings strong attention, but nobody can promise a spot.",
  },
  {
    id: "term-129",
    category: "topic-6",
    term: "Business listings and local presence",
    question:
      "What are a business listing, an online business directory and local presence?",
    answer:
      "A business listing is an entry about your business on a website or online directory, with details such as your name, address and phone number. Example: your Google listing or an entry in a local business directory. An online business directory is a website that lists businesses by name, place or service, often with contact details and reviews. Local presence is how a business appears to people searching in its area, including its map listing, reviews, website and directory entries. Customers use these to check you out before they get in touch, so correct, matching details help people find the right business and know you serve them.",
  },
  {
    id: "term-130",
    category: "topic-6",
    term: "NAP consistency",
    question: "What is NAP consistency?",
    answer:
      "NAP stands for name, address and phone number. Consistency means these details are exactly the same everywhere online. Mismatches can confuse both customers and search tools.",
  },
  {
    id: "term-131",
    category: "topic-6",
    term: "Profile Score",
    question: "What is the Profile Score, and what does Grade B mean?",
    answer:
      "The Profile Score is a number out of 100 showing how complete and strong your Google listing is. Example: 73/100, Grade B, means a good listing with gaps to fill. In the sample report, Grade B is the profile's overall label. It has some strong points but still has gaps. Use the separate scores to find the weaker part.",
  },
  {
    id: "term-132",
    category: "topic-6",
    term: "Profile Completeness",
    question: "What is Profile Completeness?",
    answer:
      "It shows how many of the available details you have filled in, such as description, hours and category. A missing description lowers this.",
  },
  {
    id: "term-133",
    category: "topic-6",
    term: "Reviews, ratings and stars",
    question:
      "What do Reviews and Ratings, star rating and business reviews mean?",
    answer:
      "Business reviews are comments and ratings customers leave about their experience. They help others see what you do well. Respond honestly and never pressure people into leaving positive ones. The star rating is a summary of customers' ratings on a five-star scale. It gives a quick impression, but the number of reviews, how recent they are and what customers say also matter. Reviews and Ratings in the report reflects how many reviews you have and how high the star rating is. Both matter. A great rating from only a few reviewers looks less convincing than the same rating from many.",
  },
  {
    id: "term-134",
    category: "topic-6",
    term: "Photos and Media",
    question:
      "What does Photos and Media mean, and what does 34 photos versus a competitor median of 20 mean?",
    answer:
      "Photos and Media reflects the pictures and videos on your listing. Real photos help customers picture what to expect. In the sample, 34 photos versus a competitor median of 20 means the profile is ahead on photos. More is not automatically better. Photos should be current and useful.",
  },
  {
    id: "term-135",
    category: "topic-6",
    term: "Primary category",
    question: "What is a primary category?",
    answer:
      "It is the main label describing your business type on Google, such as Commercial printer. It helps Google decide which searches to show you for.",
  },
  {
    id: "term-136",
    category: "topic-6",
    term: "Business description",
    question:
      "What is a business description, and what does keyword-rich mean?",
    answer:
      "A business description is a short text about what you do, shown on your listing under From the business. Clear wording helps customers and Google understand you. Keyword-rich means using the same words customers actually search for, naturally. It should still read like normal writing, not a list of repeated phrases.",
  },
  {
    id: "term-137",
    category: "topic-6",
    term: "Review acquisition",
    question: "What is review acquisition?",
    answer:
      "It is the effort of getting more customer reviews, for example asking happy customers after a job. Follow Google's rules and never offer rewards in a way that breaks them.",
  },
  {
    id: "term-138",
    category: "topic-6",
    term: "Geotagged photos",
    question: "What are geotagged photos?",
    answer:
      "These are photos with the place they were taken saved inside them. The report suggests this can help link your photos to your area, though results vary.",
  },
  {
    id: "term-139",
    category: "topic-6",
    term: "Alt text",
    question: "What is alt text?",
    answer:
      "Alt text is a short written description of an image. It helps people who use screen readers, tools that read a page aloud for people who cannot see well. It also gives search tools a clue about what the picture shows. Example: black control panel overlay with blue buttons.",
  },
  {
    id: "term-140",
    category: "topic-6",
    term: "Google Posts and Q&A",
    question: "What are Google Posts and Q&A?",
    answer:
      "Google Posts are short updates you publish on your listing, like news or offers. Q&A lets people ask questions about your business, which you can answer.",
  },
  {
    id: "term-141",
    category: "topic-6",
    term: "UTM tags",
    question: "What are the UTM tags in my website link?",
    answer:
      "UTM tags are extra bits added to the end of a web address, such as utm_source=google. They let the website's visitor-counting tool show which link brought each visitor, without changing what the visitor sees. Example: it can show that a visit came from your Google listing.",
  },
  {
    id: "term-142",
    category: "topic-6",
    term: "Service area",
    question: "What is a service area?",
    answer:
      "It is the place or places a business serves. It matters most for businesses that travel to customers. It should reflect where you can really provide your service.",
  },
  {
    id: "term-143",
    category: "topic-6",
    term: "Multi-location business",
    question: "What is a multi-location business?",
    answer:
      "It is a business with more than one shop, office or clinic. Each location needs its own accurate details, such as hours and phone number.",
  },
  {
    id: "term-144",
    category: "topic-6",
    term: "Review counts versus competitors",
    question: "What does 15 reviews versus a competitor median of 51 mean?",
    answer:
      "The sample business has 15 reviews while the middle competitor has 51. You have fewer reviews than the typical rival in that group. It may point to a chance to invite honest feedback from happy customers.",
  },
  {
    id: "term-145",
    category: "topic-6",
    term: "Review response",
    question: "What is a review response?",
    answer:
      "It is your public reply to a customer's review. Thank people for praise and answer concerns calmly. Protect privacy and avoid arguing.",
  },

  // Website Design and User Experience: source questions and their complete explanations.
  {
    id: "term-146",
    category: "topic-7",
    term: "UI/UX audit",
    question: "What are a UI/UX audit, UI and UX?",
    answer:
      "UI means user interface, the visible parts people use on a website, such as menus, buttons, colours, layout and forms. UX means user experience, how easy and comfortable a website feels to use. A page can look attractive and still be frustrating. A UI/UX audit checks both.",
  },
  {
    id: "term-147",
    category: "topic-7",
    term: "UI/UX score breakdown",
    question:
      "What are the Overall, Visual Design, Usability, Accessibility and Performance scores?",
    answer:
      "They are separate scores out of 100. Visual Design is looks. Usability is ease of use. Accessibility is how well people with disabilities can use the site. Performance is speed. The overall UI/UX score combines them. A good overall number can hide one weak area, so look at the separate scores. Example: a UI/UX score of 68.5 out of 100 is the overall design and usability rating in the sample report. It does not mean 68.5% of visitors are satisfied.",
  },
  {
    id: "term-148",
    category: "topic-7",
    term: "Tech stack",
    question:
      "What is a tech stack, and what does a listed website technology tell me?",
    answer:
      "A tech stack is the set of tools and technologies used to build your website. It helps a developer understand what they are working with. A listed technology in the report is what the scan believes is used on your site. It does not reveal the full setup or prove the technology causes a problem. A developer can confirm.",
  },
  {
    id: "term-149",
    category: "topic-7",
    term: "CMS and WordPress",
    question: "What are CMS and WordPress?",
    answer:
      "A CMS (content management system) is software that lets you edit your website without coding. WordPress is a very popular one.",
  },
  {
    id: "term-150",
    category: "topic-7",
    term: "HTML, CSS, JavaScript and jQuery",
    question:
      "What are HTML, CSS, JavaScript and jQuery (including HTML5 and CSS3)?",
    answer:
      "HTML builds the content and basic structure of a page and tells a browser what it contains. HTML5 is a modern version. CSS controls how pages look, including colours, spacing and text styles. CSS3 is the common name for its modern features. JavaScript makes a page interactive. jQuery is a helper tool that makes JavaScript easier to write. You do not need to know code to read the audit.",
  },
  {
    id: "term-151",
    category: "topic-7",
    term: "Analytics and tracking scripts",
    question:
      "What are analytics and tracking, Google Analytics, Google Tag Manager and third-party tracking scripts?",
    answer:
      "Analytics and tracking tools record activity such as visits and page views so a business can see how people use its site. Google Analytics counts and describes your website visitors. Google Tag Manager is a control panel for adding tracking tools. A third-party tracking script is code from an outside service that runs on your site, often to measure activity. Too many, or slow ones, can slow a page, so keep the useful ones. They need to be set up correctly, and blockers can make the data incomplete.",
  },
  {
    id: "term-152",
    category: "topic-7",
    term: "Colour palette",
    question: "What is a colour palette and what is contrast?",
    answer:
      "A palette is the set of colours a site uses. Contrast is the difference between text and its background. Light grey words on white are hard to read.",
  },
  {
    id: "term-153",
    category: "topic-7",
    term: "Accessibility and WCAG 2.1 AA",
    question: "What are accessibility and WCAG 2.1 AA?",
    answer:
      "Accessibility means making a website usable by as many people as possible, including people with disabilities, through readable contrast, labels on form fields and keyboard-friendly controls. WCAG is a worldwide guide for making websites usable by people with disabilities. 2.1 AA is a commonly expected level.",
  },
  {
    id: "term-154",
    category: "topic-7",
    term: "ARIA, keyboard navigation and screen readers",
    question:
      "What are ARIA attributes, keyboard navigation and screen readers?",
    answer:
      "A screen reader is a tool that reads a web page aloud for people who cannot see it well. ARIA attributes are hidden labels in a page that tell screen readers what each button or menu does. Keyboard navigation means someone can use the whole site with the keyboard alone, without a mouse. Websites need clear labels and structure for these to work properly, which is why accessibility checks matter.",
  },
  {
    id: "term-155",
    category: "topic-7",
    term: "Typography and visual hierarchy",
    question: "What is typography and visual hierarchy?",
    answer:
      "Typography is the style and size of text. Visual hierarchy is arranging it so the most important things stand out, like headings you can scan quickly.",
  },
  {
    id: "term-156",
    category: "topic-7",
    term: "Layout, grids and iconography",
    question: "What are layout and grid, and iconography?",
    answer:
      "Layout and grid is how items are arranged and spaced on a page. Iconography is the small symbols used, which look best when they share one style.",
  },
  {
    id: "term-157",
    category: "topic-7",
    term: "Information architecture",
    question: "What is information architecture?",
    answer:
      "It is how your site's pages are organised and labelled so visitors find things quickly, like signs in a shop.",
  },
  {
    id: "term-158",
    category: "topic-7",
    term: "Navigation and mega-dropdown menus",
    question:
      "What are navigation, navigation mechanics and mega-dropdown menus?",
    answer:
      "Navigation is the menu and the ways people move around a site, such as menus, links and dropdowns. A mega-dropdown is a big menu that opens on hover. It can be hard to use on touch screens, which have no hover, so a menu that only works with a mouse may be hard to use on a phone or tablet.",
  },
  {
    id: "term-159",
    category: "topic-7",
    term: "Forms, validation and error prevention",
    question:
      "What are forms, inputs, inline validation, focus rings, input masking and error prevention?",
    answer:
      "Forms are where people type and send information, and inputs are the individual boxes, such as name or phone number. Clear labels and only necessary questions make them easier. Inline validation checks answers as people type and flags mistakes straight away. A focus ring is an outline showing which box is active. Input masking guides how details are typed, such as formatting a phone number. Error prevention means stopping mistakes before they happen and explaining them clearly if they do.",
  },
  {
    id: "term-160",
    category: "topic-7",
    term: "Microinteractions and microcopy",
    question: "What are microinteractions and microcopy?",
    answer:
      "Microinteractions are small reactions such as a button changing colour when pressed. Microcopy is small pieces of text like button labels and error messages.",
  },
  {
    id: "term-161",
    category: "topic-7",
    term: "User flow and friction",
    question: "What are user flow and friction?",
    answer:
      "User flow is the path a visitor takes to finish a task, like asking for a quote. Friction is anything that makes it harder or slower, such as retyping details.",
  },
  {
    id: "term-162",
    category: "topic-7",
    term: "Conversions and website funnels",
    question: "What is a conversion and a conversion funnel on a website?",
    answer:
      "A conversion is when a visitor does what you want, like sending an enquiry. The conversion funnel is the series of steps leading to that. Fewer obstacles means more people finish.",
  },
  {
    id: "term-163",
    category: "topic-7",
    term: "Scannability",
    question: "What is scannability?",
    answer:
      "It is how easily people can skim a page and find what they need, using headings, short paragraphs and lists.",
  },
  {
    id: "term-164",
    category: "topic-7",
    term: "Mobile viewports and responsive design",
    question:
      "What are mobile viewports, tap targets, breakpoints and responsive design?",
    answer:
      "A viewport is the visible screen area. Tap targets are the buttons and links you press with a finger. If they are tiny or too close together, people tap the wrong thing. Responsive design means a page adjusts to any screen size. Breakpoints are the screen widths where the layout changes. Problems between 768px and 1024px affect many tablets.",
  },
  {
    id: "term-165",
    category: "topic-7",
    term: "Perceived performance and cross-platform consistency",
    question: "What is perceived performance and cross-platform consistency?",
    answer:
      "Perceived performance is how fast a page feels to the visitor. Cross-platform consistency means the site looks and works well on phones, tablets and computers.",
  },
  {
    id: "term-166",
    category: "topic-7",
    term: "Pros and Cons",
    question: "What are Pros and Cons in the report?",
    answer:
      "Pros are things your site already does well. Cons are things holding it back. Both help you decide what to keep and what to fix.",
  },
  {
    id: "term-167",
    category: "topic-7",
    term: "Remediate, Refactor, Standardize and Normalize",
    question: "What do Remediate, Refactor, Standardize and Normalize mean?",
    answer:
      "Remediate means fix. Refactor means reorganizing how something is built without changing what it does. Standardize and normalize mean make items consistent.",
  },
  {
    id: "term-168",
    category: "topic-7",
    term: "B2B and RFQ",
    question: "What are B2B and RFQ?",
    answer:
      "B2B means business to business, a company that sells to other companies. RFQ means request for quotation, when a customer asks for a price for a job.",
  },
  {
    id: "term-169",
    category: "topic-7",
    term: "Frontend and frontend frameworks",
    question: "What are a frontend and a frontend framework?",
    answer:
      "The frontend is the part of a website visitors see and use: text, images, menus and buttons. A framework (or frontend framework) is a set of ready-made, reusable building blocks that helps developers build a site, especially the visible parts. If the report lists one, it is describing technology it believes is present, not a problem. Using one does not tell you whether the site is good.",
  },

  // Ads Library: source questions and their complete explanations.
  {
    id: "term-170",
    category: "topic-8",
    term: "Ads Library",
    question: "What is an Ads Library, and is it the same as running ads?",
    answer:
      "An Ads Library is a public collection of adverts that a business, or its competitors, are running. Platforms such as Meta provide one so anyone can see current ads. It is not the same as running ads. Running ads means paying to show them to people, while an Ads Library is the place where ads are listed so they can be viewed and studied. The report uses it to show what ideas are being tried.",
  },
  {
    id: "term-171",
    category: "topic-8",
    term: "Missing Asset",
    question: "What does Missing Asset mean?",
    answer:
      "It means something the report expected to find is not set up, or believes is absent, such as a photo, a page or a library of advertising examples (an Ads Library). The report should explain why it matters. It points to an opportunity, not necessarily a mistake.",
  },
  {
    id: "term-172",
    category: "topic-8",
    term: "Ad creative and creative fatigue",
    question:
      "What are ad creative, creative angles, converting ads and fatiguing ads?",
    answer:
      'Ad creative is everything people see in an advert: the picture or video, the words and the button. Example: a short clip of your product with the line "Order custom labels today". Different creatives can get very different results. A creative angle is the idea behind an ad. Converting means people took the action you wanted. Fatiguing means an ad has been seen so often that people stopped responding.',
  },
  {
    id: "term-173",
    category: "topic-8",
    term: "Core Risk in the Ads Library section",
    question:
      'What does the Core Risk in the Ads Library section mean, and what does "your ad creative is invisible" mean?',
    answer:
      'Core Risk explains what you lose without an Ads Library: you cannot see which ad ideas are working, which have worn out, or what competitors are testing right now. "Your ad creative is invisible" means people who research online before buying may not see your adverts. Because the ads cannot be seen or studied, you lose a chance to learn from them and improve. Both are warnings about missing information, not a problem with your business.',
  },
  {
    id: "term-174",
    category: "topic-8",
    term: "Ads Library competitor research",
    question: "How can an Ads Library help me learn from competitors?",
    answer:
      "It lets you look at the adverts other businesses are running at the moment. You can spot the messages and pictures they keep using, which often hints at what works for them. Use it for ideas, not for copying.",
  },

  // Brand and Business Terms: source questions and their complete explanations.
  {
    id: "term-175",
    category: "topic-9",
    term: "Brand consistency and brand drift",
    question: "What are brand consistency and brand drift?",
    answer:
      "Brand consistency means your business looks and sounds the same across your website, social media and listings. Example: same logo and colours everywhere. Brand drift happens when your look or message slowly becomes inconsistent across channels. Example: old logos or different descriptions of the same service on different pages.",
  },
  {
    id: "term-176",
    category: "topic-9",
    term: "Visual identity and brand colours",
    question: "What are visual identity and brand colours?",
    answer:
      "Visual identity is everything you can see about your brand. Brand colours are the specific colours you always use.",
  },
  {
    id: "term-177",
    category: "topic-9",
    term: "Visual Brand Match",
    question:
      "What is Visual Brand Match, and what are a moodboard, a brand vibe and a Brand Consistency Score?",
    answer:
      "Visual Brand Match compares how your website and Instagram look against your brand colours, style and the overall feel you want, called your vibe. You provide a website screenshot and an Instagram moodboard, and it gives one score, the Brand Consistency Score, for how well they match. A higher score means your brand looks more alike everywhere. A moodboard is a collection of images, colours and styles that shows the look and feel of a brand. A brand vibe is the overall feeling your brand gives off, such as warm, bold, calm or playful. It guides colours, photos and words.",
  },
  {
    id: "term-178",
    category: "topic-9",
    term: "Target audience and ideal customer profile",
    question: "What are a target audience and an ideal customer profile (ICP)?",
    answer:
      "A target audience is the group of people you most want to reach, such as small manufacturers who need durable labels. An ideal customer profile (ICP) is a description of the perfect customer for your business: their type, needs and situation. It helps you decide what to say and where to say it.",
  },
  {
    id: "term-179",
    category: "topic-9",
    term: "Prospects and leads",
    question: "What is the difference between a prospect and a lead?",
    answer:
      "A prospect is someone who looks like the kind of customer you want to serve and might buy from you. A lead is a prospect who has shown interest, for example by sending an enquiry, or who has been identified as a potential customer. Businesses use the terms a little differently, so it helps to agree on them. Neither guarantees a sale.",
  },

  // Parts of Your Report: source questions and their complete explanations.
  {
    id: "term-180",
    category: "topic-10",
    term: "Full Report (Comprehensive Digital Presence Analysis)",
    question:
      "What is the Full Report (Comprehensive Digital Presence Analysis)?",
    answer:
      "The Full Report is the complete report that brings all the checks together in one document: your website, social media pages, Google listing and website design. Each part has its own scores and suggested next steps, so you can read only the sections you care about and do not need a separate report for each channel. The areas included can change as Flawdits adds features, so check the current product page.",
  },
  {
    id: "term-181",
    category: "topic-10",
    term: "Website Anatomy",
    question: "What is Website Anatomy?",
    answer:
      "Website Anatomy is the section that breaks your website into its parts, much like an X-ray. It covers how trusted and visible your site is, which search phrases bring people in, how secure and fast it is, and how you appear in AI answers.",
  },
  {
    id: "term-182",
    category: "topic-10",
    term: "Social Media Anatomy",
    question: "What is Social Media Anatomy?",
    answer:
      "Social Media Anatomy is the section that breaks down a social media page in the same way. It looks at audience size, interaction, how often you post and what kinds of posts you share, with notes on each post.",
  },
  {
    id: "term-183",
    category: "topic-10",
    term: "Description and opening hours status",
    question: "What does Description: Missing or Hours Set: Yes mean?",
    answer:
      "These are quick yes or no checks on your Google listing. Description: Missing means the short text about your business has not been filled in. Hours Set: Yes means your opening hours are listed, which helps customers know when to contact you.",
  },

  // Flawdits Tools and Extra Terms: source questions and their complete explanations.
  {
    id: "term-184",
    category: "topic-11",
    term: "Audit modules and part reports",
    question: "What is an audit module, and what is a part report?",
    answer:
      "A module is one separate check inside Flawdits. You can run one on its own or combine them. The modules are Website Anatomy, GMB Audit, Instagram Audit, LinkedIn Company Page Audit, LinkedIn Personal Profile Audit, Visual Brand Match, AI Visibility Audit and the Ads Library check. The Full Report brings them together in one document. A part report is a report for one area, rather than the combined Full Report. Check the pricing page for exactly what is included in your plan.",
  },
  {
    id: "term-185",
    category: "topic-11",
    term: "Market capture",
    question: "What is market capture?",
    answer:
      "Market capture compares how much local attention your listing gets with other similar businesses. It helps you see how far ahead or behind you are, not just what is missing. Example: if rivals have far more reviews and photos, you are likely capturing less of the local market.",
  },
  {
    id: "term-186",
    category: "topic-11",
    term: "Canonical tag",
    question: "What is a canonical tag, and what is a duplicate URL risk?",
    answer:
      "Sometimes the same page can be reached at more than one web address. A canonical tag is a hidden note that tells search tools which address is the main one. Without it, they may treat copies as competing pages, which is the duplicate URL risk.",
  },
  {
    id: "term-187",
    category: "topic-11",
    term: "Point-in-time snapshot",
    question:
      "What does a point-in-time snapshot mean, and how often should I re-run a check?",
    answer:
      "A point-in-time snapshot means the result is true for the day it was checked. Things change, so scores can move up or down later. Example: after fixing a missing description, a new check will show a better result. Run a check again any time after you fix something to see the change. For AI visibility, a monthly or every-few-months check gives the clearest trend, because AI answers shift over time.",
  },

  // Reports, Scores and Priorities: source questions and their complete explanations.
  {
    id: "term-188",
    category: "topic-12",
    term: "Scan",
    question: "What is a scan?",
    answer:
      "A scan is an automatic check that collects information about a website or page. It can spot things like missing page details or slow replies without you checking each item by hand. It can still miss context that a person would notice.",
  },
  {
    id: "term-189",
    category: "topic-12",
    term: "Executive summary",
    question: "What is an executive summary?",
    answer:
      "It is the short opening section of a report. It pulls together the main results and most important next steps for someone who does not have time to read every page.",
  },
  {
    id: "term-190",
    category: "topic-12",
    term: "Client-ready PDF report",
    question: "What is a client-ready PDF report?",
    answer:
      "A PDF is a document that looks the same on almost any device. Client-ready means it is prepared clearly and neatly enough to share with a customer or prospect. Still read it through, and check it for errors and unsupported claims, before sharing it as your own advice.",
  },
  {
    id: "term-191",
    category: "topic-12",
    term: "Low score",
    question: "What does a low score mean?",
    answer:
      "A low score means the area was rated weakly by that check. It does not mean your whole business is poor, that every page has a problem, or that Google has punished your website. Read the findings to see why, then decide what matters most.",
  },
  {
    id: "term-192",
    category: "topic-12",
    term: "Overall health and digital presence scores",
    question:
      "What are an overall health score, an audit score breakdown and a digital presence score?",
    answer:
      "An overall health score combines several checks into one summary number. A digital presence score is the same idea across several parts of your online presence. It helps you see whether the broad picture looks strong or weak, but one number can hide differences. A site can score well overall and still have one urgent problem. An audit score breakdown splits the combined result into smaller parts. Example: a Google listing score may show separate results for completeness, reviews and photos, so you can see which part pulled the total up or down. Use the results of each area to understand what sits behind the number.",
  },
  {
    id: "term-193",
    category: "topic-12",
    term: "Authority & Visibility Overview",
    question: "What is the Authority & Visibility Overview?",
    answer:
      "It is the report section that puts key website and discovery numbers side by side, such as authority, keywords, estimated search visitors, linking websites and AI visibility. Later sections explain each number.",
  },
  {
    id: "term-194",
    category: "topic-12",
    term: "Additional Key Insights",
    question: "What are Additional Key Insights?",
    answer:
      "These are short summaries of patterns the report noticed, such as irregular posting or too much reliance on people who already know your name. Treat them as clues to look into.",
  },
  {
    id: "term-195",
    category: "topic-12",
    term: "Impact and Estimated Impact",
    question:
      "What does impact mean in a report, and what does Estimated Impact mean?",
    answer:
      "Impact explains what could happen if a finding is left alone. Example: a confusing enquiry form may make it harder for customers to contact you. It describes a likely risk, not proof that sales have already been lost. Estimated Impact, in the Ads Library section, is a general figure that shows why a missing item matters, for example how many shoppers research online before buying. It is not a promise or a measure of your own results.",
  },
  {
    id: "term-196",
    category: "topic-12",
    term: "Quick wins and long-term improvements",
    question: "What are a quick win and a long-term improvement?",
    answer:
      "A quick win is a useful improvement that takes little time or effort, such as completing a missing business description. Choose them because they help customers, not just because they are easy. A long-term improvement is a change that needs more planning or ongoing work, such as redesigning a mobile layout or improving content across many pages. These are usually planned after urgent problems are dealt with.",
  },
  {
    id: "term-197",
    category: "topic-12",
    term: "Scores and grades",
    question: "What is the difference between a score and a grade?",
    answer:
      "A score is a number. A grade is a short letter label, such as A, B or C, that makes the result quick to scan. The number and findings behind it give the detail.",
  },
  {
    id: "term-198",
    category: "topic-12",
    term: "Free Website Audit Tool",
    question: "What is the Free Website Audit Tool?",
    answer:
      "It is the website-checking option Flawdits offers for a first look at possible website issues. It helps surface items to review, but it is a starting point, not a promise that every problem was found.",
  },

  // Brand, Design and Usability: source questions and their complete explanations.
  {
    id: "term-199",
    category: "topic-13",
    term: "Brand and brand identity",
    question: "What is a brand, and what is brand identity?",
    answer:
      "A brand is the overall impression people have of a business, shaped by its name, products, service, communication and look. It is more than a logo. Brand identity is how your business presents itself: name, logo, colours, style and tone of voice. It helps people recognise you.",
  },
  {
    id: "term-200",
    category: "topic-13",
    term: "Brand guide",
    question: "What is a brand guide?",
    answer:
      "It is a set of rules for using your logo, colours, fonts, pictures and tone of voice, so everyone creates material that looks like it belongs to one business.",
  },
  {
    id: "term-201",
    category: "topic-13",
    term: "Low design, usability and accessibility scores",
    question:
      "What do low Visual Design, Usability, Accessibility and UI/UX Performance scores mean?",
    answer:
      "A low Visual Design score suggests problems with how the site looks or organises information, such as hard-to-read text or uneven spacing. A low Usability score suggests visitors may struggle to find information or finish tasks, because of confusing menus, long forms or buttons that do not stand out. A low Accessibility score suggests some people may find the site harder to use, including people with sight, hearing or movement needs. Issues may include low text contrast or buttons that cannot be reached with a keyboard. The UI/UX Performance score summarises how well the site seems to work while people use it, such as visible loading delays. For all of them, use the specific notes to see what to fix.",
  },
  {
    id: "term-202",
    category: "topic-13",
    term: "Usability",
    question: "What is usability?",
    answer:
      "It is how easily people can do what they came to do. Example: finding service details and sending an enquiry without guessing.",
  },
  {
    id: "term-203",
    category: "topic-13",
    term: "Imagery and graphics",
    question: "What are imagery and graphics?",
    answer:
      "They are the photos, illustrations and diagrams on a page. They should support your message and look consistent in size and style.",
  },
  {
    id: "term-204",
    category: "topic-13",
    term: "Brand voice",
    question: "What is brand voice?",
    answer:
      "It is the style and personality of your words. A manufacturer may sound clear and practical, while a children's activity brand may sound playful.",
  },
  {
    id: "term-205",
    category: "topic-13",
    term: "Brand positioning",
    question: "What is brand positioning?",
    answer:
      "It is the place you want to hold in a customer's mind compared with other options: who you serve and what you are known for. Example: a printer known for fast industrial orders.",
  },
  {
    id: "term-206",
    category: "topic-13",
    term: "Brand message",
    question: "What is a brand message?",
    answer:
      "It is a key idea you want people to remember about you, such as what you do and who you help. It should match your actual service.",
  },
  {
    id: "term-207",
    category: "topic-13",
    term: "Value proposition",
    question: "What is a value proposition?",
    answer:
      "It is a simple explanation of the benefit a customer can expect and why your offer suits them. Example: help choosing the right material plus reliable delivery.",
  },
  {
    id: "term-208",
    category: "topic-13",
    term: "Brand trust",
    question: "What is brand trust?",
    answer:
      "It is people's confidence that you will do what you say. Clear information, honest claims and consistent presentation all help.",
  },
  {
    id: "term-209",
    category: "topic-13",
    term: "Page experience",
    question: "What is page experience?",
    answer:
      "It is how a page feels to a visitor: loading smoothly, working on a phone and behaving as expected. A page with great information can still frustrate people if buttons are hard to tap.",
  },

  // Business, Agency and Sales Terms: source questions and their complete explanations.
  {
    id: "term-210",
    category: "topic-14",
    term: "Lead generation",
    question: "What is lead generation?",
    answer:
      "Lead generation means finding and attracting potential customers so you can start a conversation with them. It can include useful content, website enquiries, referrals or direct outreach. A lead is not a sale; the person still has to decide.",
  },
  {
    id: "term-211",
    category: "topic-14",
    term: "Digital marketing",
    question: "What is digital marketing?",
    answer:
      "It means using online channels to help people discover, understand and choose a business, such as websites, search results, social media, email, online listings and paid ads. The right mix depends on your customers.",
  },
  {
    id: "term-212",
    category: "topic-14",
    term: "Pitch",
    question: "What is a pitch, and what does 3.4x Pitch Lift mean?",
    answer:
      "A pitch is a short explanation of why someone should consider your service. An agency may use an audit report in a pitch to show a prospect specific areas to improve. It supports the conversation but does not replace listening to the prospect. 3.4x Pitch Lift is a figure shown on Flawdits pages about how audit reports may help a pitch. Treat it as an indication, not a promise that your pitches will improve by that amount.",
  },
  {
    id: "term-213",
    category: "topic-14",
    term: "Proposal",
    question: "What is a proposal?",
    answer:
      "A proposal is a document that explains the work you recommend, what it will cost and what the customer can expect. An audit can strengthen it by showing specific findings and actions.",
  },
  {
    id: "term-214",
    category: "topic-14",
    term: "Client onboarding",
    question: "What is client onboarding?",
    answer:
      "It is the process of starting work with a new customer: agreeing goals, gathering information, confirming scope and deciding how progress will be shared. A clear process reduces confusion.",
  },
  {
    id: "term-215",
    category: "topic-14",
    term: "Retainer",
    question: "What is a retainer?",
    answer:
      "A retainer is an ongoing arrangement where a client pays a provider for continuing work, often monthly. The agreement should say what is included and how extra tasks are handled.",
  },
  {
    id: "term-216",
    category: "topic-14",
    term: "Client reporting",
    question: "What is client reporting?",
    answer:
      "It means sharing progress, findings, completed work and next steps with a client in a way they can act on. Good reports separate measured results from estimates and recommendations.",
  },
  {
    id: "term-217",
    category: "topic-14",
    term: "Competitive intelligence",
    question: "What is competitive intelligence?",
    answer:
      "It means collecting and reviewing public information about other businesses in your market, such as their services, messages, reviews and online visibility. Use it to make better decisions, not to assume rivals are always right.",
  },
  {
    id: "term-218",
    category: "topic-14",
    term: "Agencies, freelancers and consultants",
    question: "What are an agency and a freelancer or consultant?",
    answer:
      "An agency is a business that provides services to other businesses, such as marketing, design or social media support. Agencies may use audit reports to understand a prospect's needs or report work to clients. A freelancer or consultant is a person who provides services independently rather than as a full-time employee. They may advise on strategy or carry out specialist work. Flawdits has pages describing how they can use its reports.",
  },
  {
    id: "term-219",
    category: "topic-14",
    term: "Reports versus implementation",
    question: "What is the difference between a report and making the changes?",
    answer:
      "A report finds possible issues and suggests actions. Making the changes means carrying them out on your website, social account or listing. Some fixes need a developer or marketer.",
  },
  {
    id: "term-220",
    category: "topic-14",
    term: "Niche",
    question: "What is a niche?",
    answer:
      "A niche is a specific part of a market or group of customers you choose to serve. Example: printing labels for industrial equipment rather than every type of printing.",
  },
  {
    id: "term-221",
    category: "topic-14",
    term: "Return on effort",
    question: "What is return on effort?",
    answer:
      "It is an informal way to compare the work an action needs with the benefit it may bring. Example: correcting a wrong phone number takes little time and can stop customers calling the wrong place.",
  },
  {
    id: "term-222",
    category: "topic-14",
    term: "Cold outreach",
    question: "What is cold outreach?",
    answer:
      "It is contacting someone who has not asked to hear from you, often to introduce a service. A relevant, respectful message explains why you are getting in touch and lets the person say no.",
  },
  {
    id: "term-223",
    category: "topic-14",
    term: "Personal brand",
    question: "What is a personal brand?",
    answer:
      "It is the professional impression people form of an individual from their expertise, communication and work. A LinkedIn profile is one place it is shaped. Present real skills honestly.",
  },
  {
    id: "term-224",
    category: "topic-14",
    term: "ICP Audit",
    question: "What is an ICP Audit?",
    answer:
      "ICP stands for ideal customer profile. An ICP Audit would look at how clearly a business describes the customers it serves best, such as their industry, size, needs and location.",
  },
  {
    id: "term-225",
    category: "topic-14",
    term: "Sentiment Analysis",
    question: "What is Sentiment Analysis?",
    answer:
      "It tries to tell whether comments, reviews or messages sound positive, negative or neutral. Example: grouping feedback about a late delivery as negative. Sarcasm and context can be hard to read.",
  },
  {
    id: "term-226",
    category: "topic-14",
    term: "Brand Financial Audit",
    question: "What is a Brand Financial Audit?",
    answer:
      "It is a planned check connected with the money side of a brand. Details are not yet published.",
  },
  {
    id: "term-227",
    category: "topic-14",
    term: "Ads Audit",
    question: "What is an Ads Audit?",
    answer:
      "An Ads Audit generally reviews paid advertising: the ads shown, the message, the intended audience and how results are measured.",
  },
  {
    id: "term-228",
    category: "topic-14",
    term: "YouTube Audit",
    question: "What is a YouTube Audit?",
    answer:
      "It generally reviews a YouTube channel: how clearly it is presented, how regularly videos are posted and how titles and descriptions help viewers.",
  },
  {
    id: "term-229",
    category: "topic-14",
    term: "Cybersecurity Audit",
    question: "What is a Cybersecurity Audit?",
    answer:
      "It is a structured review of how a website or business protects its systems, accounts and information, including access, updates and settings.",
  },
];
