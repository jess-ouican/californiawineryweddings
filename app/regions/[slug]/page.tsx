import { getWineriesByRegion, getAllRegions, slugify, isCouplesFavorite } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { generateRegionSEO, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { getVerifiedClaimedPlaceIds } from '@/lib/airtable';
import WineryCard from '@/components/WineryCard';
import RegionWeatherWidget from '@/components/RegionWeatherWidget';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const wineries = await loadWineries();
  const allRegions = getAllRegions(wineries);
  return allRegions.map((region) => ({
    slug: region.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const allRegions = getAllRegions(wineries);
  const region = allRegions.find((r) => r.slug === resolvedParams.slug);

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
  const allRegions = getAllRegions(wineries);
  const regionData = allRegions.find((r) => r.slug === resolvedParams.slug);

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
  const couplesFavoritesInRegion = regionWineries.filter(isCouplesFavorite);
  const verifiedPlaceIds = await getVerifiedClaimedPlaceIds();

  // Sort wineries: verified owners first, then the rest
  const sortedWineries = [
    ...regionWineries.filter((w) => verifiedPlaceIds.includes(w.placeId)),
    ...regionWineries.filter((w) => !verifiedPlaceIds.includes(w.placeId)),
  ];
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.californiawineryweddings.com' },
    { name: regionData.region, url: `https://www.californiawineryweddings.com/regions/${regionData.slug}` },
  ]);
  
  const faqSchema = generateFAQSchema(regionData.region, regionData.count);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
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

      {/* Couples' Favorites Section */}
      {couplesFavoritesInRegion.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200">
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-2">
              ⭐ Couples' Favorites
            </h2>
            <p className="text-gray-600 mb-6">
              Highly-rated venues loved by couples — {couplesFavoritesInRegion.length} venues in {regionData.region}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couplesFavoritesInRegion.map((winery) => (
                <WineryCard 
                  key={winery.placeId} 
                  winery={winery}
                  isVerifiedOwner={verifiedPlaceIds.includes(winery.placeId)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Weather Guide Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200">
        <RegionWeatherWidget regionName={regionData.region} />
      </section>

      {/* Unified Wineries Grid (verified owners sorted first) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Showing {regionWineries.length} wineries in {regionData.region}
          </p>

          {regionWineries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWineries.map((winery) => (
                <WineryCard 
                  key={winery.placeId} 
                  winery={winery}
                  isVerifiedOwner={verifiedPlaceIds.includes(winery.placeId)}
                />
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
            {getAllRegions(wineries)
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
