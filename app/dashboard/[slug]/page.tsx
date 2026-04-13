import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClaimedListingByToken, getVenueDetails } from '@/lib/airtable';
import { getWineryBySlug, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { Metadata } from 'next';
import DashboardForm from '@/components/DashboardForm';
import RequestAccessForm from '@/components/RequestAccessForm';
import Link from 'next/link';

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Owner Dashboard — ${slug}`,
    robots: 'noindex, nofollow',
  };
}

export default async function DashboardPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  // Load winery
  const wineries = await loadWineries();
  const winery = getWineryBySlug(wineries, slug);

  if (!winery) {
    redirect('/');
  }

  // Check auth cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('owner_token')?.value;

  let isAuthorized = false;
  let existingDetails = null;

  if (token) {
    const listing = await getClaimedListingByToken(token);
    if (listing && slugify(listing.fields.WineryName) === slug) {
      isAuthorized = true;
      existingDetails = await getVenueDetails(winery.placeId);
    }
  }

  if (!isAuthorized) {
    // Show the request access form
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-white">
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <Link href={`/wineries/${slug}`} className="text-[#6B3E2E] text-sm hover:underline">
              ← Back to {winery.title}
            </Link>
            <div className="mt-6 mb-4">
              <span className="text-5xl">🏰</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
              Owner Dashboard
            </h1>
            <p className="text-gray-600 text-lg">{winery.title}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="font-serif text-xl font-bold text-[#6B3E2E] mb-2">
              Request Access Link
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              If you&apos;ve already verified ownership of this listing, we&apos;ll send a sign-in link to your verified email address.
            </p>
            <RequestAccessForm slug={slug} wineryName={winery.title} />
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Haven&apos;t claimed this listing yet?{' '}
                <Link href={`/claim/${slug}`} className="text-[#6B3E2E] hover:underline font-medium">
                  Claim it here →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authorized — show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-white">
      {/* Header */}
      <div className="bg-[#6B3E2E] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#D4A574] text-sm font-medium mb-1">Owner Dashboard</p>
              <h1 className="font-serif text-2xl font-bold">{winery.title}</h1>
              <p className="text-[#D4A574] text-sm mt-1">{winery.city}, California</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/wineries/${slug}`}
                className="text-sm text-[#D4A574] hover:text-white transition-colors"
              >
                View Public Listing →
              </Link>
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                ✓ Verified Owner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>💡 Tip:</strong> Fill out your venue details to help couples find and book your winery. Complete profiles get significantly more inquiries.
          </p>
        </div>

        <DashboardForm
          slug={slug}
          placeId={winery.placeId}
          initialData={existingDetails}
        />
      </div>
    </div>
  );
}
