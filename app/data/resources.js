// # Public resource collections
// Entries are intentionally empty until real articles and announcements exist.
// Add approved content here later, or pass the same shape from a future content
// source. Never create example articles just to fill the public empty state.
/** @typedef {{ id: string, title: string, summary: string, href: string, dateLabel?: string }} ResourceEntry */
/** @type {ResourceEntry[]} */
export const BLOG_ARTICLES = [];
/** @type {ResourceEntry[]} */
export const PRESS_RELEASES = [];

export const RESOURCE_PAGES = {
  blogs: {
    label: "Blogs",
    eyebrow: "The Flawdits journal",
    title: "A little insight.\nA clearer picture.",
    description:
      "Perspectives on websites, search, social, and the details that shape a brand’s digital presence.",
    collectionTitle: "Latest articles",
    emptyTitle: "No articles published yet.",
    emptyDescription:
      "This is where our ideas, practical guides, and product perspectives will live. There’s nothing to read here just yet, but you can explore the rest of Flawdits below.",
    footerNote: "Good ideas deserve a little space.",
    links: [
      { label: "Explore Flawdits", href: "/full-report" },
      { label: "Browse the glossary", href: "/glossary" },
    ],
  },
  press: {
    label: "Press and media",
    eyebrow: "From the Flawdits newsroom",
    title: "The latest from\nour side of the screen.",
    description:
      "A home for Flawdits announcements, company news, and stories worth sharing.",
    collectionTitle: "News & announcements",
    emptyTitle: "No announcements published yet.",
    emptyDescription:
      "When there’s news to share, you’ll find it here. Our newsroom is quiet for now. In the meantime, get to know Flawdits and the people behind it.",
    footerNote: "A space for the stories still to come.",
    links: [
      { label: "About Flawdits", href: "/about" },
      { label: "Contact us", href: "/contact" },
    ],
  },
};

// # Contact details stay unset until approved values are supplied. The renderer
// hides missing fields and shows one honest placeholder when none are available.
// Use a plain email address, a displayable phone number and a full address.
export const CONTACT_DETAILS = { email: null, phone: null, address: null };

// # Metadata follows the same canonical/Open Graph pattern as existing pages.
export function resourceMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: `https://flawdits.com${path}` },
    openGraph: {
      title,
      description,
      url: `https://flawdits.com${path}`,
      siteName: "Flawdits",
      type: "website",
    },
  };
}
