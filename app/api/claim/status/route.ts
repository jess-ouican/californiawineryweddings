import { NextRequest, NextResponse } from 'next/server';
import { isWineryClaimed } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const placeId = request.nextUrl.searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { message: 'Missing placeId' },
        { status: 400 }
      );
    }

    const claimStatus = await isWineryClaimed(placeId);

    return NextResponse.json({
      claimed: claimStatus.claimed,
      verified: claimStatus.verified,
      email: claimStatus.email,
    });
  } catch (error) {
    console.error('Error checking claim status:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
