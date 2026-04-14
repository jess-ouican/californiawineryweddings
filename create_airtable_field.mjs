#!/usr/bin/env node
/**
 * Create GrapevineNote field in Airtable using REST API
 */
import fetch from 'node-fetch';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const TABLE_ID = 'tblCtgPoMhwcj0sXS'; // Venue Details table

async function createField() {
  console.log('Creating GrapevineNote field in Airtable...\n');

  const payload = {
    name: 'GrapevineNote',
    type: 'multilineText', // Long text field
    // description: 'Community tips about the venue from couples who researched it'
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/bases/${baseId}/tables/${TABLE_ID}/fields`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Field created successfully!');
      console.log(`Field ID: ${data.id}`);
      console.log(`Field Name: ${data.name}`);
      console.log(`Field Type: ${data.type}`);
    } else {
      console.error('❌ Failed to create field:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createField();
