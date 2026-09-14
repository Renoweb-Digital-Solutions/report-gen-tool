import FeatureClient from '../components/features/FeatureClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FEATURES } from '../data/features';

const data = FEATURES['linkedin-personal-audit'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'LinkedIn personal audit tool', 'LinkedIn profile audit'],
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

export default function LinkedinPersonalAuditPage() {
  return (
    <>
      <Navbar />
      <FeatureClient initialSlug="linkedin-personal-audit" />
      <Footer />
    </>
  );
}
