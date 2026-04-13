import { NextRequest, NextResponse } from 'next/server';
import { getClaimedListingByToken, getVenueDetails, saveVenueDetails } from '@/lib/airtable';
import { getWineryBySlug, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';

async function validateOwner(request: NextRequest, slug: string) {
  const token = request.cookies.get('owner_token')?.value;
  if (!token) return null;

  const listing = await getClaimedListingByToken(token);
  if (!listing) return null;

  // Confirm slug matches
  if (slugify(listing.fields.WineryName) !== slug) return null;

  return listing;
}

/**
 * GET /api/dashboard/venue-details?slug=xxx
 * Returns saved venue details for the authenticated owner.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
  }

  const listing = await validateOwner(request, slug);
  if (!listing) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const details = await getVenueDetails(listing.fields.PlaceId);
  return NextResponse.json({ details });
}

/**
 * POST /api/dashboard/venue-details
 * Body: { slug, ...VenueDetails fields }
 * Saves venue details for the authenticated owner.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...venueData } = body;

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    const listing = await validateOwner(request, slug);
    if (!listing) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Load winery to get name
    const wineries = await loadWineries();
    const winery = getWineryBySlug(wineries, slug);

    await saveVenueDetails({
      PlaceId: listing.fields.PlaceId,
      WineryName: winery?.title || listing.fields.WineryName,
      ...venueData,
    });

    return NextResponse.json({ message: 'Saved successfully' });
  } catch (error) {
    console.error('[DASHBOARD VENUE-DETAILS] Error:', error);
    return NextResponse.json({ message: 'Failed to save.' }, { status: 500 });
  }
}
