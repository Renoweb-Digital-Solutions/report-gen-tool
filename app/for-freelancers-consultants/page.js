import SolutionClient from '../components/solutions/SolutionClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SOLUTIONS } from '../data/solutions';

const data = SOLUTIONS['for-freelancers-consultants'];

export const metadata = {
  title: data.seo.metaTitle,
  description: data.seo.metaDescription,
  keywords: [data.seo.primaryKeyword, 'digital audit tool for freelancers', 'solo marketing consultant audit tool'],
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

export default function ForFreelancersConsultantsPage() {
  return (
    <>
      <Navbar />
      <SolutionClient initialSlug="for-freelancers-consultants" />
      <Footer />
    </>
  );
}
