import { getWineryBySlug, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import ClaimForm from '@/components/ClaimForm';
import Link from 'next/link';
import { Metadata } from 'next';

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
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, resolvedParams.slug);

  return {
    title: winery
      ? `Claim Your Listing - ${winery.title} | California Winery Weddings`
      : 'Claim Your Listing | California Winery Weddings',
    description: 'Verify ownership of your winery listing and get a "Verified Owner" badge.',
  };
}

export default async function ClaimPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, resolvedParams.slug);

  if (!winery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
          Winery Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          Could not find a winery with the slug: {resolvedParams.slug}
        </p>
        <Link href="/" className="text-[#6B3E2E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // Verify placeId exists
  if (!winery.placeId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">
          Error: Missing Winery ID
        </h1>
        <p className="text-gray-600 mb-4">
          This winery listing is missing required data. Please contact support.
        </p>
        <Link href="/" className="text-[#6B3E2E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-[#6B3E2E]">
            Home
          </Link>
          {' / '}
          <Link href={`/wineries/${resolvedParams.slug}`} className="hover:text-[#6B3E2E]">
            {winery.title}
          </Link>
          {' / '}
          <span className="text-[#6B3E2E] font-semibold">Claim Listing</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">
              Claim Your Winery Listing
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              By verifying ownership of your listing, you'll gain access to manage your information
              and display a "Verified Owner" badge that builds trust with couples looking to book
              your venue.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Verified Owner Badge</h3>
                  <p className="text-gray-600">Display a green badge to show couples you're the official venue</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Featured Placement</h3>
                  <p className="text-gray-600">Verified wineries appear at the top of region pages</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Instant Verification</h3>
                  <p className="text-gray-600">One-click email verification - takes 30 seconds</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> Use your official winery domain email (e.g., info@yourwinery.com)
                for instant verification.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <ClaimForm wineryName={winery.title} placeId={winery.placeId} slug={resolvedParams.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
