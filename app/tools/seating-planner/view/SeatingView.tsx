'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── Types (duplicated here to keep view self-contained) ─────────────────────

type Diet = 'none' | 'vegetarian' | 'vegan' | 'gluten-free' | 'kosher' | 'halal' | 'nut-allergy' | 'dairy-free';
type Side = 'bride' | 'groom' | 'both';
type RsvpStatus = 'confirmed' | 'pending' | 'declined';

interface Guest {
  id: string;
  name: string;
  side: Side;
  diet: Diet;
  rsvp: RsvpStatus;
  notes: string;
  tableId: string | null;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangular';
  wineStyle: string;
}

interface SeatingData {
  guests: Guest[];
  tables: Table[];
}

const DIET_LABELS: Record<Diet, string> = {
  none: 'No restriction',
  vegetarian: '🥦 Vegetarian',
  vegan: '🌱 Vegan',
  'gluten-free': '🌾 Gluten-Free',
  kosher: '✡️ Kosher',
  halal: '☪️ Halal',
  'nut-allergy': '🥜 Nut Allergy',
  'dairy-free': '🥛 Dairy-Free',
};

const WINE_STYLES: Record<string, { label: string; emoji: string; suggestion: string }> = {
  red: { label: 'Red Wine Lovers', emoji: '🍷', suggestion: 'Napa Cabernet Sauvignon or Paso Robles Zinfandel' },
  white: { label: 'White Wine Lovers', emoji: '🥂', suggestion: 'Sonoma Chardonnay or Santa Barbara Sauvignon Blanc' },
  sparkling: { label: 'Sparkling / Champagne', emoji: '✨', suggestion: 'Anderson Valley Brut or Carneros Blanc de Blancs' },
  mixed: { label: 'Mixed Preferences', emoji: '🍾', suggestion: 'Red + white blend — Sonoma Pinot + Sonoma Chardonnay' },
  rosé: { label: 'Rosé All Day', emoji: '🌸', suggestion: 'Dry Creek Valley Rosé of Syrah or Temecula Grenache Rosé' },
};

function guestsAtTable(guests: Guest[], tableId: string) {
  return guests.filter((g) => g.tableId === tableId && g.rsvp !== 'declined');
}

function decodeData(raw: string): SeatingData | null {
  try {
    const json = atob(raw);
    return JSON.parse(json) as SeatingData;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SeatingView() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('d') ?? '';
  const data = useMemo(() => decodeData(raw), [raw]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-lg font-semibold text-[#6B3E2E]">No seating data found.</p>
        <p className="text-sm text-gray-500">This link may be invalid or expired. Go back to the planner to generate a new print view.</p>
        <Link href="/tools/seating-planner" className="mt-2 text-sm text-[#6B3E2E] underline">
          ← Back to Seating Planner
        </Link>
      </div>
    );
  }

  const { guests, tables } = data;
  const confirmedGuests = guests.filter((g) => g.rsvp === 'confirmed');
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const unseated = confirmedGuests.filter((g) => g.tableId === null);
  const restricted = confirmedGuests.filter((g) => g.diet !== 'none');

  const byDiet: Partial<Record<Diet, Guest[]>> = {};
  restricted.forEach((g) => {
    if (!byDiet[g.diet]) byDiet[g.diet] = [];
    byDiet[g.diet]!.push(g);
  });

  const sideBreakdown = {
    bride: confirmedGuests.filter((g) => g.side === 'bride').length,
    groom: confirmedGuests.filter((g) => g.side === 'groom').length,
    both: confirmedGuests.filter((g) => g.side === 'both').length,
  };

  return (
    <>
      {/* Print styles — hides the action bar when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1cm; }
        }
      `}</style>

      {/* Action bar — hidden on print */}
      <div className="no-print bg-[#6B3E2E] text-white px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/tools/seating-planner" className="text-sm opacity-80 hover:opacity-100">
          ← Back to Planner
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white text-[#6B3E2E] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {/* Print content */}
      <div className="max-w-2xl mx-auto px-6 py-8 bg-white min-h-screen">

        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <div className="text-3xl mb-1">🪑</div>
          <h1 className="font-serif text-2xl font-bold text-[#6B3E2E]">Wedding Seating Plan</h1>
          <p className="text-xs text-gray-400 mt-1">californiawineryweddings.com</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Guests', value: guests.length },
            { label: 'Confirmed', value: confirmedGuests.length },
            { label: 'Tables', value: tables.length },
            { label: 'Total Seats', value: totalSeats },
          ].map((s) => (
            <div key={s.label} className="border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[#6B3E2E]">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Unseated warning */}
        {unseated.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
            ⚠ <strong>{unseated.length} confirmed guest{unseated.length !== 1 ? 's' : ''} not yet assigned to a table:</strong>{' '}
            {unseated.map((g) => g.name).join(', ')}
          </div>
        )}

        {/* ── Table Assignments ── */}
        <h2 className="font-serif text-lg font-bold text-[#6B3E2E] mb-3">Table Assignments</h2>
        <div className="space-y-4 mb-8">
          {tables.map((t) => {
            const seated = guestsAtTable(guests, t.id);
            const wine = WINE_STYLES[t.wineStyle] ?? WINE_STYLES.mixed;
            return (
              <div key={t.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="bg-[#FAF8F3] px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#6B3E2E] text-sm">
                      {t.shape === 'round' ? '⭕' : '▬'} {t.name}
                    </span>
                    <span className="text-xs text-gray-500">{t.shape} · {t.capacity} seats</span>
                  </div>
                  <span className={`text-xs font-semibold ${seated.length === 0 ? 'text-gray-400' : seated.length >= t.capacity ? 'text-red-500' : 'text-green-600'}`}>
                    {seated.length}/{t.capacity}
                  </span>
                </div>
                {/* Wine line */}
                <div className="px-4 py-1.5 bg-white border-b border-gray-100 text-xs text-[#8B5A3C]">
                  {wine.emoji} {wine.suggestion}
                </div>
                {/* Guest rows */}
                {seated.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-400 italic">No guests assigned</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {seated.map((g) => (
                      <div key={g.id} className="px-4 py-2 flex items-center justify-between">
                        <span className="text-sm text-gray-800 font-medium">{g.name}</span>
                        <div className="flex items-center gap-2">
                          {g.diet !== 'none' && (
                            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                              {DIET_LABELS[g.diet]}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {g.side === 'bride' ? '💍' : g.side === 'groom' ? '🤵' : '👥'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Dietary Restrictions ── */}
        <h2 className="font-serif text-lg font-bold text-[#6B3E2E] mb-3">Dietary Restrictions for Caterer</h2>
        {restricted.length === 0 ? (
          <p className="text-sm text-gray-500 mb-8">No dietary restrictions among confirmed guests.</p>
        ) : (
          <div className="space-y-3 mb-8">
            {(Object.entries(byDiet) as [Diet, Guest[]][])
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([diet, guestsWithDiet]) => (
                <div key={diet} className="border border-orange-100 rounded-xl overflow-hidden">
                  <div className="bg-orange-50 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-900">{DIET_LABELS[diet]}</span>
                    <span className="text-xs text-orange-600 font-medium">{guestsWithDiet.length} guest{guestsWithDiet.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {guestsWithDiet.map((g) => {
                      const assignedTable = tables.find((t) => t.id === g.tableId);
                      return (
                        <div key={g.id} className="px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{g.name}</span>
                          {assignedTable ? (
                            <span className="text-xs text-[#6B3E2E] font-semibold">📍 {assignedTable.name}</span>
                          ) : (
                            <span className="text-xs text-amber-600">⚠ Not seated</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ── Guest Breakdown ── */}
        <h2 className="font-serif text-lg font-bold text-[#6B3E2E] mb-3">Guest Breakdown</h2>
        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xl font-bold text-pink-600">{sideBreakdown.bride}</div>
            <div className="text-xs text-gray-500">💍 Bride&apos;s Side</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">{sideBreakdown.groom}</div>
            <div className="text-xs text-gray-500">🤵 Groom&apos;s Side</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">{sideBreakdown.both}</div>
            <div className="text-xs text-gray-500">👥 Mutual</div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="border-t border-gray-100 pt-4 text-center no-print">
          <p className="text-xs text-gray-400">
            Generated with{' '}
            <Link href="/tools/seating-planner" className="text-[#8B5A3C] underline">
              CaliforniaWineryWeddings.com Seating Planner
            </Link>
          </p>
        </div>
        <div className="border-t border-gray-100 pt-4 text-center" style={{ display: 'none' }}>
          {/* Print-only footer */}
        </div>
        <p className="text-xs text-gray-300 text-center mt-1 no-print">Free tool — no signup required</p>
      </div>
    </>
  );
}
