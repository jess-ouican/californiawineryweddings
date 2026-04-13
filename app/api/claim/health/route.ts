import { NextResponse } from 'next/server';

/**
 * Health check endpoint for debugging the claiming system
 */
export async function GET() {
  const checks: Record<string, string> = {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? '✓ Set' : '✗ Missing',
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? '✓ Set' : '✗ Missing',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing',
  };

  return NextResponse.json(checks);
}
