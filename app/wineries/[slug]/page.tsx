import { getWineryBySlug, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { generateWinerySEO, generateWinerySchema } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, params.slug);

  if (!winery) {
    return {
      title: 'Winery Not Found',
    };
  }

  return generateWinerySEO(winery.title, winery.city, winery.totalScore);
}

export default async function WineryPage({ params }: { params: Params }) {
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, params.slug);

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

  const schema = generateWinerySchema(winery, winery.city);
  const ratingPercentages = {
    five: Math.round((winery.reviewsDistribution.fiveStar / winery.reviewsCount) * 100),
    four: Math.round((winery.reviewsDistribution.fourStar / winery.reviewsCount) * 100),
    three: Math.round((winery.reviewsDistribution.threeStar / winery.reviewsCount) * 100),
    two: Math.round((winery.reviewsDistribution.twoStar / winery.reviewsCount) * 100),
    one: Math.round((winery.reviewsDistribution.oneStar / winery.reviewsCount) * 100),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/regions/${slugify(winery.city)}`} className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to {winery.city}
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-2">
            {winery.title}
          </h1>
          <p className="text-gray-700 text-lg">{winery.address}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={winery.imageUrl}
                alt={winery.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">LOCATION</h3>
                <p className="font-serif text-xl font-bold text-[#6B3E2E]">
                  {winery.city}, California
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
                {[
                  { stars: 5, count: winery.reviewsDistribution.fiveStar, percentage: ratingPercentages.five },
                  { stars: 4, count: winery.reviewsDistribution.fourStar, percentage: ratingPercentages.four },
                  { stars: 3, count: winery.reviewsDistribution.threeStar, percentage: ratingPercentages.three },
                  { stars: 2, count: winery.reviewsDistribution.twoStar, percentage: ratingPercentages.two },
                  { stars: 1, count: winery.reviewsDistribution.oneStar, percentage: ratingPercentages.one },
                ].map((rating) => (
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

            {winery.permanentlyClosed && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠️ This venue appears to be permanently closed. Please verify before contacting.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Lead Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">
                Request Information
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Send an inquiry to {winery.title} about your wedding
              </p>
              <LeadForm wineryName={winery.title} region={winery.city} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Venues */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-8">
            More Venues in {winery.city}
          </h2>
          <p className="text-gray-600 mb-6">
            <Link href={`/regions/${slugify(winery.city)}`} className="text-[#6B3E2E] hover:underline font-medium">
              View all {winery.city} wineries →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
