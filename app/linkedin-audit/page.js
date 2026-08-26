import FeatureClient from '../components/features/FeatureClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FEATURES } from '../data/features';

const data = FEATURES['linkedin-audit'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'LinkedIn company page audit tool', 'LinkedIn content audit'],
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

export default function LinkedinAuditPage() {
  return (
    <>
      <Navbar />
      <FeatureClient initialSlug="linkedin-audit" />
      <Footer />
    </>
  );
}
