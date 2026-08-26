import SolutionClient from '../components/solutions/SolutionClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SOLUTIONS } from '../data/solutions';

const data = SOLUTIONS['for-agencies'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'white label digital audit tool for agencies', 'agency client reporting tool'],
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

export default function ForAgenciesPage() {
  return (
    <>
      <Navbar />
      <SolutionClient initialSlug="for-agencies" />
      <Footer />
    </>
  );
}
