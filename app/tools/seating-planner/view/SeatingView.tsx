'use client';

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Export helpers ───────────────────────────────────────────────────────────

async function exportPNG(el: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
  const link = document.createElement('a');
  link.download = 'wedding-seating-plan.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function exportPDF(el: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
  const imgData = canvas.toDataURL('image/png');
  const pageW = 210; // A4 width mm
  const imgH = (canvas.height / canvas.width) * pageW;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pageW, imgH + 10] });
  pdf.addImage(imgData, 'PNG', 0, 5, pageW, imgH);
  pdf.save('wedding-seating-plan.pdf');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function guestsAtTable(guests: Guest[], tableId: string) {
  return guests.filter((g) => g.tableId === tableId && g.rsvp !== 'declined');
}

function decodeData(raw: string): SeatingData | null {
  try {
    return JSON.parse(atob(raw)) as SeatingData;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SeatingView() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('d') ?? '';
  const data = useMemo(() => decodeData(raw), [raw]);
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);

  const handleExportPNG = async () => {
    if (!exportRef.current) return;
    setExporting('png');
    try { await exportPNG(exportRef.current); } finally { setExporting(null); }
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    setExporting('pdf');
    try { await exportPDF(exportRef.current); } finally { setExporting(null); }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-lg font-semibold text-[#6B3E2E]">No seating data found.</p>
        <p className="text-sm text-gray-500">Go back to the planner to generate a new export.</p>
        <Link href="/tools/seating-planner" className="mt-2 text-sm text-[#6B3E2E] underline">← Back to Seating Planner</Link>
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
    <div className="min-h-screen bg-gray-100">

      {/* Action bar — not included in export */}
      <div className="bg-[#6B3E2E] text-white px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/tools/seating-planner" className="text-sm opacity-80 hover:opacity-100">
          ← Back to Planner
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleExportPNG}
            disabled={!!exporting}
            className="bg-white text-[#6B3E2E] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            {exporting === 'png' ? <span className="animate-pulse">Saving…</span> : '🖼️ Save as PNG'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={!!exporting}
            className="bg-white text-[#6B3E2E] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            {exporting === 'pdf' ? <span className="animate-pulse">Saving…</span> : '📄 Save as PDF'}
          </button>
        </div>
      </div>

      {/* Export target — this div is what gets captured */}
      <div ref={exportRef} className="max-w-2xl mx-auto px-6 py-8 bg-white">

        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-5 mb-5">
          <div className="text-3xl mb-1">🪑</div>
          <h1 className="font-serif text-2xl font-bold text-[#6B3E2E]">Wedding Seating Plan</h1>
          <p className="text-xs text-gray-400 mt-1">californiawineryweddings.com</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
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
          <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-5 text-sm text-amber-800">
            ⚠ <strong>{unseated.length} confirmed guest{unseated.length !== 1 ? 's' : ''} not yet assigned:</strong>{' '}
            {unseated.map((g) => g.name).join(', ')}
          </div>
        )}

        {/* Table Assignments */}
        <h2 className="font-serif text-base font-bold text-[#6B3E2E] mb-3 uppercase tracking-wide">Table Assignments</h2>
        <div className="space-y-3 mb-6">
          {tables.map((t) => {
            const seated = guestsAtTable(guests, t.id);
            const wine = WINE_STYLES[t.wineStyle] ?? WINE_STYLES.mixed;
            return (
              <div key={t.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-[#FAF8F3] px-4 py-2 flex items-center justify-between border-b border-gray-100">
                  <span className="font-serif font-bold text-[#6B3E2E] text-sm">
                    {t.shape === 'round' ? '⭕' : '▬'} {t.name}
                    <span className="ml-2 text-xs font-normal text-gray-500">{t.shape} · {t.capacity} seats</span>
                  </span>
                  <span className={`text-xs font-semibold ${seated.length === 0 ? 'text-gray-400' : seated.length >= t.capacity ? 'text-red-500' : 'text-green-600'}`}>
                    {seated.length}/{t.capacity}
                  </span>
                </div>
                <div className="px-4 py-1.5 bg-white border-b border-gray-50 text-xs text-[#8B5A3C]">
                  {wine.emoji} {wine.suggestion}
                </div>
                {seated.length === 0 ? (
                  <div className="px-4 py-2.5 text-xs text-gray-400 italic">No guests assigned</div>
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

        {/* Dietary Restrictions */}
        <h2 className="font-serif text-base font-bold text-[#6B3E2E] mb-3 uppercase tracking-wide">Dietary Restrictions for Caterer</h2>
        {restricted.length === 0 ? (
          <p className="text-sm text-gray-500 mb-6">No dietary restrictions among confirmed guests.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {(Object.entries(byDiet) as [Diet, Guest[]][])
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([diet, guestsWithDiet]) => (
                <div key={diet} className="border border-orange-100 rounded-xl overflow-hidden">
                  <div className="bg-orange-50 px-4 py-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-900">{DIET_LABELS[diet]}</span>
                    <span className="text-xs text-orange-600 font-medium">{guestsWithDiet.length} guest{guestsWithDiet.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {guestsWithDiet.map((g) => {
                      const assignedTable = tables.find((t) => t.id === g.tableId);
                      return (
                        <div key={g.id} className="px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{g.name}</span>
                          {assignedTable
                            ? <span className="text-xs text-[#6B3E2E] font-semibold">📍 {assignedTable.name}</span>
                            : <span className="text-xs text-amber-600">⚠ Not seated</span>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Guest Breakdown */}
        <h2 className="font-serif text-base font-bold text-[#6B3E2E] mb-3 uppercase tracking-wide">Guest Breakdown</h2>
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
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

        {/* Branding footer */}
        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-300">californiawineryweddings.com · Free Wedding Planning Tools</p>
        </div>

      </div>
    </div>
  );
}
