import { NextRequest, NextResponse } from 'next/server';
import { verifyClaimedListingByToken, getClaimedListingByToken } from '@/lib/airtable';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Missing verification token' },
        { status: 400 }
      );
    }

    const success = await verifyClaimedListingByToken(token);

    if (!success) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Fetch the listing to get slug for dashboard redirect
    const listing = await getClaimedListingByToken(token);
    const slug = listing ? slugify(listing.fields.WineryName) : null;

    // Set the owner_token cookie so they're logged in immediately after verify
    const redirectUrl = slug
      ? new URL(`/dashboard/${slug}`, request.url)
      : new URL('/claim/success', request.url);

    const response = NextResponse.redirect(redirectUrl, { status: 303 });

    if (slug) {
      response.cookies.set('owner_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error verifying claim:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
