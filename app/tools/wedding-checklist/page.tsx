import type { Metadata } from 'next';
import WeddingChecklist from './WeddingChecklist';

export const metadata: Metadata = {
  title: 'Winery Wedding Checklist: Complete Planning Timeline | California Winery Weddings',
  description:
    'The complete winery wedding checklist — month-by-month tasks from 12 months out to the day after. Covers wine minimums, corkage fees, noise ordinances, harvest season conflicts, parking, and every detail unique to vineyard venues in California.',
  keywords: [
    'winery wedding checklist',
    'vineyard wedding checklist',
    'winery wedding planning timeline',
    'vineyard wedding planning guide',
    'outdoor winery wedding checklist',
    'California winery wedding checklist',
    'wedding checklist winery venue',
    'vineyard wedding planning timeline',
    'winery wedding to do list',
    'wine country wedding checklist',
    'how to plan a winery wedding',
    'winery wedding planning tips',
    'vineyard wedding tips California',
  ],
  openGraph: {
    title: 'Complete Winery Wedding Checklist & Planning Timeline',
    description:
      'Month-by-month winery wedding checklist covering every detail from booking your vineyard to the day-after. Includes winery-specific tasks no generic checklist covers.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/wedding-checklist',
  },
};

export default function Page() {
  return <WeddingChecklist />;
}
