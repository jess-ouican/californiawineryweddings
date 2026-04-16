import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1QLB1lFQTrK8__b_bSxtb19j1B6vI22cE_kvWXUjSXJI/edit?usp=sharing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Send the scorecard link to the user
    const userResult = await resend.emails.send({
      from: 'hello@send.californiawineryweddings.com',
      to: normalizedEmail,
      subject: '🍷 Your Winery Wedding Venue Scorecard is here',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#FAF8F3;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F3;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#5C1A1A;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                      <div style="font-size:32px;margin-bottom:10px;">🍷</div>
                      <h1 style="color:#FDF6EC;font-size:26px;margin:0 0 8px;font-family:Georgia,serif;font-weight:bold;">
                        Your Venue Scorecard Is Ready
                      </h1>
                      <p style="color:#C4536A;font-size:15px;margin:0;font-family:Arial,sans-serif;">
                        California Winery Weddings
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:40px;border-left:1px solid #e8ddd0;border-right:1px solid #e8ddd0;">

                      <p style="color:#1A1A1A;font-size:17px;line-height:1.7;margin:0 0 20px;font-family:Arial,sans-serif;">
                        Here's your <strong>California Winery Wedding Venue Scorecard</strong> — a Google Sheet built specifically for couples touring wine country venues.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${SHEET_URL}"
                               style="display:inline-block;background:#5C1A1A;color:#FDF6EC;font-family:Arial,sans-serif;font-size:17px;font-weight:bold;padding:16px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                              Open Your Scorecard →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- How to use -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF6EC;border-radius:8px;padding:0;margin:0 0 28px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <p style="color:#5C1A1A;font-size:14px;font-weight:bold;margin:0 0 14px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">
                              HOW TO USE IT
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.5;">
                                  <strong style="color:#5C1A1A;">1.</strong>&nbsp; Click the button above to open the sheet
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.5;">
                                  <strong style="color:#5C1A1A;">2.</strong>&nbsp; <strong>File → Make a copy</strong> to save it to your own Google Drive
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.5;">
                                  <strong style="color:#5C1A1A;">3.</strong>&nbsp; Score each of the 35 criteria (1–5) after every venue tour
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.5;">
                                  <strong style="color:#5C1A1A;">4.</strong>&nbsp; Weighted totals calculate automatically — compare up to 3 venues
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- What's inside -->
                      <p style="color:#5C1A1A;font-size:14px;font-weight:bold;margin:0 0 12px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">
                        WHAT'S INSIDE
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                        <tr>
                          <td width="50%" style="padding:6px 8px 6px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ 35 winery-specific criteria
                          </td>
                          <td width="50%" style="padding:6px 0 6px 8px;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ Weighted scoring out of 100
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 8px 6px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ Side-by-side 3-venue comparison
                          </td>
                          <td style="padding:6px 0 6px 8px;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ 15 red flags to watch for
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 8px 6px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ 15 questions to ask every venue
                          </td>
                          <td style="padding:6px 0 6px 8px;font-family:Arial,sans-serif;font-size:14px;color:#333;vertical-align:top;">
                            ✅ CA region quick-guide
                          </td>
                        </tr>
                      </table>

                      <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 8px;font-family:Arial,sans-serif;">
                        Winery weddings have gotchas that generic venue checklists miss — wine minimums, corkage policies, harvest season conflicts, noise ordinance cutoffs. This scorecard covers all of it.
                      </p>
                      <p style="color:#555;font-size:14px;line-height:1.7;margin:0;font-family:Arial,sans-serif;">
                        Good luck with your tours. You've got this. 🥂
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#F5ECD7;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;border-left:1px solid #e8ddd0;border-right:1px solid #e8ddd0;border-bottom:1px solid #e8ddd0;">
                      <p style="color:#8B5A3C;font-size:13px;margin:0 0 8px;font-family:Arial,sans-serif;font-weight:bold;">
                        California Winery Weddings
                      </p>
                      <p style="color:#999;font-size:12px;margin:0;font-family:Arial,sans-serif;">
                        435+ verified winery venues across all of California's wine regions.<br>
                        <a href="https://www.californiawineryweddings.com" style="color:#8B5A3C;text-decoration:none;">californiawineryweddings.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (userResult.error) {
      console.error('[SCORECARD] Resend error:', userResult.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('[SCORECARD] ✓ Sent scorecard to:', normalizedEmail, '| id:', userResult.data?.id);

    // Notify internal inbox
    await resend.emails.send({
      from: 'hello@send.californiawineryweddings.com',
      to: 'hello@californiawineryweddings.com',
      subject: `🍷 New Scorecard Lead: ${normalizedEmail}`,
      html: `<p>New venue scorecard download from <strong>${normalizedEmail}</strong></p><p style="font-size:12px;color:#999;">California Winery Weddings lead gen</p>`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('[SCORECARD] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
