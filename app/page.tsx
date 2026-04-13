import { getAllRegions } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import Link from 'next/link';
import WineryCard from '@/components/WineryCard';

export const revalidate = 3600; // ISR: revalidate every hour

export default async function Home() {
  const wineries = await loadWineries();
  const allRegions = getAllRegions(wineries);
  const topRegions = allRegions.slice(0, 15); // Show top 15 on homepage
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
            Discover 435+ verified wineries and vineyards across California's most beautiful wine regions. From intimate gatherings to grand celebrations, find your dream venue.
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

      {/* Free Planning Tools Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
              Free Wedding Planning Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use our calculators and guides to plan every aspect of your wine country wedding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/tools/wine-calculator">
              <div className="bg-white hover:shadow-lg border-2 border-[#8B5A3C] rounded-lg p-6 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-3">🍇</div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                  Wine Calculator
                </h3>
                <p className="text-gray-600 mb-4 flex-grow text-sm">
                  Calculate bottle quantities, cases needed, and cost estimates for your guest count.
                </p>
                <div className="text-[#6B3E2E] font-semibold text-sm hover:text-[#8B5A3C]">
                  Open Calculator →
                </div>
              </div>
            </Link>

            <Link href="/tools/shuttle-calculator">
              <div className="bg-white hover:shadow-lg border-2 border-[#8B5A3C] rounded-lg p-6 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-3">🚐</div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                  Shuttle Calculator
                </h3>
                <p className="text-gray-600 mb-4 flex-grow text-sm">
                  Plan guest transportation with vehicle recommendations and cost estimates.
                </p>
                <div className="text-[#6B3E2E] font-semibold text-sm hover:text-[#8B5A3C]">
                  Open Calculator →
                </div>
              </div>
            </Link>

            <Link href="/tools/wedding-weather">
              <div className="bg-white hover:shadow-lg border-2 border-[#8B5A3C] rounded-lg p-6 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-3">🌤️</div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                  Weather Guide
                </h3>
                <p className="text-gray-600 mb-4 flex-grow text-sm">
                  Explore month-by-month climate patterns for all California wine regions.
                </p>
                <div className="text-[#6B3E2E] font-semibold text-sm hover:text-[#8B5A3C]">
                  View Guide →
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/tools"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              View All Planning Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
              Wedding Planning Guides
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert tips, regional guides, and inspirations for planning your perfect winery wedding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/blog/napa-valley-winery-weddings-complete-guide">
              <div className="bg-white border border-gray-200 hover:shadow-lg rounded-lg overflow-hidden transition cursor-pointer h-full flex flex-col">
                <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8] h-40"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                    Napa Valley Winery Weddings: Complete Guide
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Everything you need to know about planning a wedding in Napa Valley, from top venues to wine pairings.
                  </p>
                  <div className="text-[#6B3E2E] font-semibold">Read Guide →</div>
                </div>
              </div>
            </Link>

            <Link href="/blog/best-paso-robles-winery-wedding-venues-2026">
              <div className="bg-white border border-gray-200 hover:shadow-lg rounded-lg overflow-hidden transition cursor-pointer h-full flex flex-col">
                <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8] h-40"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                    Best Paso Robles Winery Wedding Venues 2026
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Discover the top-rated wineries in Paso Robles perfect for intimate and grand celebrations.
                  </p>
                  <div className="text-[#6B3E2E] font-semibold">Read Guide →</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              View All Articles →
            </Link>
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
