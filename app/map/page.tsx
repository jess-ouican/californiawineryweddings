import { loadWineries } from '@/lib/data';
import WineriesMap from '@/components/WineriesMap';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Winery Locations Map | California Winery Weddings',
  description: 'Explore all California winery wedding venues on an interactive map. Find your perfect wedding location by location.',
};

export default async function MapPage() {
  const wineries = await loadWineries();

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            Winery Locations Map
          </h1>
          <p className="text-gray-700 text-lg">
            Explore all {wineries.length} California wine venues on an interactive map. Click on any marker to see the winery name and location.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <WineriesMap wineries={wineries} height="h-screen" />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
