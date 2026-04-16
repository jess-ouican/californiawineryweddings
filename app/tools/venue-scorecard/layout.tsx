import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Winery Wedding Venue Scorecard | California Winery Weddings',
  description: 'Score and compare up to 3 California winery wedding venues across 35 winery-specific criteria — wine minimums, noise ordinances, corkage policy, harvest conflicts, and more. Free Google Sheet, instant email delivery.',
  keywords: [
    'winery wedding venue scorecard',
    'vineyard wedding venue comparison',
    'winery wedding venue checklist',
    'how to compare winery wedding venues',
    'California winery wedding planning',
    'vineyard wedding checklist download',
    'winery venue questions to ask',
    'winery wedding red flags',
    'wine minimum wedding venue',
    'corkage fee wedding venue',
    'harvest season wedding California',
  ],
  openGraph: {
    title: 'Free Winery Wedding Venue Scorecard',
    description: 'Compare up to 3 California winery venues side by side. 35 winery-specific criteria, weighted scoring, red flags checklist. Free Google Sheet.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/venue-scorecard',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
