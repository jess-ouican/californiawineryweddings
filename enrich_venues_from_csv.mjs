#!/usr/bin/env node
/**
 * Enrich Airtable Venue Details with data from Bay Area wedding venue research
 */
import Airtable from 'airtable';
import fs from 'fs';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);
const venueDetailsTable = base('tblCtgPoMhwcj0sXS');

// Load enrichments
const enrichmentsJson = fs.readFileSync('/tmp/enrichments.json', 'utf-8');
const enrichments = JSON.parse(enrichmentsJson);

async function main() {
  console.log(`\n${'='.repeat(140)}`);
  console.log('AIRTABLE UPSERT: Venue Details Enrichment');
  console.log(`${'='.repeat(140)}\n`);

  let successful = 0;
  let failed = 0;
  const results = [];

  for (const item of enrichments) {
    const placeId = item.payload.PlaceId;
    const wineryName = item.winery.title;
    
    try {
      // Check if record exists
      const existing = await venueDetailsTable
        .select({ filterByFormula: `{PlaceId} = "${placeId}"` })
        .firstPage();

      const fields = item.payload;
      let operation = 'CREATE';

      if (existing.length > 0) {
        // Update existing
        operation = 'UPDATE';
        await venueDetailsTable.update(existing[0].id, fields);
        console.log(`✅ [${operation}] ${wineryName} (${placeId})`);
        console.log(`   Record ID: ${existing[0].id}`);
      } else {
        // Create new
        const record = await venueDetailsTable.create(fields);
        console.log(`✅ [${operation}] ${wineryName} (${placeId})`);
        console.log(`   Record ID: ${record.id}`);
      }

      // Log what was written
      const fieldCount = Object.keys(fields).length;
      console.log(`   Fields: ${fieldCount} | ${Object.keys(fields).join(', ')}`);
      
      successful++;
      results.push({ wineryName, placeId, operation, success: true });
    } catch (error) {
      console.error(`❌ [FAILED] ${wineryName} (${placeId})`);
      console.error(`   Error: ${error.message}`);
      failed++;
      results.push({ wineryName, placeId, success: false, error: error.message });
    }

    console.log('');
  }

  console.log(`${'='.repeat(140)}`);
  console.log(`SUMMARY: ${successful} successful, ${failed} failed out of ${enrichments.length} total`);
  console.log(`${'='.repeat(140)}\n`);

  if (failed > 0) {
    console.log('❌ Some records failed:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  • ${r.wineryName}: ${r.error}`);
    });
  } else {
    console.log('✅ All records successfully enriched!');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
