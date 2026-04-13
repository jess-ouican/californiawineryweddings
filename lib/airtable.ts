import Airtable, { FieldSet } from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const claimedListingsTable = base('Claimed Listings');
export const venueDetailsTable = base('Venue Details');

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
  try {
    console.log('[AIRTABLE] Creating claimed listing:', { placeId, wineryName, ownerEmail });
    const record = await claimedListingsTable.create({
      PlaceId: placeId,
      WineryName: wineryName,
      OwnerName: ownerName,
      OwnerEmail: ownerEmail,
      Role: role || '',
      Token: token,
      Verified: false,
      ClaimedAt: new Date().toISOString().split('T')[0], // Date-only format for Airtable
      ListingURL: listingURL || '',
    });

    console.log('[AIRTABLE] ✓ Record created:', record.id);
    return {
      id: record.id,
      fields: record.fields as ClaimedListing['fields'],
    };
  } catch (error) {
    console.error('[AIRTABLE] ✗ Failed to create record:', error instanceof Error ? error.message : error);
    throw error;
  }
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

/**
 * Get owner email by placeId (returns email only if verified)
 */
export async function getOwnerEmailByPlaceId(placeId: string): Promise<string | null> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: `AND({PlaceId} = "${placeId}", {Verified} = TRUE())`,
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    const fields = records[0].fields as ClaimedListing['fields'];
    return fields.OwnerEmail;
  } catch (error) {
    console.error('Error fetching owner email:', error);
    return null;
  }
}

/**
 * Get a claimed listing by token (for dashboard auth)
 */
export async function getClaimedListingByToken(token: string): Promise<ClaimedListing | null> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: `AND({Token} = "${token}", {Verified} = TRUE())`,
      })
      .firstPage();

    if (records.length === 0) return null;
    return {
      id: records[0].id,
      fields: records[0].fields as ClaimedListing['fields'],
    };
  } catch (error) {
    console.error('Error fetching listing by token:', error);
    return null;
  }
}

/**
 * Get a verified claimed listing by placeId
 */
export async function getClaimedListingByPlaceId(placeId: string): Promise<ClaimedListing | null> {
  try {
    const records = await claimedListingsTable
      .select({
        filterByFormula: `AND({PlaceId} = "${placeId}", {Verified} = TRUE())`,
      })
      .firstPage();

    if (records.length === 0) return null;
    return {
      id: records[0].id,
      fields: records[0].fields as ClaimedListing['fields'],
    };
  } catch (error) {
    console.error('Error fetching listing by placeId:', error);
    return null;
  }
}

// ── Venue Details ──────────────────────────────────────────────────────────────

export interface VenueDetails {
  id?: string;
  PlaceId: string;
  WineryName?: string;
  // Pricing
  CeremonyFeeMin?: number;
  CeremonyFeeMax?: number;
  PackagePriceMin?: number;
  PackagePriceMax?: number;
  PackageIncludes?: string;
  ServiceChargePercent?: number;
  // Capacity
  MinGuests?: number;
  MaxGuests?: number;
  IndoorCeremonyCapacity?: number;
  OutdoorCeremonyCapacity?: number;
  IndoorReceptionCapacity?: number;
  OutdoorReceptionCapacity?: number;
  // Venue Details
  Catering?: string;
  Alcohol?: string;
  AmplifiedMusic?: string;
  WheelchairAccessible?: boolean;
  Availability?: string;
  SeasonDetails?: string;
  EventTypes?: string; // comma-separated
  // Tags
  StyleTags?: string; // comma-separated
  ViewTags?: string; // comma-separated
  // Description
  Description?: string;
  // Photos
  PhotoUrls?: string; // JSON array string
}

/**
 * Get venue details by placeId
 */
export async function getVenueDetails(placeId: string): Promise<VenueDetails | null> {
  try {
    const records = await venueDetailsTable
      .select({
        filterByFormula: `{PlaceId} = "${placeId}"`,
      })
      .firstPage();

    if (records.length === 0) return null;
    const f = records[0].fields as Record<string, unknown>;
    return {
      id: records[0].id,
      PlaceId: (f.PlaceId as string) || placeId,
      WineryName: f.WineryName as string | undefined,
      CeremonyFeeMin: f.CeremonyFeeMin as number | undefined,
      CeremonyFeeMax: f.CeremonyFeeMax as number | undefined,
      PackagePriceMin: f.PackagePriceMin as number | undefined,
      PackagePriceMax: f.PackagePriceMax as number | undefined,
      PackageIncludes: f.PackageIncludes as string | undefined,
      ServiceChargePercent: f.ServiceChargePercent as number | undefined,
      MinGuests: f.MinGuests as number | undefined,
      MaxGuests: f.MaxGuests as number | undefined,
      IndoorCeremonyCapacity: f.IndoorCeremonyCapacity as number | undefined,
      OutdoorCeremonyCapacity: f.OutdoorCeremonyCapacity as number | undefined,
      IndoorReceptionCapacity: f.IndoorReceptionCapacity as number | undefined,
      OutdoorReceptionCapacity: f.OutdoorReceptionCapacity as number | undefined,
      Catering: f.Catering as string | undefined,
      Alcohol: f.Alcohol as string | undefined,
      AmplifiedMusic: f.AmplifiedMusic as string | undefined,
      WheelchairAccessible: f.WheelchairAccessible as boolean | undefined,
      Availability: f.Availability as string | undefined,
      SeasonDetails: f.SeasonDetails as string | undefined,
      EventTypes: f.EventTypes as string | undefined,
      StyleTags: f.StyleTags as string | undefined,
      ViewTags: f.ViewTags as string | undefined,
      Description: f.Description as string | undefined,
      PhotoUrls: f.PhotoUrls as string | undefined,
    };
  } catch (error) {
    console.error('Error fetching venue details:', error);
    return null;
  }
}

/**
 * Save (upsert) venue details for a placeId
 */
export async function saveVenueDetails(data: VenueDetails): Promise<void> {
  try {
    const existing = await venueDetailsTable
      .select({ filterByFormula: `{PlaceId} = "${data.PlaceId}"` })
      .firstPage();

    // Build the fields object — strip undefined, cast to Airtable-compatible type
    type AirtableValue = string | number | boolean | undefined;
    const fields: Record<string, AirtableValue> = {};
    const keys = Object.keys(data) as (keyof VenueDetails)[];
    for (const k of keys) {
      if (k === 'id') continue;
      const v = data[k];
      if (v !== undefined && v !== null) {
        fields[k] = v as AirtableValue;
      }
    }

    if (existing.length > 0) {
      await venueDetailsTable.update(existing[0].id, fields as Partial<FieldSet>);
    } else {
      await venueDetailsTable.create(fields as Partial<FieldSet>);
    }
  } catch (error) {
    console.error('Error saving venue details:', error);
    throw error;
  }
}
