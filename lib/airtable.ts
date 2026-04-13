import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const claimedListingsTable = base('Claimed Listings');

export interface ClaimedListing {
  id?: string;
  fields: {
    PlaceId: string;
    WineryName: string;
    OwnerName: string;
    OwnerEmail: string;
    Role?: string;
    ClaimedAt?: string;
    Verified?: boolean;
    Token?: string;
    ListingURL?: string;
  };
}

/**
 * Create a new claimed listing record
 */
export async function createClaimedListing(
  placeId: string,
  wineryName: string,
  ownerName: string,
  ownerEmail: string,
  token: string,
  role?: string,
  listingURL?: string
): Promise<ClaimedListing> {
  const record = await claimedListingsTable.create({
    PlaceId: placeId,
    WineryName: wineryName,
    OwnerName: ownerName,
    OwnerEmail: ownerEmail,
    Role: role || '',
    Token: token,
    Verified: false,
    ClaimedAt: new Date().toISOString(),
    ListingURL: listingURL || '',
  });

  return {
    id: record.id,
    fields: record.fields as ClaimedListing['fields'],
  };
}

/**
 * Verify a claimed listing by token
 */
export async function verifyClaimedListingByToken(token: string): Promise<boolean> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: `{Token} = "${token}"`,
      })
      .firstPage();

    if (records.length === 0) {
      return false;
    }

    const record = records[0];
    await claimedListingsTable.update(record.id, {
      Verified: true,
    });

    return true;
  } catch (error) {
    console.error('Error verifying listing:', error);
    return false;
  }
}

/**
 * Check if a winery is already claimed
 */
export async function isWineryClaimed(placeId: string): Promise<{ claimed: boolean; verified: boolean; email?: string }> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: `{PlaceId} = "${placeId}"`,
      })
      .firstPage();

    if (records.length === 0) {
      return { claimed: false, verified: false };
    }

    const fields = records[0].fields as ClaimedListing['fields'];
    return {
      claimed: true,
      verified: fields.Verified || false,
      email: fields.OwnerEmail,
    };
  } catch (error) {
    console.error('Error checking claimed status:', error);
    return { claimed: false, verified: false };
  }
}

/**
 * Get verified claimed listings (for sorting region pages)
 */
export async function getVerifiedClaimedPlaceIds(): Promise<string[]> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: '{Verified} = TRUE()',
      })
      .all();

    return records.map((r) => (r.fields as ClaimedListing['fields']).PlaceId);
  } catch (error) {
    console.error('Error fetching verified claimed listings:', error);
    return [];
  }
}
