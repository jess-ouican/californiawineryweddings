'use client';

import dynamic from 'next/dynamic';
import { loadWineries } from '@/lib/data';
import type { Metadata } from 'next';

const WineriesMap = dynamic(() => import('@/components/WineriesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#FAF8F3]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto mb-4"></div>
        <p className="text-[#6B3E2E] font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Interactive Map - California Winery Weddings',
  description: 'Explore 435+ California wineries on an interactive map. Find the perfect venue for your wedding.',
  openGraph: {
    title: 'Interactive Map - California Winery Weddings',
    description: 'Explore 435+ California wineries on an interactive map.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/app/map',
  },
};

export default async function MapPage() {
  const wineries = await loadWineries();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-1">
            Winery Map
          </h1>
          <p className="text-gray-600 text-sm">
            Explore all {wineries.length} California wineries. Click a marker for details.
          </p>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 overflow-hidden">
        <WineriesMap wineries={wineries} />
      </div>
    </div>
  );
}
