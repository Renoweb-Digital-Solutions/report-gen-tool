import HowItWorksClient from '../components/how-it-works/HowItWorksClient';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata = {
  title: 'How Flawdits Works: Generate an Audit Report in 3 Steps',
  description: 'See how Flawdits turns a website URL, Instagram handle or LinkedIn page into a downloadable, client-ready audit report in minutes.',
  keywords: ['how digital audit reports are generated', 'agency client audit workflow', 'automated digital audit process'],
  alternates: {
    canonical: 'https://flawdits.com/how-it-works',
  },
  openGraph: {
    title: 'How Flawdits Works: Generate an Audit Report in 3 Steps',
    description: 'See how Flawdits turns a website URL, Instagram handle or LinkedIn page into a downloadable, client-ready audit report in minutes.',
    url: 'https://flawdits.com/how-it-works',
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <HowItWorksClient />
      <Footer />
    </>
  );
}
