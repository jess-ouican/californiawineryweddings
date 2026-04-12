import { getWineriesByRegion, getTopRegions, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { generateRegionSEO } from '@/lib/seo';
import WineryCard from '@/components/WineryCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const wineries = await loadWineries();
  const topRegions = getTopRegions(wineries);
  return topRegions.map((region) => ({
    slug: region.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const topRegions = getTopRegions(wineries);
  const region = topRegions.find((r) => r.slug === resolvedParams.slug);

  if (!region) {
    return {
      title: 'Region Not Found',
    };
  }

  return generateRegionSEO(region.region, region.count);
}

export default async function RegionPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const topRegions = getTopRegions(wineries);
  const regionData = topRegions.find((r) => r.slug === resolvedParams.slug);

  if (!regionData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">Region Not Found</h1>
        <Link href="/" className="text-[#6B3E2E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const regionWineries = getWineriesByRegion(wineries, regionData.region);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            Winery Wedding Venues in {regionData.region}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Discover {regionData.count} beautiful {regionData.region} wineries perfect for your California wedding.
          </p>
        </div>
      </section>

      {/* Wineries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Showing {regionWineries.length} wineries in {regionData.region}
          </p>

          {regionWineries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionWineries.map((winery) => (
                <WineryCard key={winery.placeId} winery={winery} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No wineries found in {regionData.region}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Other Regions */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-8">
            Explore Other Regions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRegions
              .filter((r) => r.slug !== resolvedParams.slug)
              .slice(0, 8)
              .map((region) => (
                <Link key={region.slug} href={`/regions/${region.slug}`}>
                  <div className="bg-[#F5E6D3] hover:shadow-md p-4 rounded-lg cursor-pointer transition">
                    <h3 className="font-serif text-lg font-bold text-[#6B3E2E]">
                      {region.region}
                    </h3>
                    <p className="text-sm text-gray-600">{region.count} wineries</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
