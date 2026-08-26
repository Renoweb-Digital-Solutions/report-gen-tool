import FeatureClient from '../components/features/FeatureClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FEATURES } from '../data/features';

const data = FEATURES['visual-brand-match'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'visual brand consistency audit tool', 'brand identity audit'],
  alternates: {
    canonical: data.seo.url,
  },
  openGraph: {
    title: data.seo.metaTitle,
    description: data.seo.metaDescription,
    url: data.seo.url,
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function VisualBrandMatchPage() {
  return (
    <>
      <Navbar />
      <FeatureClient initialSlug="visual-brand-match" />
      <Footer />
    </>
  );
}
