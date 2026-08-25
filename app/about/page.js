import AboutClient from '../components/about/AboutClient';

export const metadata = {
  title: 'About Flawdits | A Renoweb Digital Presence Report Suite',
  description: 'Flawdits is built by Renoweb to help agencies and businesses audit their complete digital presence SEO, social, local and brand in one place.',
  keywords: ['about Flawdits digital audit platform', 'Renoweb digital presence report suite', 'agency digital marketing audit software'],
  alternates: {
    canonical: 'https://flawdits.com/about',
  },
  openGraph: {
    title: 'About Flawdits | A Renoweb Digital Presence Report Suite',
    description: 'Flawdits is built by Renoweb to help agencies and businesses audit their complete digital presence SEO, social, local and brand in one place.',
    url: 'https://flawdits.com/about',
    siteName: 'Flawdits',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
