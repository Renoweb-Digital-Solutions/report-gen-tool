import PricingClient from '../components/pricing/PricingClient';

export const metadata = {
  title: 'Flawdits Pricing: Digital Audit Report Plans for Agencies',
  description: 'Compare Flawdits pricing plans for free, freelancer and agency-level digital presence audit reports no credit card required to start.',
  keywords: ['digital audit tool pricing', 'white label audit tool pricing', 'SEO social brand audit pricing', 'Vendasta Snapshot alternative pricing'],
  alternates: {
    canonical: 'https://flawdits.com/pricing',
  },
  openGraph: {
    title: 'Flawdits Pricing: Digital Audit Report Plans for Agencies',
    description: 'Compare Flawdits pricing plans for free, freelancer and agency-level digital presence audit reports no credit card required to start.',
    url: 'https://flawdits.com/pricing',
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
