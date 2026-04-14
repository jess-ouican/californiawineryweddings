#!/usr/bin/env node
/**
 * Re-enrich venue data by passing through Claude Haiku for polishing
 * - Cost estimates → parse numeric ranges
 * - What's included → rewrite as 1-2 sentence description
 * - Other notes → extract objective facts only
 * - Capacity → parse number
 * - Music limitations → note if notable
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

const rawData = JSON.parse(fs.readFileSync('/tmp/raw_venue_data_for_haiku.json', 'utf-8'));

async function polishWithHaiku(field, value) {
  if (!value || value.toLowerCase() === 'unknown' || value === '') {
    return null;
  }

  let prompt = '';
  let fieldName = '';

  switch (field) {
    case 'cost_estimate':
      fieldName = 'Cost Estimate';
      prompt = `Extract numeric pricing ranges from this cost estimate. Return a JSON object with:
- ceremonyFeeMin: number or null
- ceremonyFeeMax: number or null
- packagePriceMin: number or null (per-person F&B floor)
- packagePriceMax: number or null (per-person F&B ceiling)
- serviceChargePercent: number or null (as integer, e.g. 22 for 22%)

If a value isn't clearly stated, use null. Do not guess.

Raw: "${value}"

Return ONLY valid JSON, no explanation.`;
      break;

    case 'whats_included':
      fieldName = "What's Included";
      prompt = `Rewrite this semicolon-separated list of wedding package inclusions as a clean 1-2 sentence description for a venue directory. Warm, professional tone. Keep all facts accurate, omit nothing, add nothing.

Raw: "${value}"

Return ONLY the rewritten description, no quotes or explanation.`;
      break;

    case 'other_notes':
      fieldName = 'Other Notes → GrapevineNote';
      prompt = `A couple wrote personal notes about a wedding venue. Extract ONLY objective, factual observations that would be useful to other couples. Ignore personal preferences, emotions, or reasons specific to this couple. Rewrite as one neutral, factual sentence. If there are no objective facts (only personal opinion), return "null".

Examples:
- "it didn't feel as special to me personally" → null
- "Has a list of recommended vendors, but these are not required" → "Maintains a recommended vendor list, though outside vendors are permitted."
- "decided 10 PM end time was too early" → "Events conclude by 10 PM."

Raw: "${value}"

Return ONLY the rewritten note or "null", no explanation.`;
      break;

    case 'capacity':
      fieldName = 'Capacity';
      // Just parse the number
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : null;

    case 'music_limitations':
      fieldName = 'Music Limitations';
      if (!value) return null;
      prompt = `Extract any objective limitations on music/amplified sound. Be concise, factual. Return a short phrase or null if not notable.

Raw: "${value}"

Return ONLY the extracted limitation or "null", no explanation.`;
      break;

    default:
      return null;
  }

  if (field === 'capacity') {
    // Already handled above
    return null;
  }

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const result = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    // Handle JSON responses
    if (field === 'cost_estimate') {
      try {
        return JSON.parse(result);
      } catch {
        return null;
      }
    }

    // Handle "null" string responses
    if (result.toLowerCase() === 'null') {
      return null;
    }

    return result || null;
  } catch (error) {
    console.error(`  ✗ API error for ${fieldName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log(`\n${'='.repeat(140)}`);
  console.log('VENUE DATA POLISHING WITH CLAUDE HAIKU');
  console.log(`${'='.repeat(140)}\n`);

  const polished = [];

  for (const venue of rawData) {
    console.log(`\n📍 ${venue.venue_name}`);
    console.log(`   Place ID: ${venue.place_id}\n`);

    const polishedVenue = {
      venue_name: venue.venue_name,
      place_id: venue.place_id,
      fields: {},
    };

    // Cost Estimate
    if (venue.cost_estimate) {
      console.log(`   💰 Cost Estimate: "${venue.cost_estimate.substring(0, 50)}..."`);
      const parsed = await polishWithHaiku('cost_estimate', venue.cost_estimate);
      if (parsed) {
        polishedVenue.fields.CeremonyFeeMin = parsed.ceremonyFeeMin;
        polishedVenue.fields.CeremonyFeeMax = parsed.ceremonyFeeMax;
        polishedVenue.fields.PackagePriceMin = parsed.packagePriceMin;
        polishedVenue.fields.PackagePriceMax = parsed.packagePriceMax;
        polishedVenue.fields.ServiceChargePercent = parsed.serviceChargePercent;
        console.log(`      ✓ Parsed: fees ${parsed.ceremonyFeeMin ? `$${parsed.ceremonyFeeMin}` : 'unknown'}-${parsed.ceremonyFeeMax ? `$${parsed.ceremonyFeeMax}` : 'unknown'}, package ${parsed.packagePriceMin ? `$${parsed.packagePriceMin}` : 'unknown'}-${parsed.packagePriceMax ? `$${parsed.packagePriceMax}` : 'unknown'} pp`);
      } else {
        console.log(`      ⊘ No numeric values found`);
      }
    }

    // What's Included
    if (venue.whats_included) {
      console.log(`   📦 What's Included: "${venue.whats_included.substring(0, 50)}..."`);
      const polished_text = await polishWithHaiku('whats_included', venue.whats_included);
      if (polished_text) {
        polishedVenue.fields.PackageIncludes = polished_text;
        console.log(`      ✓ Rewritten: "${polished_text}"`);
      }
    }

    // Capacity
    if (venue.capacity) {
      console.log(`   👥 Capacity: "${venue.capacity}"`);
      const parsed_capacity = polishWithHaiku('capacity', venue.capacity);
      if (parsed_capacity) {
        polishedVenue.fields.MaxGuests = parsed_capacity;
        console.log(`      ✓ Parsed: ${parsed_capacity} guests`);
      }
    }

    // Music Limitations
    if (venue.music_limitations) {
      console.log(`   🎵 Music Limitations: "${venue.music_limitations.substring(0, 50)}..."`);
      const music_note = await polishWithHaiku('music_limitations', venue.music_limitations);
      if (music_note) {
        console.log(`      ✓ Extracted: "${music_note}"`);
        // Store this as a note for reference
        if (!polishedVenue.fields.MusicNote) {
          polishedVenue.fields.MusicNote = music_note;
        }
      }
    }

    // Other Notes
    if (venue.other_notes) {
      console.log(`   📝 Other Notes: "${venue.other_notes.substring(0, 50)}..."`);
      const grapevine = await polishWithHaiku('other_notes', venue.other_notes);
      if (grapevine && grapevine !== 'null') {
        polishedVenue.fields.GrapevineNote = grapevine;
        console.log(`      ✓ GrapevineNote: "${grapevine}"`);
      } else {
        console.log(`      ⊘ No objective facts (skipping)`);
      }
    }

    polished.push(polishedVenue);
  }

  console.log(`\n${'='.repeat(140)}`);
  console.log('POLISHING COMPLETE');
  console.log(`${'='.repeat(140)}\n`);

  // Save results
  fs.writeFileSync('/tmp/polished_venue_data.json', JSON.stringify(polished, null, 2));
  console.log('✓ Results saved to /tmp/polished_venue_data.json\n');

  // Summary
  console.log('SUMMARY OF POLISHED FIELDS:');
  for (const venue of polished) {
    const fieldCount = Object.keys(venue.fields).length;
    console.log(`  ${venue.venue_name}: ${fieldCount} fields polished`);
    for (const [key, value] of Object.entries(venue.fields)) {
      if (value !== null && value !== undefined) {
        const preview = typeof value === 'string' ? value.substring(0, 40) : value;
        console.log(`    • ${key}: ${preview}${typeof value === 'string' && value.length > 40 ? '...' : ''}`);
      }
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
