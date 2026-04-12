import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { LeadFormData } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, weddingDate, guestCount, preferredRegion, message, wineryName } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !weddingDate || !guestCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the email body
    const emailBody = `
New Wedding Inquiry Received

Couple Information:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Wedding Details:
Winery: ${wineryName || 'Not specified'}
Wedding Date: ${weddingDate}
Guest Count: ${guestCount}
Preferred Region: ${preferredRegion || 'Not specified'}

Additional Notes:
${message || 'None'}

---
This inquiry was submitted through californiawineryweddings.com
    `.trim();

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'hello@send.californiawineryweddings.com',
      to: 'hello@californiawineryweddings.com',
      subject: `New Wedding Inquiry - ${wineryName || 'Winery Contact'}`,
      text: emailBody,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6B3E2E;">New Wedding Inquiry Received</h2>
          
          <h3 style="color: #6B3E2E; margin-top: 20px;">Couple Information</h3>
          <p>
            <strong>Name:</strong> ${firstName} ${lastName}<br/>
            <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br/>
            <strong>Phone:</strong> <a href="tel:${phone}">${phone}</a>
          </p>
          
          <h3 style="color: #6B3E2E; margin-top: 20px;">Wedding Details</h3>
          <p>
            <strong>Winery:</strong> ${wineryName || 'Not specified'}<br/>
            <strong>Wedding Date:</strong> ${weddingDate}<br/>
            <strong>Guest Count:</strong> ${guestCount}<br/>
            <strong>Preferred Region:</strong> ${preferredRegion || 'Not specified'}
          </p>
          
          ${message ? `
          <h3 style="color: #6B3E2E; margin-top: 20px;">Additional Notes</h3>
          <p style="white-space: pre-wrap;">${message}</p>
          ` : ''}
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            This inquiry was submitted through <a href="https://californiawineryweddings.com">californiawineryweddings.com</a>
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send inquiry email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        id: result.data?.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
