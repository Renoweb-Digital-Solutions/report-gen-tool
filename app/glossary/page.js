/**
 * Public /glossary route, mounted by the Next.js App Router inside RootLayout.
 * Owns page metadata only; the browser-local reading experience and static PDF
 * content live in GlossaryClient and app/data/glossary.js. No backend is used.
 */
import GlossaryClient from "../components/glossary/GlossaryClient";

// ============================================================================
// SEARCH AND SHARING METADATA
// Keep the canonical URL aligned with the public navigation destination.
// ============================================================================
export const metadata = {
  title: "Digital Marketing & Audit Glossary | Flawdits",
  description:
    "Understand your digital presence report. Explore plain-language explanations of SEO, AI visibility, social media, local search, design, and business terms.",
  alternates: { canonical: "https://flawdits.com/glossary" },
  openGraph: {
    title: "A little clarity for every audit term | Flawdits Glossary",
    description:
      "Your plain-language guide to digital presence, from authority scores to website usability.",
    url: "https://flawdits.com/glossary",
    siteName: "Flawdits",
    type: "website",
  },
};

/** Render the glossary under the existing app providers and shared site chrome. */
export default function GlossaryPage() {
  return <GlossaryClient />;
}
