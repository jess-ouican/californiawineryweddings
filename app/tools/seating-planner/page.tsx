'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function guestsAtTable(guests: Guest[], tableId: string) {
  return guests.filter((g) => g.tableId === tableId && g.rsvp !== 'declined');
}

function dietSummary(gs: Guest[]): string {
  const counts: Partial<Record<Diet, number>> = {};
  gs.forEach((g) => { if (g.diet !== 'none') counts[g.diet] = (counts[g.diet] ?? 0) + 1; });
  const parts = Object.entries(counts).map(([d, c]) => `${c}× ${DIET_LABELS[d as Diet]}`);
  return parts.length ? parts.join(', ') : 'No dietary restrictions';
}

const RSVP_BADGE: Record<RsvpStatus, string> = {
  confirmed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-800',
};
const RSVP_LABEL: Record<RsvpStatus, string> = {
  confirmed: '✓ Confirmed',
  declined: '✕ Declined',
  pending: '? Pending',
};
const SIDE_BADGE: Record<Side, string> = {
  bride: 'bg-pink-100 text-pink-800',
  groom: 'bg-blue-100 text-blue-800',
  both: 'bg-purple-100 text-purple-800',
};
const SIDE_LABEL: Record<Side, string> = {
  bride: '💍 Bride',
  groom: '🤵 Groom',
  both: '👥 Both',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SeatingPlannerPage() {

  // ── Core data ──
  const [guests, setGuests] = useState<Guest[]>([
    { id: newId(), name: 'Emma Johnson', side: 'bride', diet: 'none', rsvp: 'confirmed', notes: '', tableId: null },
    { id: newId(), name: 'Michael Chen', side: 'groom', diet: 'vegetarian', rsvp: 'confirmed', notes: 'College friend', tableId: null },
    { id: newId(), name: 'Sarah Williams', side: 'bride', diet: 'gluten-free', rsvp: 'pending', notes: '', tableId: null },
  ]);
  const [tables, setTables] = useState<Table[]>([
    { id: newId(), name: 'Head Table', capacity: 8, shape: 'rectangular', wineStyle: 'mixed' },
    { id: newId(), name: 'Table 1', capacity: 10, shape: 'round', wineStyle: 'red' },
    { id: newId(), name: 'Table 2', capacity: 10, shape: 'round', wineStyle: 'white' },
  ]);

  // ── Guest form ──
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSide, setNewGuestSide] = useState<Side>('both');
  const [newGuestDiet, setNewGuestDiet] = useState<Diet>('none');
  const [newGuestRsvp, setNewGuestRsvp] = useState<RsvpStatus>('pending');
  const [newGuestNotes, setNewGuestNotes] = useState('');

  // ── Table form ──
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(10);
  const [newTableShape, setNewTableShape] = useState<'round' | 'rectangular'>('round');
  const [newTableWineStyle, setNewTableWineStyle] = useState('mixed');

  // ── UI state ──
  const [activeTab, setActiveTab] = useState<'guests' | 'tables' | 'seating' | 'summary'>('guests');
  const [filterRsvp, setFilterRsvp] = useState<RsvpStatus | 'all'>('all');
  const [filterSide, setFilterSide] = useState<Side | 'all'>('all');
  // Seating tab tap-to-select state — lives here so it survives tab renders
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  // Drag state
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);

  // ── Actions ──
  const addGuest = useCallback(() => {
    if (!newGuestName.trim()) return;
    setGuests((prev) => [...prev, {
      id: newId(), name: newGuestName.trim(), side: newGuestSide,
      diet: newGuestDiet, rsvp: newGuestRsvp, notes: newGuestNotes.trim(), tableId: null,
    }]);
    setNewGuestName('');
    setNewGuestNotes('');
    setNewGuestDiet('none');
    setNewGuestRsvp('pending');
  }, [newGuestName, newGuestSide, newGuestDiet, newGuestRsvp, newGuestNotes]);

  const removeGuest = useCallback((id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateGuestRsvp = useCallback((id: string, rsvp: RsvpStatus) => {
    setGuests((prev) => prev.map((g) => g.id === id ? { ...g, rsvp } : g));
  }, []);

  const assignGuestToTable = useCallback((guestId: string, tableId: string | null) => {
    setGuests((prev) => prev.map((g) => g.id === guestId ? { ...g, tableId } : g));
  }, []);

  const addTable = useCallback(() => {
    if (!newTableName.trim()) return;
    setTables((prev) => [...prev, {
      id: newId(), name: newTableName.trim(), capacity: newTableCapacity,
      shape: newTableShape, wineStyle: newTableWineStyle,
    }]);
    setNewTableName('');
    setNewTableCapacity(10);
  }, [newTableName, newTableCapacity, newTableShape, newTableWineStyle]);

  const removeTable = useCallback((id: string) => {
    setGuests((prev) => prev.map((g) => g.tableId === id ? { ...g, tableId: null } : g));
    setTables((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Seating map interactions ──
  const handleGuestTap = (guestId: string) => {
    setSelectedGuestId((prev) => prev === guestId ? null : guestId);
  };

  const handleTableTap = (tableId: string) => {
    if (!selectedGuestId) return;
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const alreadyHere = guests.find((g) => g.id === selectedGuestId)?.tableId === tableId;
    if (alreadyHere) {
      assignGuestToTable(selectedGuestId, null);
    } else if (guestsAtTable(guests, tableId).length < table.capacity) {
      assignGuestToTable(selectedGuestId, tableId);
    }
    setSelectedGuestId(null);
  };

  const handleUnseatedAreaTap = () => {
    if (selectedGuestId) {
      assignGuestToTable(selectedGuestId, null);
      setSelectedGuestId(null);
    }
  };

  const handleDragStart = (guestId: string) => {
    setSelectedGuestId(null);
    setDraggedGuestId(guestId);
  };

  const handleDragEnd = () => setDraggedGuestId(null);

  const handleDropOnTable = (tableId: string) => {
    if (!draggedGuestId) return;
    const table = tables.find((t) => t.id === tableId);
    if (!table || guestsAtTable(guests, tableId).length >= table.capacity) return;
    assignGuestToTable(draggedGuestId, tableId);
    setDraggedGuestId(null);
  };

  const handleDropOnUnseated = () => {
    if (draggedGuestId) { assignGuestToTable(draggedGuestId, null); setDraggedGuestId(null); }
  };

  // ── Computed ──
  const confirmedGuests = guests.filter((g) => g.rsvp === 'confirmed');
  const pendingGuests = guests.filter((g) => g.rsvp === 'pending');
  const declinedGuests = guests.filter((g) => g.rsvp === 'declined');
  const unseatedConfirmed = confirmedGuests.filter((g) => g.tableId === null);
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const filteredGuests = guests.filter((g) => {
    if (filterRsvp !== 'all' && g.rsvp !== filterRsvp) return false;
    if (filterSide !== 'all' && g.side !== filterSide) return false;
    return true;
  });

  const selectedGuest = selectedGuestId ? guests.find((g) => g.id === selectedGuestId) ?? null : null;
  const unseatedForSeating = guests.filter((g) => g.tableId === null && g.rsvp !== 'declined');

  const sideBreakdown = {
    bride: confirmedGuests.filter((g) => g.side === 'bride').length,
    groom: confirmedGuests.filter((g) => g.side === 'groom').length,
    both: confirmedGuests.filter((g) => g.side === 'both').length,
  };
  const seatingComplete = unseatedConfirmed.length === 0 && confirmedGuests.length > 0;

  const restrictedGuests = confirmedGuests.filter((g) => g.diet !== 'none');
  const byDiet: Partial<Record<Diet, Guest[]>> = {};
  restrictedGuests.forEach((g) => {
    if (!byDiet[g.diet]) byDiet[g.diet] = [];
    byDiet[g.diet]!.push(g);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="text-sm text-[#8B5A3C] hover:underline mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4 leading-tight">
            🪑 Wedding Seating Chart Planner
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl leading-relaxed">
            Manage your guest list, assign tables, track dietary restrictions, and get California wine pairing suggestions for each table — all in one free tool. No signup required.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {['✓ Tap-to-assign seating', '✓ RSVP tracking', '✓ Dietary restriction summary', '✓ Wine pairings per table', '✓ 100% free, no signup'].map((f) => (
              <span key={f} className="bg-white/70 px-3 py-1.5 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {([
              { key: 'guests', label: `👤 Guests (${guests.length})` },
              { key: 'tables', label: `🪑 Tables (${tables.length})` },
              { key: 'seating', label: '🗺 Seating Map' },
              { key: 'summary', label: '📋 Summary' },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap px-4 py-3.5 text-sm font-semibold border-b-2 transition ${
                  activeTab === t.key ? 'border-[#6B3E2E] text-[#6B3E2E]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ══════════ GUESTS TAB ══════════ */}
        {activeTab === 'guests' && (
          <div className="space-y-8">
            {/* Add Guest Form */}
            <div className="bg-[#FAF8F3] border border-[#D4A574] rounded-xl p-6">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">Add a Guest</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                    placeholder="e.g. Jane Smith"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Side</label>
                  <select
                    value={newGuestSide}
                    onChange={(e) => setNewGuestSide(e.target.value as Side)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                  >
                    <option value="bride">💍 Bride&apos;s Side</option>
                    <option value="groom">🤵 Groom&apos;s Side</option>
                    <option value="both">👥 Both / Mutual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">RSVP Status</label>
                  <select
                    value={newGuestRsvp}
                    onChange={(e) => setNewGuestRsvp(e.target.value as RsvpStatus)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                  >
                    <option value="pending">? Pending</option>
                    <option value="confirmed">✓ Confirmed</option>
                    <option value="declined">✕ Declined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dietary Needs</label>
                  <select
                    value={newGuestDiet}
                    onChange={(e) => setNewGuestDiet(e.target.value as Diet)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                  >
                    {(Object.keys(DIET_LABELS) as Diet[]).map((d) => (
                      <option key={d} value={d}>{DIET_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={newGuestNotes}
                  onChange={(e) => setNewGuestNotes(e.target.value)}
                  placeholder="e.g. College friend, needs wheelchair access"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                />
              </div>
              <button
                onClick={addGuest}
                disabled={!newGuestName.trim()}
                className="bg-[#6B3E2E] hover:bg-[#5a3422] disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm"
              >
                + Add Guest
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold text-gray-600">Filter:</span>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'confirmed', 'pending', 'declined'] as const).map((s) => (
                  <button key={s} onClick={() => setFilterRsvp(s)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${filterRsvp === s ? 'bg-[#6B3E2E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'bride', 'groom', 'both'] as const).map((s) => (
                  <button key={s} onClick={() => setFilterSide(s)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${filterSide === s ? 'bg-[#6B3E2E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {s === 'all' ? 'All Sides' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest List */}
            <div className="space-y-2">
              {filteredGuests.length === 0 && (
                <p className="text-gray-500 text-sm py-4 text-center">No guests match your filters.</p>
              )}
              {filteredGuests.map((g) => {
                const assignedTable = tables.find((t) => t.id === g.tableId);
                return (
                  <div key={g.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D4A574] transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{g.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RSVP_BADGE[g.rsvp]}`}>{RSVP_LABEL[g.rsvp]}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SIDE_BADGE[g.side]}`}>{SIDE_LABEL[g.side]}</span>
                        {g.diet !== 'none' && (
                          <span className="text-xs bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full font-medium">{DIET_LABELS[g.diet]}</span>
                        )}
                      </div>
                      {g.notes && <p className="text-xs text-gray-500">{g.notes}</p>}
                      {assignedTable
                        ? <p className="text-xs text-[#6B3E2E] font-medium mt-1">📍 {assignedTable.name}</p>
                        : g.rsvp !== 'declined' && <p className="text-xs text-amber-600 font-medium mt-1">⚠ Not yet seated</p>
                      }
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select value={g.rsvp} onChange={(e) => updateGuestRsvp(g.id, e.target.value as RsvpStatus)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8B5A3C]">
                        <option value="pending">? Pending</option>
                        <option value="confirmed">✓ Confirmed</option>
                        <option value="declined">✕ Declined</option>
                      </select>
                      <select value={g.tableId ?? ''} onChange={(e) => assignGuestToTable(g.id, e.target.value || null)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8B5A3C]">
                        <option value="">— No table —</option>
                        {tables.map((t) => {
                          const seated = guestsAtTable(guests, t.id).length;
                          const full = seated >= t.capacity && g.tableId !== t.id;
                          return (
                            <option key={t.id} value={t.id} disabled={full}>
                              {t.name} ({seated}/{t.capacity}){full ? ' FULL' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <button onClick={() => removeGuest(g.id)} className="text-red-400 hover:text-red-600 text-sm font-bold px-1" title="Remove">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 bg-[#FAF8F3] rounded-xl p-4 border border-[#D4A574]">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{confirmedGuests.length}</div>
                <div className="text-xs text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingGuests.length}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{declinedGuests.length}</div>
                <div className="text-xs text-gray-600">Declined</div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TABLES TAB ══════════ */}
        {activeTab === 'tables' && (
          <div className="space-y-8">
            {/* Add Table Form */}
            <div className="bg-[#FAF8F3] border border-[#D4A574] rounded-xl p-6">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">Add a Table</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Table Name *</label>
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTable()}
                    placeholder="e.g. Table 4 or Family Table"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                  <input type="number" min={1} max={30} value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shape</label>
                  <select value={newTableShape} onChange={(e) => setNewTableShape(e.target.value as 'round' | 'rectangular')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]">
                    <option value="round">⭕ Round</option>
                    <option value="rectangular">▬ Rectangular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Wine Preference</label>
                  <select value={newTableWineStyle} onChange={(e) => setNewTableWineStyle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]">
                    {Object.entries(WINE_STYLES).map(([k, v]) => (
                      <option key={k} value={k}>{v.emoji} {v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={addTable} disabled={!newTableName.trim()}
                className="bg-[#6B3E2E] hover:bg-[#5a3422] disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm">
                + Add Table
              </button>
            </div>

            {/* Table Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map((t) => {
                const seated = guestsAtTable(guests, t.id);
                const pct = Math.round((seated.length / t.capacity) * 100);
                const wine = WINE_STYLES[t.wineStyle];
                const isOver = seated.length > t.capacity;
                return (
                  <div key={t.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-[#D4A574] transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#6B3E2E]">
                          {t.shape === 'round' ? '⭕' : '▬'} {t.name}
                        </h4>
                        <p className="text-xs text-gray-500">{t.capacity}-seat {t.shape} table</p>
                      </div>
                      <button onClick={() => removeTable(t.id)} className="text-red-400 hover:text-red-600 text-sm font-bold" title="Remove">✕</button>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{seated.length} seated</span>
                        <span className={isOver ? 'text-red-600 font-semibold' : ''}>{t.capacity} capacity{isOver ? ' ⚠ OVER' : ''}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-500' : pct >= 90 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                    <div className="bg-[#FAF8F3] rounded-lg px-3 py-2 mb-3">
                      <p className="text-xs font-semibold text-[#6B3E2E] mb-0.5">{wine.emoji} Wine Suggestion</p>
                      <p className="text-xs text-gray-600">{wine.suggestion}</p>
                    </div>
                    {seated.length > 0 ? (
                      <div className="space-y-1">
                        {seated.map((g) => (
                          <div key={g.id} className="flex items-center justify-between text-xs text-gray-700">
                            <span>
                              {g.name}
                              {g.diet !== 'none' && <span className="ml-1 text-orange-600">({DIET_LABELS[g.diet].split(' ')[0]})</span>}
                            </span>
                            <button onClick={() => assignGuestToTable(g.id, null)} className="text-gray-400 hover:text-red-500 ml-2" title="Unseat">↩</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No guests seated yet</p>
                    )}
                    {seated.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2 border-t pt-2">🍽 {dietSummary(seated)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ SEATING MAP TAB ══════════ */}
        {activeTab === 'seating' && (
          <div className="space-y-5">
            {/* Instruction banner */}
            <div className="bg-[#FAF8F3] border border-[#D4A574] rounded-xl px-4 py-3 text-sm text-[#6B3E2E]">
              {selectedGuest ? (
                <span className="font-semibold">
                  ✋ <span className="underline">{selectedGuest.name}</span> selected — tap a table to assign them, or tap the unassigned pool to unseat.
                </span>
              ) : (
                <span>
                  <span className="font-semibold">Tap a guest</span> to select them, then <span className="font-semibold">tap a table</span> to assign.
                  <span className="hidden sm:inline text-gray-500"> On desktop you can also drag and drop.</span>
                </span>
              )}
            </div>

            {/* Unassigned Pool */}
            <div
              className={`border-2 border-dashed rounded-xl p-4 min-h-[72px] transition ${
                selectedGuest && selectedGuest.tableId !== null
                  ? 'border-[#6B3E2E] bg-[#FFF8F0] cursor-pointer ring-2 ring-[#6B3E2E]/20'
                  : 'border-[#D4A574] bg-[#FAF8F3]'
              }`}
              onClick={handleUnseatedAreaTap}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnUnseated}
            >
              <h3 className="font-semibold text-sm text-[#6B3E2E] mb-2">
                👤 Unassigned ({unseatedForSeating.length})
                {selectedGuest && selectedGuest.tableId !== null && (
                  <span className="ml-2 text-xs font-normal text-[#8B5A3C]">← tap to move here</span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {unseatedForSeating.length === 0 && !selectedGuest && (
                  <p className="text-xs text-gray-400 italic">All confirmed guests are seated 🎉</p>
                )}
                {unseatedForSeating.map((g) => (
                  <button
                    key={g.id}
                    draggable
                    onDragStart={(e) => { e.stopPropagation(); handleDragStart(g.id); }}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => { e.stopPropagation(); handleGuestTap(g.id); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition select-none border ${
                      selectedGuestId === g.id
                        ? 'bg-[#6B3E2E] text-white border-[#6B3E2E] ring-2 ring-offset-1 ring-[#6B3E2E] scale-105'
                        : 'bg-white border-[#D4A574] text-[#6B3E2E] hover:bg-[#6B3E2E] hover:text-white active:scale-95'
                    }`}
                  >
                    {g.name}{g.diet !== 'none' && ' *'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {tables.map((t) => {
                const seated = guestsAtTable(guests, t.id);
                const isFull = seated.length >= t.capacity && !(selectedGuest?.tableId === t.id);
                const isTarget = !!selectedGuest && !isFull;
                const wine = WINE_STYLES[t.wineStyle];
                return (
                  <div
                    key={t.id}
                    onClick={() => handleTableTap(t.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnTable(t.id)}
                    className={`border-2 rounded-xl p-4 transition min-h-[120px] ${
                      isFull && !isTarget
                        ? 'border-red-200 bg-red-50 cursor-default'
                        : isTarget
                        ? 'border-[#6B3E2E] bg-[#FFF8F0] cursor-pointer ring-2 ring-[#6B3E2E]/20 hover:bg-[#FAF0E8]'
                        : draggedGuestId
                        ? 'border-[#6B3E2E] bg-[#FAF8F3] cursor-pointer ring-2 ring-[#6B3E2E]/20'
                        : 'border-gray-200 bg-white cursor-default'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-serif font-bold text-[#6B3E2E] text-sm">
                        {t.shape === 'round' ? '⭕' : '▬'} {t.name}
                      </h4>
                      <span className={`text-xs font-semibold ${seated.length >= t.capacity ? 'text-red-500' : 'text-gray-400'}`}>
                        {seated.length}/{t.capacity}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B5A3C] mb-2">{wine.emoji} {wine.label}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full transition-all ${seated.length >= t.capacity ? 'bg-red-400' : seated.length / t.capacity > 0.8 ? 'bg-amber-400' : 'bg-green-400'}`}
                        style={{ width: `${Math.min((seated.length / t.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {seated.map((g) => (
                        <button
                          key={g.id}
                          draggable
                          onDragStart={(e) => { e.stopPropagation(); handleDragStart(g.id); }}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => { e.stopPropagation(); handleGuestTap(g.id); }}
                          className={`px-2 py-1 text-xs rounded-full transition select-none border ${
                            selectedGuestId === g.id
                              ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-offset-1 ring-amber-400 scale-105'
                              : 'bg-[#6B3E2E] text-white border-[#6B3E2E] hover:bg-[#8B5A3C] active:scale-95'
                          }`}
                        >
                          {g.name.split(' ')[0]}{g.diet !== 'none' && ' *'}
                        </button>
                      ))}
                      {isTarget && (
                        <span className="px-2 py-1 border border-dashed border-[#6B3E2E] text-[#6B3E2E] text-xs rounded-full animate-pulse">
                          + seat here
                        </span>
                      )}
                      {!isTarget && seated.length === 0 && (
                        <span className="text-xs text-gray-300 italic">empty</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-400">* = dietary restriction &nbsp;·&nbsp; Tap a seated guest to move them</p>
          </div>
        )}

        {/* ══════════ SUMMARY TAB ══════════ */}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            {/* Status banner */}
            <div className={`rounded-xl p-5 border-2 text-center ${seatingComplete ? 'bg-green-50 border-green-400' : confirmedGuests.length === 0 ? 'bg-gray-50 border-gray-300' : 'bg-amber-50 border-amber-400'}`}>
              {seatingComplete ? (
                <>
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-bold text-green-800 text-lg">All guests are seated!</p>
                  <p className="text-sm text-green-700">{confirmedGuests.length} confirmed guests across {tables.length} tables.</p>
                </>
              ) : unseatedConfirmed.length > 0 ? (
                <>
                  <div className="text-3xl mb-2">⚠️</div>
                  <p className="font-bold text-amber-800 text-lg">
                    {unseatedConfirmed.length} confirmed guest{unseatedConfirmed.length !== 1 ? 's' : ''} still need a seat
                  </p>
                  <p className="text-sm text-amber-700">
                    {tables.reduce((s, t) => s + Math.max(0, t.capacity - guestsAtTable(guests, t.id).length), 0)} open seats available.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">📋</div>
                  <p className="font-bold text-gray-700 text-lg">No confirmed guests yet</p>
                  <p className="text-sm text-gray-600">Update RSVP statuses in the Guests tab.</p>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Invited', value: guests.length, color: 'text-[#6B3E2E]' },
                { label: 'Confirmed', value: confirmedGuests.length, color: 'text-green-700' },
                { label: 'Tables', value: tables.length, color: 'text-[#6B3E2E]' },
                { label: 'Total Seats', value: totalSeats, color: 'text-[#6B3E2E]' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Side breakdown */}
            <div className="bg-[#FAF8F3] border border-[#D4A574] rounded-xl p-5">
              <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-4">Guest Breakdown by Side</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="text-2xl font-bold text-pink-600">{sideBreakdown.bride}</div><div className="text-xs text-gray-600">💍 Bride&apos;s Side</div></div>
                <div><div className="text-2xl font-bold text-blue-600">{sideBreakdown.groom}</div><div className="text-xs text-gray-600">🤵 Groom&apos;s Side</div></div>
                <div><div className="text-2xl font-bold text-purple-600">{sideBreakdown.both}</div><div className="text-xs text-gray-600">👥 Mutual</div></div>
              </div>
            </div>

            {/* Dietary — per guest + table */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-1">Dietary Restrictions</h3>
              <p className="text-xs text-gray-500 mb-4">Share this with your caterer — includes each guest&apos;s name and table.</p>
              {restrictedGuests.length === 0 ? (
                <p className="text-sm text-gray-500">No dietary restrictions among confirmed guests.</p>
              ) : (
                <div className="space-y-4">
                  {(Object.entries(byDiet) as [Diet, Guest[]][])
                    .sort(([, a], [, b]) => b.length - a.length)
                    .map(([diet, guestsWithDiet]) => (
                      <div key={diet} className="border border-orange-100 rounded-xl overflow-hidden">
                        <div className="bg-orange-50 px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-orange-900">{DIET_LABELS[diet]}</span>
                          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                            {guestsWithDiet.length} guest{guestsWithDiet.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {guestsWithDiet.map((g) => {
                            const assignedTable = tables.find((t) => t.id === g.tableId);
                            return (
                              <div key={g.id} className="px-4 py-2.5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">{g.name}</span>
                                {assignedTable ? (
                                  <span className="text-xs text-[#6B3E2E] font-semibold bg-[#FAF8F3] px-2 py-0.5 rounded-full">
                                    📍 {assignedTable.name}
                                  </span>
                                ) : (
                                  <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                                    ⚠ Not seated
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  <p className="text-xs text-gray-400 pt-1">
                    💡 Share this with your winery caterer 4–6 weeks before the wedding.
                  </p>
                </div>
              )}
            </div>

            {/* Per-table wine plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-4">Wine Service Plan by Table</h3>
              {tables.map((t) => {
                const seated = guestsAtTable(guests, t.id);
                const wine = WINE_STYLES[t.wineStyle];
                if (seated.length === 0) return null;
                return (
                  <div key={t.id} className="flex items-start gap-4 border-b last:border-b-0 py-3">
                    <div className="text-2xl">{wine.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[#6B3E2E]">{t.name}</div>
                      <div className="text-xs text-gray-600 mb-1">{wine.suggestion}</div>
                      <div className="text-xs text-gray-500">{seated.length} guests · {seated.map((g) => g.name.split(' ')[0]).join(', ')}</div>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-gray-400 mt-3">
                💡 Many California wineries offer bottle pre-service by table — ask your coordinator about this option.
              </p>
            </div>

            {/* Print */}
            <div className="bg-[#6B3E2E] text-white rounded-xl p-5 text-center">
              <p className="font-semibold mb-1">📄 Ready to share?</p>
              <p className="text-sm opacity-90 mb-3">
                Use your browser&apos;s Print function (Ctrl+P / Cmd+P) to save or print this summary.
              </p>
              <button onClick={() => window.print()}
                className="bg-white text-[#6B3E2E] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-gray-100 transition">
                🖨 Print / Save as PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content + FAQ */}
      <section className="bg-[#FAF8F3] py-16 border-t border-[#E8D5C0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-10 text-center">Winery Wedding Seating Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { title: '🍷 Match Wine Style to Tables', body: 'California wineries often allow per-table wine pre-service. Place big red wine drinkers together so your server can pre-open Cabernets; put white wine lovers with Chardonnay and Sauvignon Blanc service. It feels personal and reduces service confusion.' },
              { title: '🌡️ Consider the Outdoor Layout', body: 'At vineyard receptions, tables near the dance floor get more foot traffic and noise. Put livelier groups there. Older guests or families with kids often prefer tables slightly further from the speakers — especially important at outdoor venues with noise ordinances.' },
              { title: '🍽️ Share Dietary Restrictions Early', body: 'Winery caterers need dietary restriction lists 4–6 weeks out, not the week of. Your seating plan dietary summary (see the Summary tab) is exactly what to email your venue coordinator.' },
              { title: '🌅 Golden Hour & Table Placement', body: 'Many California winery venues have stunning golden hour views to the west. If your venue has a signature view, consider placing the head table and VIP guests with the best sightlines — they\'ll thank you for it.' },
            ].map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#6B3E2E] mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-6 text-center">Seating Chart FAQ</h2>
          <div className="space-y-6">
            {[
              { q: 'When should I finalize my winery wedding seating chart?', a: 'Aim to finalize your seating chart 1–2 weeks before the wedding. You need final RSVP counts first — most venues give you a final headcount deadline of 2–3 weeks out. Build your draft seating chart as RSVPs come in, and do the final pass once the last stragglers respond.' },
              { q: 'How many guests fit per table at a winery wedding?', a: 'Standard round tables at California winery venues seat 8–10 guests comfortably. Rectangular farm tables (popular at wine country estates) typically seat 10–16. Head tables for the wedding party are usually rectangular and seat 6–12. Always confirm table sizes with your venue — some outdoor wineries use non-standard furniture.' },
              { q: 'Is it better to do assigned seating or open seating at a winery wedding?', a: 'For winery weddings above 75 guests, assigned seating is strongly recommended. Wine service, catering coordination, and dietary restrictions all become much easier to manage with assigned seats. For intimate vineyard weddings under 50 guests, open seating can work — but even then, reserved tables for the wedding party and elderly guests is wise.' },
              { q: 'How do I handle dietary restrictions at a winery wedding?', a: 'Track every dietary restriction when guests RSVP and group the data by table. Share this list with your caterer and venue coordinator 4–6 weeks before the wedding. Most California winery caterers will prepare separate plated meals for dietary guests — the kitchen needs advance notice to source ingredients and coordinate service.' },
              { q: 'Should I consider the bride\'s side vs groom\'s side when making a seating chart?', a: 'Yes — and mixing both sides intentionally can create a warmer reception. A useful strategy: keep immediate family on each side together, but mix extended family and friends across tables to encourage mingling. This is especially effective at winery weddings where the relaxed atmosphere naturally invites conversation.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-[#6B3E2E] mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center space-y-3">
            <p className="text-gray-700 font-medium">Ready for the next step?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tools/budget-estimator" className="text-sm text-[#6B3E2E] underline hover:text-[#8B5A3C]">💰 Estimate Your Budget</Link>
              <Link href="/tools/wine-calculator" className="text-sm text-[#6B3E2E] underline hover:text-[#8B5A3C]">🍇 Wine Calculator</Link>
              <Link href="/tools/vendor-tipping" className="text-sm text-[#6B3E2E] underline hover:text-[#8B5A3C]">💌 Vendor Tipping Calculator</Link>
              <Link href="/" className="text-sm text-[#6B3E2E] underline hover:text-[#8B5A3C]">🏛️ Browse 435+ Winery Venues</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
