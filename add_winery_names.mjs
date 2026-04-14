#!/usr/bin/env node
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

// Load grapevine notes to get winery names
const pass1 = JSON.parse(fs.readFileSync('/tmp/grapevine_results_pass1.json', 'utf-8'));
const pass2 = JSON.parse(fs.readFileSync('/tmp/grapevine_results_pass2.json', 'utf-8'));

const allResults = [...pass1, ...pass2];

async function main() {
  console.log(`\n${'='.repeat(140)}`);
  console.log('ADDING WINERY NAMES TO AIRTABLE RECORDS');
  console.log(`${'='.repeat(140)}\n`);

  let successful = 0;
  let failed = 0;

  for (const item of allResults) {
    const placeId = item.place_id;
    const venueName = item.venue_name;
    const grapevineNote = item.generated_grapevine_note;
    
    // Skip if no grapevine note (we didn't upsert it anyway)
    if (grapevineNote.toLowerCase() === 'null') {
      continue;
    }

    try {
      const existing = await venueDetailsTable
        .select({ filterByFormula: `{PlaceId} = "${placeId}"` })
        .firstPage();

      if (existing.length > 0) {
        const record = existing[0];
        // Add WineryName field if it doesn't exist
        await venueDetailsTable.update(record.id, {
          WineryName: venueName
        });
        console.log(`✅ Updated: ${venueName}`);
      } else {
        console.log(`⚠️  Not found: ${venueName} (PlaceId: ${placeId})`);
      }
      successful++;
    } catch (error) {
      console.error(`❌ Failed: ${venueName}`);
      console.error(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(140)}`);
  console.log(`SUMMARY: ${successful} processed, ${failed} failed`);
  console.log(`${'='.repeat(140)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
