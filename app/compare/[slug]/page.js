import { notFound } from 'next/navigation';
import CompareClient from '../../components/compare/CompareClient';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { COMPARISONS } from '../../data/comparisons';

export async function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = COMPARISONS[slug];

  if (!data) {
    return {
      title: 'Comparison Not Found | Flawdits',
    };
  }

  return {
    title: data.seo.metaTitle,
    description: data.seo.metaDescription,
    keywords: [data.seo.primaryKeyword, 'digital audit tool comparison', 'agency audit software'],
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
}

export default async function DynamicComparePage({ params }) {
  const { slug } = await params;
  const data = COMPARISONS[slug];

  if (!data) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <CompareClient initialSlug={slug} />
      <Footer />
    </>
  );
}
