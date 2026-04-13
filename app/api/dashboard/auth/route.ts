import { NextRequest, NextResponse } from 'next/server';
import { getClaimedListingByToken } from '@/lib/airtable';
import { slugify } from '@/lib/utils';

/**
 * GET /api/dashboard/auth?token=xxx&slug=xxx
 * Validates a magic link token, sets a 30-day cookie, redirects to dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const slug = searchParams.get('slug');

  if (!token || !slug) {
    return NextResponse.redirect(new URL(`/?error=invalid_link`, request.url));
  }

  // Verify the token belongs to this slug/winery
  const listing = await getClaimedListingByToken(token);
  if (!listing) {
    return NextResponse.redirect(new URL(`/?error=invalid_token`, request.url));
  }

  // Confirm the slug matches the winery name in the listing
  const listingSlug = slugify(listing.fields.WineryName);
  if (listingSlug !== slug) {
    return NextResponse.redirect(new URL(`/?error=token_mismatch`, request.url));
  }

  // Set the cookie and redirect to dashboard
  const dashboardUrl = new URL(`/dashboard/${slug}`, request.url);
  const response = NextResponse.redirect(dashboardUrl);

  response.cookies.set('owner_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return response;
}
