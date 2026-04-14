import { getWineryBySlug, slugify, isCouplesFavorite, getWineriesByRegion } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { generateWinerySEO, generateWinerySchema, generateBreadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import WineryImage from '@/components/WineryImage';
import VerificationBadge from '@/components/VerificationBadge';
import CouplesFavoriteBadge from '@/components/CouplesFavoriteBadge';
import WeddingTestimonials from '@/components/WeddingTestimonials';
import WineryCard from '@/components/WineryCard';
import WeddingPlanningToolsWidget from '@/components/WeddingPlanningToolsWidget';
import WineryHeaderActions from '@/components/WineryHeaderActions';
import VenueInfoSection from '@/components/VenueInfoSection';
import { getVenueDetails, isWineryClaimed } from '@/lib/airtable';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const wineries = await loadWineries();
  return wineries.map((winery) => ({
    slug: slugify(winery.title),
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const wineries = await loadWineries();
    const winery = getWineryBySlug(wineries, resolvedParams.slug);

    if (!winery) {
      console.warn(`[generateMetadata] Winery not found for slug: ${resolvedParams.slug}`);
      return {
        title: 'Winery Not Found',
      };
    }

    return generateWinerySEO(winery.title, winery.city, winery.totalScore);
  } catch (error) {
    console.error(`[generateMetadata] Error loading wineries:`, error);
    return {
      title: 'Error Loading Page',
    };
  }
}

export default async function WineryPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, resolvedParams.slug);

  if (!winery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">Winery Not Found</h1>
        <Link href="/" className="text-[#6B3E2E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // Fetch venue details (owner-submitted) — non-blocking, null if not available
  let venueDetails = null;
  let isClaimed = false;
  try {
    venueDetails = await getVenueDetails(winery.placeId);
    // Check if this winery has a claimed listing
    const claimStatus = await isWineryClaimed(winery.placeId);
    isClaimed = claimStatus.verified || false;
  } catch {
    // ignore — venue details are optional
  }

  const schema = generateWinerySchema(winery, winery.city);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.californiawineryweddings.com' },
    { name: winery.region || 'California', url: `https://www.californiawineryweddings.com/regions/${winery.region ? slugify(winery.region) : 'california'}` },
    { name: winery.title, url: `https://www.californiawineryweddings.com/wineries/${slugify(winery.title)}` },
  ]);
  const ratingPercentages = winery.reviewsDistribution && winery.reviewsCount && winery.totalScore ? {
    five: Math.round((winery.reviewsDistribution.fiveStar / winery.reviewsCount) * 100),
    four: Math.round((winery.reviewsDistribution.fourStar / winery.reviewsCount) * 100),
    three: Math.round((winery.reviewsDistribution.threeStar / winery.reviewsCount) * 100),
    two: Math.round((winery.reviewsDistribution.twoStar / winery.reviewsCount) * 100),
    one: Math.round((winery.reviewsDistribution.oneStar / winery.reviewsCount) * 100),
  } : {
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-grow">
              {winery.region && (
                <Link href={`/regions/${slugify(winery.region)}`} className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
                  ← Back to {winery.region}
                </Link>
              )}
              <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
                {winery.title}
              </h1>
              <div className="mb-4 space-y-2">
                {isCouplesFavorite(winery) && <CouplesFavoriteBadge />}
                {winery.weddingConfidence && (
                  <VerificationBadge confidence={winery.weddingConfidence} size="md" />
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <WineryHeaderActions 
                wineryTitle={winery.title} 
                placeId={winery.placeId} 
                slug={resolvedParams.slug} 
              />
            </div>
          </div>
          <p className="text-gray-700 text-lg">{winery.address}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200">
              <WineryImage
                src={winery.imageUrl}
                alt={winery.title}
                title={winery.title}
              />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">LOCATION</h3>
                <p className="font-serif text-xl font-bold text-[#6B3E2E]">
                  {winery.city ? `${winery.city}, California` : 'California'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">ZIP CODE</h3>
                <p className="font-serif text-xl font-bold text-[#6B3E2E]">
                  {winery.postalCode}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">PHONE</h3>
                <a
                  href={`tel:${winery.phone}`}
                  className="font-serif text-xl font-bold text-[#6B3E2E] hover:underline"
                >
                  {winery.phone}
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">WEBSITE</h3>
                {winery.website ? (
                  <a
                    href={winery.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6B3E2E] hover:underline text-sm font-medium block truncate"
                  >
                    Visit Website →
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">Not available</p>
                )}
              </div>
            </div>

            {/* Rating Section */}
            {winery.totalScore && winery.reviewsCount ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-6">
                  Guest Reviews
                </h2>

                <div className="mb-8">
                  <div className="flex items-end gap-4 mb-2">
                    <div className="text-5xl font-serif font-bold text-[#6B3E2E]">
                      {winery.totalScore}
                    </div>
                    <div>
                      <div className="text-lg text-yellow-600">★★★★★</div>
                      <p className="text-sm text-gray-600">Based on {winery.reviewsCount} reviews</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {(winery.reviewsDistribution && winery.reviewsCount && winery.totalScore ? [
                    { stars: 5, count: winery.reviewsDistribution.fiveStar, percentage: ratingPercentages.five },
                    { stars: 4, count: winery.reviewsDistribution.fourStar, percentage: ratingPercentages.four },
                    { stars: 3, count: winery.reviewsDistribution.threeStar, percentage: ratingPercentages.three },
                    { stars: 2, count: winery.reviewsDistribution.twoStar, percentage: ratingPercentages.two },
                    { stars: 1, count: winery.reviewsDistribution.oneStar, percentage: ratingPercentages.one },
                  ] : []).map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-12">
                        {rating.stars} ★
                      </span>
                      <div className="flex-grow bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={winery.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6B3E2E] hover:underline text-sm font-medium"
                  >
                    Read all reviews on Google Maps →
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-6">
                  Guest Reviews
                </h2>
                <p className="text-gray-600">
                  Reviews not yet available for this venue.
                </p>
              </div>
            )}

            {/* Venue Information — owner-submitted details */}
            {venueDetails && (
              <VenueInfoSection details={venueDetails} isClaimed={isClaimed} winerySlug={resolvedParams.slug} />
            )}

            {/* Opening Hours */}
            {winery.openingHours && winery.openingHours.length > 0 && (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">
                  Hours
                </h3>
                <div className="space-y-2">
                  {winery.openingHours.map((hour) => (
                    <div key={hour.day} className="flex justify-between">
                      <span className="text-gray-700 font-medium">{hour.day}</span>
                      <span className="text-gray-600">{hour.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wedding Testimonials */}
            <WeddingTestimonials reviews={winery.reviews} />

            {winery.permanentlyClosed && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠️ This venue appears to be permanently closed. Please verify before contacting.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Lead Form + Tools */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-20 bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                Request Information
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Send an inquiry to {winery.title} about your wedding
              </p>
              <LeadForm wineryName={winery.title} region={winery.city || 'California'} placeId={winery.placeId} />
            </div>
            
            <WeddingPlanningToolsWidget />
          </div>
        </div>
      </div>

      {/* Similar Venues */}
      {winery.region && (
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-8">
              More Venues in {winery.region}
            </h2>
            
            {(() => {
              const regionalWineries = getWineriesByRegion(wineries, winery.region || '');
              const nearbyVenues = regionalWineries
                .filter(w => w.title !== winery.title) // Exclude current winery
                .slice(0, 5); // Show up to 5 venues

              if (nearbyVenues.length === 0) {
                return (
                  <p className="text-gray-600">
                    <Link href={`/regions/${slugify(winery.region)}`} className="text-[#6B3E2E] hover:underline font-medium">
                      View all {winery.region} wineries →
                    </Link>
                  </p>
                );
              }

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {nearbyVenues.map((venue) => (
                      <WineryCard key={venue.title} winery={venue} />
                    ))}
                  </div>
                  <div className="text-center pt-4">
                    <Link 
                      href={`/regions/${slugify(winery.region)}`} 
                      className="inline-block text-[#6B3E2E] hover:underline font-medium border-b border-[#6B3E2E]"
                    >
                      View all {winery.region} wineries →
                    </Link>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}
    </div>
  );
}
