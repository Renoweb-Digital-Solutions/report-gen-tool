import FeatureClient from '../components/features/FeatureClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FEATURES } from '../data/features';

const data = FEATURES['why-flawdits'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'why use a digital audit tool', 'flawdits benefits'],
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

export default function WhyFlawditsPage() {
  return (
    <>
      <Navbar />
      <FeatureClient initialSlug="why-flawdits" />
      <Footer />
    </>
  );
}
