import { NextRequest, NextResponse } from 'next/server';
import { createClaimedListing, isWineryClaimed } from '@/lib/airtable';
import { Resend } from 'resend';
import cryptoRandomString from 'crypto-random-string';

const resend = new Resend(process.env.RESEND_API_KEY);

function validateDomainEmail(email: string): boolean {
  // Test bypass: allow test@californiawineryweddings.com for internal testing
  if (email.toLowerCase() === 'test@californiawineryweddings.com') {
    console.log('[CLAIM] Test bypass active: test@californiawineryweddings.com');
    return true;
  }

  // Must have a domain (not gmail, yahoo, etc.)
  const blockedDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'protonmail.com',
    'icloud.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !blockedDomains.includes(domain) : false;
}

export async function POST(request: NextRequest) {
  console.log('[CLAIM] POST request received');
  try {
    const body = await request.json();
    console.log('[CLAIM] Request body:', { placeId: body.placeId, wineryName: body.wineryName, ownerEmail: body.ownerEmail });
    const { placeId, wineryName, ownerName, ownerEmail, role, listingURL } = body;

    // Validate input
    if (!placeId || !wineryName || !ownerName || !ownerEmail) {
      console.log('[CLAIM] Missing fields:', { placeId: !!placeId, wineryName: !!wineryName, ownerName: !!ownerName, ownerEmail: !!ownerEmail });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate domain email
    if (!validateDomainEmail(ownerEmail)) {
      console.log('[CLAIM] Invalid domain email:', ownerEmail);
      return NextResponse.json(
        {
          message:
            'Please use your official winery domain email (e.g., info@yourwinery.com). Personal email addresses like Gmail are not accepted for verification.',
        },
        { status: 400 }
      );
    }

    // Check if already claimed
    console.log('[CLAIM] Checking if already claimed:', placeId);
    const claimStatus = await isWineryClaimed(placeId);
    if (claimStatus.claimed) {
      console.log('[CLAIM] Already claimed by:', claimStatus.email);
      return NextResponse.json(
        {
          message: `This winery was already claimed on ${claimStatus.email}. If you represent this winery, please contact support.`,
        },
        { status: 409 }
      );
    }

    // Generate verification token
    console.log('[CLAIM] Generating token');
    const token = cryptoRandomString({ length: 32, type: 'url-safe' });

    // Create record in Airtable
    console.log('[CLAIM] Creating Airtable record');
    const claimedListing = await createClaimedListing(
      placeId,
      wineryName,
      ownerName,
      ownerEmail,
      token,
      role,
      listingURL
    );
    console.log('[CLAIM] ✓ Airtable record created:', claimedListing.id);

    // Send verification email via Resend
    console.log('[CLAIM] Sending email to:', ownerEmail);
    const verifyUrl = `https://californiawineryweddings.vercel.app/claim/verify?token=${token}`;

    const emailResult = await resend.emails.send({
      from: 'California Winery Weddings <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Verify Your Winery Listing - ${wineryName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #6B3E2E 0%, #8B5A3C 100%); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 32px;">California Winery Weddings</h1>
            </div>
            
            <div style="padding: 40px 20px; background: #FDF8F3;">
              <h2 style="color: #6B3E2E; font-family: Georgia, serif; font-size: 24px;">Verify Your Winery Listing</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hi <strong>${ownerName}</strong>,
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Thank you for claiming your listing for <strong>${wineryName}</strong>. 
                To verify ownership and unlock your "Verified Owner" badge, please click the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background-color: #6B3E2E; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Verify Ownership
                </a>
              </div>
              
              <p style="color: #777; font-size: 14px;">
                Or copy and paste this link in your browser:<br>
                <code style="background: #F5F5F5; padding: 2px 6px; border-radius: 3px;">
                  ${verifyUrl}
                </code>
              </p>
              
              <p style="color: #777; font-size: 14px; margin-top: 20px;">
                This verification link expires in 24 hours.
              </p>
              
              <div style="border-top: 1px solid #DDD; margin-top: 40px; padding-top: 20px; color: #999; font-size: 12px;">
                <p>Questions? Contact us at support@californiawineryweddings.com</p>
                <p style="margin: 5px 0;">© 2024 California Winery Weddings. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log('[CLAIM] ✓ Email sent:', emailResult);

    console.log('[CLAIM] ✓ Success');
    return NextResponse.json(
      {
        message: 'Claim submitted successfully. Check your email for verification link.',
        recordId: claimedListing.id,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CLAIM] ✗ FATAL ERROR:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : null,
      fullError: JSON.stringify(error),
    });
    
    // More specific error messages
    if (errorMessage.includes('Resend')) {
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }
    
    if (errorMessage.includes('Airtable')) {
      return NextResponse.json(
        { message: 'Failed to create listing record. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
