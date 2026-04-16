'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  tipRange: [number, number]; // percentage range
  flatRange?: [number, number]; // optional flat dollar range
  tipBasis: 'percentage' | 'flat' | 'both';
  tipNote: string;
  wineryNote?: string; // winery-specific tip context
  included: boolean;
  contractAmount: number;
  customTip?: number;
  tipMode: 'percentage' | 'flat';
  selectedPct: number;
}

const DEFAULT_VENDORS: Omit<Vendor, 'customTip'>[] = [
  {
    id: 'venue-coordinator',
    name: 'Winery/Venue Coordinator',
    emoji: '🏛️',
    category: 'Venue',
    description: 'The on-site coordinator provided by the winery',
    tipRange: [0, 0],
    flatRange: [150, 500],
    tipBasis: 'flat',
    tipNote: 'Tips not expected but deeply appreciated. A gift or heartfelt card goes far.',
    wineryNote: 'At many wineries, the coordinator is salaried — tipping is a bonus, not a standard. $150–$300 is generous for a seamless day.',
    included: true,
    contractAmount: 0,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'caterer',
    name: 'Caterer / Catering Staff',
    emoji: '🍽️',
    category: 'Food & Beverage',
    description: 'Full-service catering team (if gratuity not included)',
    tipRange: [15, 20],
    flatRange: [200, 500],
    tipBasis: 'both',
    tipNote: 'Check your contract first — many caterers include 18–22% gratuity automatically.',
    wineryNote: 'Winery caterers often work long days in outdoor heat. If gratuity is already in the contract, consider a small cash bonus for the lead server.',
    included: true,
    contractAmount: 8000,
    tipMode: 'percentage',
    selectedPct: 18,
  },
  {
    id: 'bartenders',
    name: 'Bartenders',
    emoji: '🍷',
    category: 'Food & Beverage',
    description: 'Bar staff — wine service, cocktail hour, reception',
    tipRange: [0, 0],
    flatRange: [50, 150],
    tipBasis: 'flat',
    tipNote: 'Tip per bartender, not total bar spend. $50–$100 per bartender is standard.',
    wineryNote: 'At wineries, bartenders often double as wine educators. Guests who got a great experience will notice — generous tips are earned here.',
    included: true,
    contractAmount: 0,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'photographer',
    name: 'Photographer',
    emoji: '📸',
    category: 'Photography & Video',
    description: 'Lead wedding photographer',
    tipRange: [0, 0],
    flatRange: [100, 400],
    tipBasis: 'flat',
    tipNote: 'Tips are a lovely surprise but not expected. $100–$250 for exceptional work is ideal.',
    wineryNote: 'Vineyard and golden hour photography is physically demanding — navigating vines, long hours on feet. A generous tip shows appreciation.',
    included: true,
    contractAmount: 4000,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'videographer',
    name: 'Videographer',
    emoji: '🎬',
    category: 'Photography & Video',
    description: 'Wedding videography team',
    tipRange: [0, 0],
    flatRange: [75, 250],
    tipBasis: 'flat',
    tipNote: 'Same etiquette as photographer. $75–$200 is appreciated.',
    wineryNote: '',
    included: false,
    contractAmount: 2500,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'dj',
    name: 'DJ',
    emoji: '🎵',
    category: 'Entertainment',
    description: 'Wedding DJ / MC',
    tipRange: [0, 0],
    flatRange: [50, 200],
    tipBasis: 'flat',
    tipNote: 'Not expected, but $50–$150 for an exceptional set is standard in CA wine country.',
    wineryNote: 'DJs at winery weddings often deal with outdoor speaker setups, noise ordinance pressures, and cut-off times. Great DJs who keep the crowd going under those constraints deserve recognition.',
    included: true,
    contractAmount: 1800,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'band',
    name: 'Live Band',
    emoji: '🎸',
    category: 'Entertainment',
    description: 'Live music / wedding band',
    tipRange: [0, 0],
    flatRange: [25, 50],
    tipBasis: 'flat',
    tipNote: 'Tip per musician. A band of 5 = $125–$250 total.',
    wineryNote: '',
    included: false,
    contractAmount: 5000,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'florist',
    name: 'Florist',
    emoji: '💐',
    category: 'Florals & Décor',
    description: 'Floral design and delivery team',
    tipRange: [0, 0],
    flatRange: [50, 200],
    tipBasis: 'flat',
    tipNote: 'Tips for florists are not standard but appreciated. $50–$100 per delivery/setup person is kind.',
    wineryNote: 'Vineyard florals are complex — coordinating with wind, sun, and aesthetic. Setup teams often arrive at 6am.',
    included: true,
    contractAmount: 3500,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'officiant',
    name: 'Officiant',
    emoji: '💒',
    category: 'Ceremony',
    description: 'Wedding ceremony officiant',
    tipRange: [0, 0],
    flatRange: [50, 150],
    tipBasis: 'flat',
    tipNote: 'Not always expected, especially if you\'re paying a professional rate. $50–$100 for a great ceremony.',
    wineryNote: 'If your officiant is a friend or family member who got ordained, a heartfelt gift card is more appropriate than cash.',
    included: true,
    contractAmount: 600,
    tipMode: 'flat',
    selectedPct: 0,
  },
  {
    id: 'hair-makeup',
    name: 'Hair & Makeup Artists',
    emoji: '💄',
    category: 'Beauty',
    description: 'Bridal beauty team',
    tipRange: [15, 20],
    flatRange: [50, 150],
    tipBasis: 'both',
    tipNote: '15–20% is the standard tip, same as a salon. Tip per artist, not for the whole team.',
    wineryNote: '',
    included: true,
    contractAmount: 1200,
    tipMode: 'percentage',
    selectedPct: 18,
  },
  {
    id: 'transportation',
    name: 'Driver / Transportation',
    emoji: '🚐',
    category: 'Transportation',
    description: 'Shuttle drivers, limo, vintage car',
    tipRange: [15, 20],
    flatRange: [25, 75],
    tipBasis: 'both',
    tipNote: '15–20% of the transportation bill, or $25–$50 per driver for shuttles.',
    wineryNote: 'Winery shuttle drivers navigate rural roads, manage tipsy guests, and often run late-night pick-ups. They deserve it.',
    included: true,
    contractAmount: 1500,
    tipMode: 'percentage',
    selectedPct: 18,
  },
  {
    id: 'wedding-planner',
    name: 'Wedding Planner / Day-Of Coordinator',
    emoji: '📋',
    category: 'Planning',
    description: 'External planner or day-of coordinator (not venue-provided)',
    tipRange: [0, 0],
    flatRange: [100, 500],
    tipBasis: 'flat',
    tipNote: 'Tips are not expected for full-service planners (it\'s their profession, not a service role). A heartfelt card + referral is golden. For day-of coordinators: $100–$250.',
    wineryNote: 'If your planner went above and beyond — negotiating with the winery, solving day-of disasters — a tip or gift is a beautiful gesture.',
    included: false,
    contractAmount: 3500,
    tipMode: 'flat',
    selectedPct: 0,
  },
];

const BUDGET_PRESETS = [
  { label: 'Under $30K', total: 28000 },
  { label: '$30K–$60K', total: 45000 },
  { label: '$60K–$100K', total: 80000 },
  { label: '$100K+', total: 120000 },
];

function formatDollars(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export default function VendorTippingCalculator() {
  const [vendors, setVendors] = useState<Vendor[]>(
    DEFAULT_VENDORS.map((v) => ({ ...v, customTip: undefined }))
  );
  const [guestCount, setGuestCount] = useState(100);
  const [showTipNotes, setShowTipNotes] = useState<Record<string, boolean>>({});

  const toggleVendor = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, included: !v.included } : v))
    );
  };

  const updateContractAmount = (id: string, amount: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, contractAmount: amount, customTip: undefined } : v))
    );
  };

  const updateSelectedPct = (id: string, pct: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, selectedPct: pct, customTip: undefined } : v))
    );
  };

  const updateCustomTip = (id: string, tip: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, customTip: tip } : v))
    );
  };

  const updateTipMode = (id: string, mode: 'percentage' | 'flat') => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, tipMode: mode, customTip: undefined } : v))
    );
  };

  const getTipAmount = useCallback((v: Vendor): number => {
    if (v.customTip !== undefined) return v.customTip;
    if (v.tipMode === 'percentage' && v.contractAmount > 0) {
      return Math.round((v.contractAmount * v.selectedPct) / 100);
    }
    // flat mode: return midpoint of flatRange
    if (v.flatRange) {
      return Math.round((v.flatRange[0] + v.flatRange[1]) / 2);
    }
    return 0;
  }, []);

  const includedVendors = vendors.filter((v) => v.included);
  const totalTip = includedVendors.reduce((sum, v) => sum + getTipAmount(v), 0);

  const categoryGroups = includedVendors.reduce<Record<string, Vendor[]>>((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {});

  const toggleNote = (id: string) => {
    setShowTipNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="inline-flex items-center text-[#8B5A3C] hover:text-[#6B3E2E] mb-6 text-sm font-medium">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4">
            💌 Wedding Vendor Tipping Calculator
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Know exactly how much to tip every vendor at your California winery wedding. 
            Customized for wine country — including tasting room staff, winery coordinators, and vineyard logistics.
            No guessing. No awkward conversations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full font-medium">100% Free</span>
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full font-medium">CA Wine Country Rates</span>
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full font-medium">12 Vendor Types</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Vendor List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border-2 border-[#E8D5C0] p-6">
              <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">Your Vendors</h2>
              <p className="text-gray-500 text-sm mb-4">Toggle vendors on/off, enter contract amounts, and adjust tip percentages. Flat-rate vendors use the suggested range midpoint.</p>
              
              {/* Guest count context */}
              <div className="flex items-center gap-4 bg-[#FAF8F3] rounded-lg p-3 mb-6">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Guest Count:</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 100)}
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                />
                <span className="text-xs text-gray-500">(used as context for notes)</span>
              </div>

              {vendors.map((vendor) => {
                const tipAmt = getTipAmount(vendor);
                const showNote = showTipNotes[vendor.id];
                return (
                  <div
                    key={vendor.id}
                    className={`rounded-lg border-2 mb-4 transition-all ${
                      vendor.included
                        ? 'border-[#8B5A3C] bg-white'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleVendor(vendor.id)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${vendor.included ? 'bg-[#6B3E2E] border-[#6B3E2E]' : 'border-gray-400 bg-white'}`}>
                          {vendor.included && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <span className="text-2xl">{vendor.emoji}</span>
                        <div>
                          <div className="font-semibold text-[#6B3E2E] text-sm sm:text-base">{vendor.name}</div>
                          <div className="text-xs text-gray-500">{vendor.category} · {vendor.description}</div>
                        </div>
                      </div>
                      {vendor.included && (
                        <div className="text-right shrink-0 ml-2">
                          <div className="font-bold text-[#6B3E2E] text-lg">{formatDollars(tipAmt)}</div>
                          <div className="text-xs text-gray-400">suggested tip</div>
                        </div>
                      )}
                    </div>

                    {/* Vendor Detail (expanded when included) */}
                    {vendor.included && (
                      <div className="px-4 pb-4 border-t border-[#F0D5B8] pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Contract Amount */}
                          {vendor.tipBasis !== 'flat' && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Contract Amount ($)</label>
                              <input
                                type="number"
                                min={0}
                                value={vendor.contractAmount || ''}
                                onChange={(e) => updateContractAmount(vendor.id, parseInt(e.target.value) || 0)}
                                placeholder="e.g. 3500"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                              />
                            </div>
                          )}

                          {/* Tip Mode */}
                          {vendor.tipBasis === 'both' && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Tip Method</label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateTipMode(vendor.id, 'percentage')}
                                  className={`flex-1 py-2 rounded text-xs font-medium border transition ${vendor.tipMode === 'percentage' ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]' : 'bg-white text-gray-600 border-gray-300'}`}
                                >
                                  % of contract
                                </button>
                                <button
                                  onClick={() => updateTipMode(vendor.id, 'flat')}
                                  className={`flex-1 py-2 rounded text-xs font-medium border transition ${vendor.tipMode === 'flat' ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]' : 'bg-white text-gray-600 border-gray-300'}`}
                                >
                                  Flat amount
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Tip % Slider */}
                          {vendor.tipMode === 'percentage' && vendor.tipBasis !== 'flat' && (
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Tip Percentage: <span className="font-bold text-[#6B3E2E]">{vendor.selectedPct}%</span>
                                {vendor.contractAmount > 0 && (
                                  <span className="text-gray-400 ml-2">= {formatDollars(vendor.contractAmount * vendor.selectedPct / 100)}</span>
                                )}
                              </label>
                              <input
                                type="range"
                                min={10}
                                max={25}
                                step={1}
                                value={vendor.selectedPct}
                                onChange={(e) => updateSelectedPct(vendor.id, parseInt(e.target.value))}
                                className="w-full accent-[#6B3E2E]"
                              />
                              <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>10% (minimal)</span>
                                <span>18% (standard)</span>
                                <span>25% (exceptional)</span>
                              </div>
                            </div>
                          )}

                          {/* Flat Amount Suggestion */}
                          {(vendor.tipMode === 'flat' || vendor.tipBasis === 'flat') && vendor.flatRange && (
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Tip Amount (suggested: {formatDollars(vendor.flatRange[0])}–{formatDollars(vendor.flatRange[1])})
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={vendor.customTip !== undefined ? vendor.customTip : Math.round((vendor.flatRange[0] + vendor.flatRange[1]) / 2)}
                                onChange={(e) => updateCustomTip(vendor.id, parseInt(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                              />
                              {/* Quick pick buttons */}
                              <div className="flex gap-2 mt-2">
                                {[vendor.flatRange[0], Math.round((vendor.flatRange[0] + vendor.flatRange[1]) / 2), vendor.flatRange[1]].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => updateCustomTip(vendor.id, amt)}
                                    className="flex-1 py-1 text-xs rounded border border-[#C4956A] text-[#6B3E2E] hover:bg-[#F5E6D3] transition"
                                  >
                                    {formatDollars(amt)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tip Note Toggle */}
                        <button
                          onClick={() => toggleNote(vendor.id)}
                          className="mt-3 text-xs text-[#8B5A3C] underline hover:text-[#6B3E2E]"
                        >
                          {showNote ? '▲ Hide tip etiquette' : '▼ Tip etiquette & winery notes'}
                        </button>
                        {showNote && (
                          <div className="mt-2 space-y-2">
                            <div className="bg-[#FAF8F3] rounded p-3 text-xs text-gray-700 leading-relaxed">
                              <span className="font-semibold text-[#6B3E2E]">General: </span>{vendor.tipNote}
                            </div>
                            {vendor.wineryNote && (
                              <div className="bg-[#F5E6D3] rounded p-3 text-xs text-gray-700 leading-relaxed">
                                <span className="font-semibold text-[#6B3E2E]">🍷 Winery-specific: </span>{vendor.wineryNote}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add-back excluded vendors */}
              {vendors.some((v) => !v.included) && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Excluded Vendors (click to add)</p>
                  <div className="flex flex-wrap gap-2">
                    {vendors.filter((v) => !v.included).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => toggleVendor(v.id)}
                        className="text-xs bg-gray-100 hover:bg-[#F5E6D3] text-gray-600 hover:text-[#6B3E2E] border border-gray-300 px-3 py-1.5 rounded-full transition"
                      >
                        + {v.emoji} {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Total Summary */}
              <div className="bg-[#6B3E2E] text-white rounded-xl p-6 shadow-lg">
                <h2 className="font-serif text-xl font-bold mb-1">Total Tip Budget</h2>
                <p className="text-[#F0D5B8] text-sm mb-4">For your {guestCount}-guest wedding</p>
                <div className="text-5xl font-bold font-serif mb-2">{formatDollars(totalTip)}</div>
                <div className="text-sm text-[#F0D5B8]">
                  Across {includedVendors.length} vendor{includedVendors.length !== 1 ? 's' : ''}
                </div>
                <div className="mt-4 pt-4 border-t border-[#8B5A3C] text-xs text-[#F0D5B8] leading-relaxed">
                  💡 Tip: Prepare individual sealed envelopes labeled with each vendor's name. Hand them out at the end of the night — or assign your planner/MOH to do it.
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="bg-white border-2 border-[#E8D5C0] rounded-xl p-5">
                <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-3">Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(categoryGroups).map(([cat, catVendors]) => {
                    const catTotal = catVendors.reduce((sum, v) => sum + getTipAmount(v), 0);
                    return (
                      <div key={cat} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{catVendors[0].emoji} {cat}</span>
                        <span className="font-semibold text-[#6B3E2E]">{formatDollars(catTotal)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center text-sm font-bold border-t border-gray-200 pt-2 mt-2">
                    <span className="text-[#6B3E2E]">Total</span>
                    <span className="text-[#6B3E2E] text-base">{formatDollars(totalTip)}</span>
                  </div>
                </div>
              </div>

              {/* Etiquette Quick Tips */}
              <div className="bg-[#FAF8F3] border border-[#E8D5C0] rounded-xl p-5">
                <h3 className="font-serif text-base font-bold text-[#6B3E2E] mb-3">🍷 Winery Wedding Tip Etiquette</h3>
                <ul className="text-xs text-gray-700 space-y-2 leading-relaxed">
                  <li>• <strong>Check contracts first</strong> — many caterers include 18–22% gratuity. Don't double-tip.</li>
                  <li>• <strong>Cash in envelopes</strong> is the gold standard. Label each with the vendor's name.</li>
                  <li>• <strong>Your MOH or planner</strong> should handle distribution so you don't stress on the day.</li>
                  <li>• <strong>Timing matters</strong> — tip caterers/bartenders at end of service, photographers after final shots.</li>
                  <li>• <strong>Winery staff</strong> (tasting room, pouring staff) often aren't tipped — but leaving a 5-star review is equivalent gold.</li>
                  <li>• <strong>A personal note</strong> with the tip doubles its impact. Takes 2 minutes, remembered forever.</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-white border-2 border-[#8B5A3C] rounded-xl p-5 text-center">
                <p className="text-sm text-gray-600 mb-3">Looking for winery venues in California?</p>
                <Link
                  href="/"
                  className="block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition"
                >
                  Browse 435+ Venues →
                </Link>
                <Link
                  href="/tools/budget-estimator"
                  className="block mt-2 text-[#6B3E2E] hover:text-[#5a3422] font-semibold py-2 px-4 text-sm border-2 border-[#6B3E2E] rounded-lg transition"
                >
                  Estimate Full Budget →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white border-2 border-[#E8D5C0] rounded-xl p-8">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-8 text-center">
            Winery Wedding Tipping FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">Do I have to tip at a winery wedding?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Tipping is never mandatory, but it's a meaningful gesture of appreciation. At winery weddings in California, where vendors often travel long distances and work in challenging outdoor conditions, a well-placed tip goes a long way. The vendors who consistently receive tips report higher job satisfaction and provide even better service at future events.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">What if gratuity is already included in my contract?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Read your contracts carefully. Many caterers and bar service companies in CA wine country include a 18–22% service charge automatically. If that's the case, you don't need to tip again — though a small cash bonus for exceptional service is always a lovely surprise for the team.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">How do I tip a team vs. one person?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                When you're tipping a team (catering crew, floral setup team), you can give one lump sum to the lead and let them distribute it, or individual envelopes for each person you interacted with most. Individual envelopes feel more personal. For a catering team of 8 at a winery dinner, $25–$50 per person is a solid target.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">Should I tip the winery itself / venue coordinator?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Most winery coordinators are salaried employees — tipping isn't expected the same way you'd tip a server. That said, if your coordinator went truly above and beyond, a $150–$300 cash tip or a thoughtful gift (wine, spa gift card) is a genuinely appreciated gesture. A glowing online review of the winery is equally valuable to them.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">When should I hand out tips?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Prepare sealed envelopes in advance and assign your MOH, best man, or planner to distribute them. Caterers and bartenders should receive tips at the end of service. Photographers after their final shots. Musicians/DJs after the last song. Drivers at drop-off. Don't stress about perfect timing on your day — just have someone handle it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#6B3E2E] mb-2">Is tipping in wine country different from other venues?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Yes, in a few ways. Winery weddings often mean outdoor setups in heat or wind, longer setup times, remote locations with difficult logistics, and strict noise ordinance cutoffs that require vendors to work harder under time pressure. These factors make generous tips especially appreciated in California wine country.
              </p>
            </div>
          </div>
        </div>

        {/* Link to other tools */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Continue planning with our other free tools:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/tools/budget-estimator', label: '💰 Budget Estimator' },
              { href: '/tools/wine-calculator', label: '🍇 Wine Calculator' },
              { href: '/tools/shuttle-calculator', label: '🚐 Shuttle Calculator' },
              { href: '/tools/wedding-timeline', label: '🕐 Timeline Generator' },
              { href: '/tools/wine-pairing', label: '🍷 Wine Pairing Planner' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="text-sm bg-white border-2 border-[#8B5A3C] text-[#6B3E2E] hover:bg-[#F5E6D3] px-4 py-2 rounded-lg font-medium transition"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
