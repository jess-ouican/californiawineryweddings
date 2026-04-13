import { NextRequest, NextResponse } from 'next/server';
import { verifyClaimedListingByToken } from '@/lib/airtable';

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

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/claim/success', request.url),
      { status: 303 }
    );
  } catch (error) {
    console.error('Error verifying claim:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
