import CompareClient from '../components/compare/CompareClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { COMPARISONS } from '../data/comparisons';

export const metadata = {
  title: 'Flawdits vs Competitors: Digital Audit Tool Comparisons',
  description: 'Compare Flawdits digital audit report suite against LeadsGorilla, Similarweb, and Semrush. See feature breakdowns, pricing, and report depth.',
  alternates: {
    canonical: 'https://flawdits.com/compare/flawdits-vs-leadsgorilla',
  },
  openGraph: {
    title: 'Flawdits vs Competitors: Digital Audit Tool Comparisons',
    description: 'Compare Flawdits digital audit report suite against LeadsGorilla, Similarweb, and Semrush. See feature breakdowns, pricing, and report depth.',
    url: 'https://flawdits.com/compare/flawdits-vs-leadsgorilla',
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function CompareHubPage() {
  return (
    <>
      <Navbar />
      <CompareClient initialSlug="flawdits-vs-leadsgorilla" />
      <Footer />
    </>
  );
}
