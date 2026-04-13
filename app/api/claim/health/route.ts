import { NextResponse } from 'next/server';

/**
 * Health check endpoint for debugging the claiming system
 */
export async function GET() {
  const checks: Record<string, any> = {
    env: {
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? '✓ Set' : '✗ Missing',
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? '✓ Set' : '✗ Missing',
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing',
    },
  };

  // Test Airtable connection
  try {
    const Airtable = require('airtable');
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    const table = base('Claimed Listings');
    await table.select({ maxRecords: 1 }).firstPage();
    checks.airtable = '✓ Connected';
  } catch (error) {
    checks.airtable = `✗ ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  // Test Resend
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    checks.resend = '✓ Configured';
  } catch (error) {
    checks.resend = `✗ ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return NextResponse.json(checks);
}
