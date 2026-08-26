import SolutionClient from '../../components/solutions/SolutionClient';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { SOLUTIONS } from '../../data/solutions';

const data = SOLUTIONS['flawdits-vs-vendasta-snapshot-report'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'Flawdits vs Vendasta Snapshot Report', 'Vendasta Snapshot Report alternative'],
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

export default function VendastaComparisonPage() {
  return (
    <>
      <Navbar />
      <SolutionClient initialSlug="flawdits-vs-vendasta-snapshot-report" />
      <Footer />
    </>
  );
}
