import FaqClient from '../components/faq/FaqClient';

export const metadata = {
  title: 'Flawdits FAQ: Common Questions About Digital Audit Reports',
  description: 'Answers to common questions about how Flawdits generates SEO, social, GMB and brand audit reports, pricing, and white labeling.',
  keywords: ['digital audit tool FAQ', 'how Flawdits works', 'white label audit report questions', 'AI visibility score accuracy'],
  alternates: {
    canonical: 'https://flawdits.com/faq',
  },
  openGraph: {
    title: 'Flawdits FAQ: Common Questions About Digital Audit Reports',
    description: 'Answers to common questions about how Flawdits generates SEO, social, GMB and brand audit reports, pricing, and white labeling.',
    url: 'https://flawdits.com/faq',
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
