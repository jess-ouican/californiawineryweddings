import { NextRequest, NextResponse } from 'next/server';
import { getClaimedListingByPlaceId } from '@/lib/airtable';
import { getWineryBySlug, slugify } from '@/lib/utils';
import { loadWineries } from '@/lib/data';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/dashboard/request-link
 * Body: { slug: string }
 * Looks up the verified owner email for the winery, sends a new magic link.
 */
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    // Load winery data to get placeId
    const wineries = await loadWineries();
    const winery = getWineryBySlug(wineries, slug);
    if (!winery) {
      return NextResponse.json({ message: 'Winery not found' }, { status: 404 });
    }

    // Get verified claimed listing
    const listing = await getClaimedListingByPlaceId(winery.placeId);
    if (!listing) {
      return NextResponse.json(
        { message: 'No verified owner found for this listing. Please claim it first.' },
        { status: 404 }
      );
    }

    const { OwnerEmail, WineryName, Token } = listing.fields;

    // Send a magic link using the existing token
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.californiawineryweddings.com'}/api/dashboard/auth?token=${Token}&slug=${slugify(WineryName)}`;

    await resend.emails.send({
      from: 'California Winery Weddings <onboarding@resend.dev>',
      to: OwnerEmail,
      subject: `Your Dashboard Access Link — ${WineryName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #6B3E2E 0%, #8B5A3C 100%); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px;">California Winery Weddings</h1>
            </div>
            <div style="padding: 40px 20px; background: #FDF8F3;">
              <h2 style="color: #6B3E2E; font-family: Georgia, serif;">Dashboard Access Link</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Click the button below to access your owner dashboard for <strong>${WineryName}</strong>.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLinkUrl}" style="display: inline-block; background-color: #6B3E2E; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Access My Dashboard
                </a>
              </div>
              <p style="color: #777; font-size: 14px;">
                Or copy this link:<br>
                <code style="background: #F5F5F5; padding: 2px 6px; border-radius: 3px; word-break: break-all;">${magicLinkUrl}</code>
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                This link will log you in automatically and keep you logged in for 30 days.
              </p>
              <div style="border-top: 1px solid #DDD; margin-top: 40px; padding-top: 20px; color: #999; font-size: 12px;">
                <p>Questions? Contact us at support@californiawineryweddings.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ message: 'Access link sent to your verified email address.' });
  } catch (error) {
    console.error('[DASHBOARD REQUEST-LINK] Error:', error);
    return NextResponse.json({ message: 'Failed to send access link.' }, { status: 500 });
  }
}
