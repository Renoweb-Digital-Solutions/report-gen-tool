import FeatureClient from '../components/features/FeatureClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FEATURES } from '../data/features';

const data = FEATURES['what-is-flawdits'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'digital presence audit', 'digital marketing audit tool'],
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

export default function WhatIsFlawditsPage() {
  return (
    <>
      <Navbar />
      <FeatureClient initialSlug="what-is-flawdits" />
      <Footer />
    </>
  );
}
