import SolutionClient from '../components/solutions/SolutionClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SOLUTIONS } from '../data/solutions';

const data = SOLUTIONS['free-website-audit'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'free website audit tool', 'instant SEO health score'],
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

export default function FreeWebsiteAuditPage() {
  return (
    <>
      <Navbar />
      <SolutionClient initialSlug="free-website-audit" />
      <Footer />
    </>
  );
}
