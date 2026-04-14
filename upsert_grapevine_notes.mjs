#!/usr/bin/env node
/**
 * Upsert GrapevineNotes to Airtable Venue Details
 */
import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);
const venueDetailsTable = base('tblCtgPoMhwcj0sXS');

// Load grapevine notes
const pass1 = JSON.parse(fs.readFileSync('/tmp/grapevine_results_pass1.json', 'utf-8'));
const pass2 = JSON.parse(fs.readFileSync('/tmp/grapevine_results_pass2.json', 'utf-8'));

const allResults = [...pass1, ...pass2];

async function main() {
  console.log(`\n${'='.repeat(140)}`);
  console.log('AIRTABLE UPSERT: GrapevineNotes');
  console.log(`${'='.repeat(140)}\n`);

  let successful = 0;
  let failed = 0;
  const results = [];

  for (const item of allResults) {
    const placeId = item.place_id;
    const venueName = item.venue_name;
    const grapevineNote = item.generated_grapevine_note;
    
    // Skip null notes
    if (grapevineNote.toLowerCase() === 'null') {
      console.log(`⊘ [SKIP] ${venueName} (no substantive note)`);
      continue;
    }

    try {
      // Check if record exists
      const existing = await venueDetailsTable
        .select({ filterByFormula: `{PlaceId} = "${placeId}"` })
        .firstPage();

      const fields = {
        PlaceId: placeId,
        GrapevineNote: grapevineNote
      };

      let operation = 'CREATE';

      if (existing.length > 0) {
        // Update existing
        operation = 'UPDATE';
        await venueDetailsTable.update(existing[0].id, fields);
        console.log(`✅ [${operation}] ${venueName}`);
        console.log(`   Record ID: ${existing[0].id}`);
      } else {
        // Create new
        const record = await venueDetailsTable.create(fields);
        console.log(`✅ [${operation}] ${venueName}`);
        console.log(`   Record ID: ${record.id}`);
      }

      successful++;
      results.push({ venueName, placeId, operation, success: true });
    } catch (error) {
      console.error(`❌ [FAILED] ${venueName}`);
      console.error(`   Error: ${error.message}`);
      failed++;
      results.push({ venueName, placeId, success: false, error: error.message });
    }

    console.log('');
  }

  console.log(`${'='.repeat(140)}`);
  console.log(`SUMMARY: ${successful} successful, ${failed} failed`);
  console.log(`${'='.repeat(140)}\n`);

  if (failed > 0) {
    console.log('❌ Some records failed:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  • ${r.venueName}: ${r.error}`);
    });
  } else {
    console.log('✅ All GrapevineNotes successfully uperted!');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
