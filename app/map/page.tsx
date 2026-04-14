import { loadWineries } from '@/lib/data';
import MapClientWrapper from '@/components/MapClientWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Map - California Winery Weddings',
  description: 'Explore 435+ California wineries on an interactive map. Find the perfect venue for your wedding.',
  openGraph: {
    title: 'Interactive Map - California Winery Weddings',
    description: 'Explore 435+ California wineries on an interactive map.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/map',
  },
};

export default async function MapPage() {
  const wineries = await loadWineries();

  return (
    <div className="bg-[#FAF8F3]">
      {/* Header section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-2">
            Winery Map
          </h1>
          <p className="text-gray-600">
            Explore all {wineries.length} California wineries on an interactive map. Click a marker for details.
          </p>
        </div>
      </div>

      {/* Map container with proper max-width */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-screen">
          <MapClientWrapper wineries={wineries} />
        </div>
      </div>
    </div>
  );
}
