import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_ID = 'tbllUoc5JJ4ojZtV3';

interface VenueData {
  name: string;
  region: string;
  guestMin: string;
  guestMax: string;
  venueRentalFee: string;
  wineMinimum: string;
  corkageFee: string;
  cateringStyle: string;
  cateringCostPer: string;
  ceremonyIncluded: string;
  ceremonyFee: string;
  indoorSpace: string;
  outdoorSpace: string;
  noiseOrdinance: string;
  vendorHours: string;
  exclusivity: string;
  accommodation: string;
  harvestBlackout: string;
  parkingSpots: string;
  notes: string;
}

interface SubmissionPayload {
  guestCount: string;
  venues: VenueData[];
  scores: number[];
  winnerName: string;
  winnerScore: number;
}

function num(val: string | undefined): number | undefined {
  const n = parseFloat(val || '');
  return isNaN(n) ? undefined : n;
}

function venueFields(v: VenueData, score: number, prefix: string): Record<string, string | number | undefined> {
  return {
    [`${prefix}_Name`]:            v.name || undefined,
    [`${prefix}_Region`]:          v.region || undefined,
    [`${prefix}_GuestMin`]:        num(v.guestMin),
    [`${prefix}_GuestMax`]:        num(v.guestMax),
    [`${prefix}_RentalFee`]:       num(v.venueRentalFee),
    [`${prefix}_WineMinimum`]:     num(v.wineMinimum),
    [`${prefix}_CorkageFee`]:      num(v.corkageFee),
    [`${prefix}_CateringStyle`]:   v.cateringStyle || undefined,
    [`${prefix}_CateringPerPerson`]: num(v.cateringCostPer),
    [`${prefix}_CeremonyIncluded`]: v.ceremonyIncluded || undefined,
    [`${prefix}_CeremonyFee`]:     num(v.ceremonyFee),
    [`${prefix}_IndoorSpace`]:     v.indoorSpace || undefined,
    [`${prefix}_OutdoorSpace`]:    v.outdoorSpace || undefined,
    [`${prefix}_NoiseOrdinance`]:  v.noiseOrdinance || undefined,
    [`${prefix}_VendorHours`]:     v.vendorHours || undefined,
    [`${prefix}_Exclusivity`]:     v.exclusivity || undefined,
    [`${prefix}_Accommodation`]:   v.accommodation || undefined,
    [`${prefix}_HarvestBlackout`]: v.harvestBlackout || undefined,
    [`${prefix}_ParkingSpots`]:    num(v.parkingSpots),
    [`${prefix}_Notes`]:           v.notes || undefined,
    [`${prefix}_Score`]:           score > 0 ? score : undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: SubmissionPayload = await req.json();
    const { guestCount, venues, scores, winnerName, winnerScore } = body;

    // Only store if at least one venue has a name entered
    const hasData = venues.some(v => v.name?.trim());
    if (!hasData) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const fields: Record<string, string | number | undefined> = {
      SubmittedAt: new Date().toISOString(),
      GuestCount:  num(guestCount),
      WinnerName:  winnerName || undefined,
      WinnerScore: winnerScore > 0 ? winnerScore : undefined,
      ...venueFields(venues[0] ?? {} as VenueData, scores[0] ?? 0, 'V1'),
      ...venueFields(venues[1] ?? {} as VenueData, scores[1] ?? 0, 'V2'),
      ...venueFields(venues[2] ?? {} as VenueData, scores[2] ?? 0, 'V3'),
    };

    // Strip undefined values — Airtable rejects them
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined && v !== '')
    );

    const resp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: cleanFields }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      console.error('Airtable error:', err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('venue-comparison route error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
