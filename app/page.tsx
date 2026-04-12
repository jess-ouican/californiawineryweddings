import { getTopRegions, loadWineries } from '@/lib/utils';
import Link from 'next/link';
import WineryCard from '@/components/WineryCard';

export const revalidate = 3600; // ISR: revalidate every hour

export default async function Home() {
  const wineries = await loadWineries();
  const topRegions = getTopRegions(wineries);
  const featuredWineries = wineries.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#6B3E2E] mb-6 leading-tight">
            Find Your Perfect California Winery Wedding
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover 1,300+ wineries and vineyards across California's most beautiful wine regions. From intimate gatherings to grand celebrations, find your dream venue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#regions"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Browse Regions
            </a>
            <a
              href="#featured"
              className="inline-block bg-white hover:bg-gray-100 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg border-2 border-[#6B3E2E] transition"
            >
              View Venues
            </a>
          </div>
        </div>
      </section>

      {/* Featured Wineries */}
      <section id="featured" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
              Featured Venues
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of California's most beloved winery wedding destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWineries.map((winery) => (
              <WineryCard key={winery.placeId} winery={winery} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/directory"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              View All {wineries.length} Wineries →
            </Link>
          </div>
        </div>
      </section>

      {/* Top Regions */}
      <section id="regions" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
              Explore Wine Regions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              California's premier wine country regions, each with its own character and charm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRegions.map((region) => (
              <Link key={region.slug} href={`/regions/${region.slug}`}>
                <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8] hover:shadow-lg p-6 rounded-lg cursor-pointer transition h-full">
                  <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                    {region.region}
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    {region.count} {region.count === 1 ? 'winery' : 'wineries'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Explore venues in this beautiful region →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#6B3E2E] text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Ready to Plan Your Wine Country Wedding?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Reach out to your favorite venues directly, or let us help you find the perfect match.
          </p>
          <a
            href="mailto:hello@californiawineryweddings.com"
            className="inline-block bg-white hover:bg-gray-100 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg transition"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}
