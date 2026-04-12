import { loadWineries } from '@/lib/data';
import WineryCard from '@/components/WineryCard';

export const revalidate = 3600;

export default async function Directory() {
  const wineries = await loadWineries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
          All California Winery Venues
        </h1>
        <p className="text-gray-600 text-lg">
          Browse all {wineries.length} wineries and vineyards available for weddings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wineries.map((winery) => (
          <WineryCard key={winery.placeId} winery={winery} />
        ))}
      </div>
    </div>
  );
}
