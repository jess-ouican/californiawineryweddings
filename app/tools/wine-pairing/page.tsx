import { Suspense } from 'react';
import type { Metadata } from 'next';
import WinePairingPlanner from './WinePairingPlanner';

export const metadata: Metadata = {
  title: 'Wedding Wine Pairing Planner | California Winery Weddings',
  description:
    'Build your complete wedding wine menu with expert California wine pairing recommendations. Course-by-course pairings with varietals, regional picks, price ranges, and insider tips.',
  keywords: [
    'wedding wine pairing',
    'wedding wine menu',
    'what wine to serve at wedding',
    'wine pairing guide wedding',
    'winery wedding wine menu',
    'California wedding wine',
    'wedding wine calculator',
    'wedding reception wine pairing',
    'wine pairing by course wedding',
  ],
  openGraph: {
    title: 'Wedding Wine Pairing Planner',
    description: 'Build your complete California winery wedding wine menu — free, no signup.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/wine-pairing',
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-[#6B3E2E] font-serif text-xl">
          Building your wine menu…
        </div>
      }
    >
      <WinePairingPlanner />
    </Suspense>
  );
}
