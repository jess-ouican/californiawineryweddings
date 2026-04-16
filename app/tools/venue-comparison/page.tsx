import { Suspense } from 'react';
import type { Metadata } from 'next';
import VenueComparison from './VenueComparison';

export const metadata: Metadata = {
  title: 'Winery Wedding Venue Comparison Tool | California Winery Weddings',
  description:
    'Compare up to 3 California winery wedding venues side by side. Score them on wine minimums, exclusivity, noise ordinances, catering flexibility, and more. Free, shareable comparison link.',
  keywords: [
    'winery wedding venue comparison',
    'wedding venue comparison tool',
    'compare wedding venues',
    'winery wedding venue checklist',
    'wine country wedding venue',
    'wedding venue scorecard',
    'California winery wedding venue',
    'napa wedding venue comparison',
    'sonoma wedding venue comparison',
    'how to choose a wedding venue',
    'wine minimum wedding',
    'winery wedding corkage fee',
  ],
  openGraph: {
    title: 'Winery Wedding Venue Comparison Scorecard',
    description: 'Compare up to 3 winery venues side by side — wine minimums, exclusivity, noise ordinances, and more. Free shareable link.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/venue-comparison',
  },
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-[#6B3E2E] font-serif text-xl">
        Loading comparison…
      </div>
    }>
      <VenueComparison />
    </Suspense>
  );
}
