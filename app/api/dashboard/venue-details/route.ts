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

    console.log('[DASHBOARD VENUE-DETAILS] POST request:', { slug, fieldCount: Object.keys(venueData).length });

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    const listing = await validateOwner(request, slug);
    if (!listing) {
      console.log('[DASHBOARD VENUE-DETAILS] Unauthorized - no valid token');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('[DASHBOARD VENUE-DETAILS] Owner validated:', { placeId: listing.fields.PlaceId });

    // Load winery to get name
    const wineries = await loadWineries();
    const winery = getWineryBySlug(wineries, slug);

    console.log('[DASHBOARD VENUE-DETAILS] Saving to Airtable:', {
      placeId: listing.fields.PlaceId,
      winery: winery?.title || listing.fields.WineryName,
      fields: Object.keys(venueData),
    });

    // Convert WheelchairAccessible to boolean
    if (venueData.WheelchairAccessible !== undefined) {
      venueData.WheelchairAccessible = Boolean(venueData.WheelchairAccessible);
    }
    await saveVenueDetails({
      PlaceId: listing.fields.PlaceId,
      WineryName: winery?.title || listing.fields.WineryName,
      ...venueData,
    });

    console.log('[DASHBOARD VENUE-DETAILS] ✓ Saved successfully');
    return NextResponse.json({ message: 'Saved successfully' });
  } catch (error) {
    console.error('[DASHBOARD VENUE-DETAILS] ✗ Error:', error instanceof Error ? error.message : error);
    console.error('[DASHBOARD VENUE-DETAILS] Full error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to save.' },
      { status: 500 }
    );
  }
}
