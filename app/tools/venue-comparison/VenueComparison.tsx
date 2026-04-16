'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VenueData {
  name: string;
  region: string;
  guestMin: string;
  guestMax: string;
  venueRentalFee: string;
  wineMinimum: string;
  corkageFee: string;          // per bottle
  cateringStyle: string;       // 'in-house' | 'preferred' | 'open'
  cateringCostPer: string;     // per person estimate
  ceremonyIncluded: string;    // 'yes' | 'no' | 'extra'
  ceremonyFee: string;
  indoorSpace: string;         // 'yes' | 'no'
  outdoorSpace: string;        // 'yes' | 'no'
  noiseOrdinance: string;      // end time e.g. "10:00 PM"
  accommodation: string;       // 'onsite' | 'nearby' | 'none'
  exclusivity: string;         // 'full' | 'partial' | 'none'
  harvestBlackout: string;     // 'yes' | 'no' | 'unknown'
  parkingSpots: string;
  vendorHours: string;         // setup start e.g. "8:00 AM"
  notes: string;
}

interface Weights {
  budget: number;
  capacity: number;
  outdoor: number;
  noiseOrdinance: number;
  exclusivity: number;
  catering: number;
  accommodation: number;
  logistics: number;
}

const EMPTY_VENUE: VenueData = {
  name: '', region: '', guestMin: '', guestMax: '',
  venueRentalFee: '', wineMinimum: '', corkageFee: '',
  cateringStyle: '', cateringCostPer: '',
  ceremonyIncluded: '', ceremonyFee: '',
  indoorSpace: '', outdoorSpace: '',
  noiseOrdinance: '', accommodation: '',
  exclusivity: '', harvestBlackout: '',
  parkingSpots: '', vendorHours: '', notes: '',
};

const DEFAULT_WEIGHTS: Weights = {
  budget: 5, capacity: 4, outdoor: 3,
  noiseOrdinance: 3, exclusivity: 3,
  catering: 4, accommodation: 2, logistics: 2,
};

const REGIONS = [
  '', 'Napa Valley', 'Sonoma County', 'Paso Robles',
  'Santa Barbara', 'Temecula', 'Central Coast',
  'Sierra Foothills', 'Livermore Valley', 'Lodi', 'Lake County', 'Other',
];

// ─── URL Encoding (v1) ────────────────────────────────────────────────────────

function encodeState(venues: VenueData[], weights: Weights, guestCount: string): string {
  const payload = { v: 1, g: guestCount, w: weights, venues };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

function decodeState(encoded: string): { venues: VenueData[]; weights: Weights; guestCount: string } | null {
  try {
    const payload = JSON.parse(decodeURIComponent(atob(encoded)));
    if (payload.v !== 1) return null;
    return { venues: payload.venues, weights: payload.w, guestCount: payload.g ?? '' };
  } catch {
    return null;
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

interface VenueScore {
  total: number;
  breakdown: Record<string, { score: number; max: number; note: string }>;
  redFlags: string[];
  greenFlags: string[];
}

function scoreVenue(v: VenueData, w: Weights, guestCount: number): VenueScore {
  const breakdown: Record<string, { score: number; max: number; note: string }> = {};
  const redFlags: string[] = [];
  const greenFlags: string[] = [];

  // Budget score — lower total estimated cost = better
  const rental = parseFloat(v.venueRentalFee) || 0;
  const wineMin = parseFloat(v.wineMinimum) || 0;
  const catering = (parseFloat(v.cateringCostPer) || 0) * guestCount;
  const ceremony = v.ceremonyIncluded === 'extra' ? (parseFloat(v.ceremonyFee) || 0) : 0;
  const totalEstimate = rental + wineMin + catering + ceremony;
  let budgetScore = 5;
  if (totalEstimate > 50000) budgetScore = 1;
  else if (totalEstimate > 35000) budgetScore = 2;
  else if (totalEstimate > 25000) budgetScore = 3;
  else if (totalEstimate > 15000) budgetScore = 4;
  const formattedTotal = totalEstimate > 0 ? `~$${totalEstimate.toLocaleString()} est. base cost` : 'Incomplete data';
  breakdown['Budget'] = { score: budgetScore, max: 5, note: formattedTotal };
  if (wineMin > 5000) redFlags.push(`High wine minimum ($${wineMin.toLocaleString()})`);
  if (parseFloat(v.corkageFee) > 25) redFlags.push(`High corkage fee ($${v.corkageFee}/bottle)`);
  if (totalEstimate > 0 && totalEstimate < 20000) greenFlags.push('Competitive base pricing');

  // Capacity score
  const capMin = parseInt(v.guestMin) || 0;
  const capMax = parseInt(v.guestMax) || 0;
  let capScore = 0;
  let capNote = 'No capacity data';
  if (capMax > 0) {
    if (guestCount >= capMin && guestCount <= capMax) {
      capScore = 5;
      capNote = `Guest count fits (${capMin}–${capMax})`;
      greenFlags.push('Guest count fits comfortably');
    } else if (guestCount < capMin) {
      capScore = 2;
      capNote = `Below minimum (${capMin} min)`;
      redFlags.push(`Your guest count is below minimum (${capMin})`);
    } else if (guestCount > capMax) {
      capScore = 0;
      capNote = `Exceeds max capacity (${capMax})`;
      redFlags.push(`Exceeds maximum capacity (${capMax})`);
    } else {
      capScore = 3;
      capNote = `Capacity: ${capMin}–${capMax}`;
    }
  }
  breakdown['Capacity'] = { score: capScore, max: 5, note: capNote };

  // Outdoor score
  let outdoorScore = 0;
  let outdoorNote = '';
  if (v.outdoorSpace === 'yes' && v.indoorSpace === 'yes') {
    outdoorScore = 5; outdoorNote = 'Indoor + outdoor options';
    greenFlags.push('Both indoor & outdoor spaces');
  } else if (v.outdoorSpace === 'yes') {
    outdoorScore = 4; outdoorNote = 'Outdoor space (no indoor backup)';
    redFlags.push('No indoor backup space');
  } else if (v.indoorSpace === 'yes') {
    outdoorScore = 3; outdoorNote = 'Indoor only';
  } else if (v.outdoorSpace || v.indoorSpace) {
    outdoorScore = 1; outdoorNote = 'No space data';
  }
  breakdown['Outdoor/Indoor'] = { score: outdoorScore, max: 5, note: outdoorNote };

  // Noise ordinance score
  let noiseScore = 3;
  let noiseNote = 'Unknown cutoff';
  if (v.noiseOrdinance) {
    const hour = parseInt(v.noiseOrdinance.split(':')[0]);
    const isPM = v.noiseOrdinance.toLowerCase().includes('pm');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;
    if (hour24 >= 22) { noiseScore = 5; noiseNote = `Music until ${v.noiseOrdinance} ✓`; greenFlags.push(`Late noise cutoff (${v.noiseOrdinance})`); }
    else if (hour24 >= 21) { noiseScore = 3; noiseNote = `Music until ${v.noiseOrdinance}`; }
    else { noiseScore = 1; noiseNote = `Early cutoff: ${v.noiseOrdinance}`; redFlags.push(`Early noise ordinance cutoff (${v.noiseOrdinance})`); }
  }
  breakdown['Noise Ordinance'] = { score: noiseScore, max: 5, note: noiseNote };

  // Exclusivity score
  let exclScore = 0;
  let exclNote = '';
  if (v.exclusivity === 'full') { exclScore = 5; exclNote = 'Full venue exclusivity'; greenFlags.push('Full venue exclusivity'); }
  else if (v.exclusivity === 'partial') { exclScore = 3; exclNote = 'Partial exclusivity'; redFlags.push('Winery may be open to public during your event'); }
  else if (v.exclusivity === 'none') { exclScore = 1; exclNote = 'No exclusivity'; redFlags.push('No venue exclusivity — public access during event'); }
  breakdown['Exclusivity'] = { score: exclScore, max: 5, note: exclNote };

  // Catering score
  let caterScore = 0;
  let caterNote = '';
  if (v.cateringStyle === 'open') { caterScore = 5; caterNote = 'Open vendor list'; greenFlags.push('Open catering — bring any vendor'); }
  else if (v.cateringStyle === 'preferred') { caterScore = 3; caterNote = 'Preferred vendor list'; }
  else if (v.cateringStyle === 'in-house') { caterScore = 2; caterNote = 'In-house catering only'; }
  breakdown['Catering Flexibility'] = { score: caterScore, max: 5, note: caterNote };

  // Accommodation score
  let accomScore = 0;
  let accomNote = '';
  if (v.accommodation === 'onsite') { accomScore = 5; accomNote = 'On-site accommodation'; greenFlags.push('On-site guest accommodation'); }
  else if (v.accommodation === 'nearby') { accomScore = 3; accomNote = 'Hotels nearby'; }
  else if (v.accommodation === 'none') { accomScore = 1; accomNote = 'No nearby accommodation'; redFlags.push('No accommodation nearby — guests must drive/Uber far'); }
  breakdown['Accommodation'] = { score: accomScore, max: 5, note: accomNote };

  // Logistics score
  let logScore = 3;
  let logNote = '';
  const vendorHour = v.vendorHours ? parseInt(v.vendorHours.split(':')[0]) : null;
  if (vendorHour !== null) {
    if (vendorHour <= 8) { logScore = 5; logNote = `Vendor access from ${v.vendorHours}`; greenFlags.push(`Early vendor access (${v.vendorHours})`); }
    else if (vendorHour <= 10) { logScore = 3; logNote = `Vendor access from ${v.vendorHours}`; }
    else { logScore = 1; logNote = `Late vendor access (${v.vendorHours})`; redFlags.push(`Late vendor setup time (${v.vendorHours})`); }
  }
  if (v.harvestBlackout === 'yes') { redFlags.push('Harvest season blackout dates'); logScore = Math.max(1, logScore - 1); }
  breakdown['Logistics'] = { score: logScore, max: 5, note: logNote || 'No logistics data' };

  // Weighted total (out of 100)
  const weights = [
    { key: 'Budget', w: w.budget },
    { key: 'Capacity', w: w.capacity },
    { key: 'Outdoor/Indoor', w: w.outdoor },
    { key: 'Noise Ordinance', w: w.noiseOrdinance },
    { key: 'Exclusivity', w: w.exclusivity },
    { key: 'Catering Flexibility', w: w.catering },
    { key: 'Accommodation', w: w.accommodation },
    { key: 'Logistics', w: w.logistics },
  ];
  const totalWeight = weights.reduce((s, x) => s + x.w, 0);
  const weightedSum = weights.reduce((s, x) => {
    const b = breakdown[x.key];
    return s + (b ? (b.score / b.max) * x.w : 0);
  }, 0);
  const total = Math.round((weightedSum / totalWeight) * 100);

  return { total, breakdown, redFlags, greenFlags };
}

// ─── Components ───────────────────────────────────────────────────────────────

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? '#2d7a3a' : pct >= 50 ? '#8B5A3C' : '#c0392b';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{score}/{max}</span>
    </div>
  );
}

function WeightSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-40 flex-shrink-0">{label}</span>
      <input
        type="range" min={1} max={5} step={1} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="flex-1 accent-[#6B3E2E]"
      />
      <span className="text-sm font-bold text-[#6B3E2E] w-6 text-center">{value}</span>
    </div>
  );
}

function SelectField({ label, value, options, onChange, required }: {
  label: string; value: string; options: { value: string; label: string }[];
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B5A3C]"
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, placeholder, helpText }: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; placeholder?: string; helpText?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {helpText && <p className="text-xs text-gray-400 mb-1">{helpText}</p>}
      <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-[#8B5A3C]">
        {prefix && <span className="bg-gray-100 px-2 py-1.5 text-sm text-gray-500 border-r border-gray-300">{prefix}</span>}
        <input
          type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          className="flex-1 px-2 py-1.5 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B5A3C]"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VenueComparison() {
  const [venues, setVenues] = useState<VenueData[]>([
    { ...EMPTY_VENUE, name: 'Venue 1' },
    { ...EMPTY_VENUE, name: 'Venue 2' },
  ]);
  const [weights, setWeights] = useState<Weights>({ ...DEFAULT_WEIGHTS });
  const [guestCount, setGuestCount] = useState('80');
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isUpdatingFromUrl = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedHash = useRef<string>('');

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (encoded) {
      const decoded = decodeState(encoded);
      if (decoded) {
        isUpdatingFromUrl.current = true;
        setVenues(decoded.venues);
        setWeights(decoded.weights);
        setGuestCount(decoded.guestCount);
      }
    }
    setLoaded(true);
  }, []);

  // Silent background save to Airtable — debounced 8s, only when data changes
  const saveToAirtable = useCallback((v: VenueData[], w: Weights, g: string, s: VenueScore[]) => {
    if (!loaded) return;
    if (!v.some(venue => venue.name?.trim())) return; // need at least one named venue

    const bestIdx = s.reduce((best, sc, i) => sc.total > s[best].total ? i : best, 0);
    const payload = {
      guestCount: g,
      venues: v,
      scores: s.map(sc => sc.total),
      winnerName: v[bestIdx]?.name || '',
      winnerScore: s[bestIdx]?.total || 0,
    };
    const hash = JSON.stringify(payload);
    if (hash === lastSavedHash.current) return; // no change

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      lastSavedHash.current = hash;
      fetch('/api/venue-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {}); // silent — never surface errors to user
    }, 8000); // 8s debounce — wait for them to finish typing
  }, [loaded]);

  // Sync to URL whenever state changes
  const syncToUrl = useCallback((v: VenueData[], w: Weights, g: string) => {
    if (!loaded) return;
    const encoded = encodeState(v, w, g);
    const url = new URL(window.location.href);
    url.searchParams.set('d', encoded);
    window.history.replaceState({}, '', url.toString());
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const currentScores = venues.map(v => scoreVenue(v, weights, parseInt(guestCount) || 80));
    syncToUrl(venues, weights, guestCount);
    saveToAirtable(venues, weights, guestCount, currentScores);
  }, [venues, weights, guestCount, loaded, syncToUrl, saveToAirtable]);

  const updateVenue = useCallback((idx: number, field: keyof VenueData, value: string) => {
    setVenues(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }, []);

  const addVenue = () => {
    if (venues.length < 3) {
      setVenues(prev => [...prev, { ...EMPTY_VENUE, name: `Venue ${prev.length + 1}` }]);
      setActiveTab(venues.length);
    }
  };

  const removeVenue = (idx: number) => {
    if (venues.length <= 2) return;
    setVenues(prev => prev.filter((_, i) => i !== idx));
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const gc = parseInt(guestCount) || 80;
  const scores = venues.map(v => scoreVenue(v, weights, gc));
  const bestIdx = scores.reduce((best, s, i) => s.total > scores[best].total ? i : best, 0);
  const hasAnyData = venues.some(v => v.name || v.venueRentalFee || v.guestMax);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="inline-flex items-center text-[#8B5A3C] hover:text-[#6B3E2E] text-sm mb-6">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4">
            🏛️ Venue Comparison Scorecard
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Compare up to 3 winery venues side by side. Enter details from your venue tours — we'll score them on what actually matters and surface hidden costs and red flags.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full">100% Free</span>
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full">Shareable Link</span>
            <span className="bg-white border border-[#8B5A3C] text-[#6B3E2E] px-3 py-1 rounded-full">Winery-Specific Scoring</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Guest Count + Share */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-[#6B3E2E]">Your Guest Count:</label>
            <input
              type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)}
              className="w-24 border-2 border-[#8B5A3C] rounded px-3 py-1.5 text-center font-bold text-[#6B3E2E] focus:outline-none"
              min={1}
            />
            <span className="text-gray-500 text-sm">guests</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[#6B3E2E] hover:bg-[#5a3422] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white border-2 border-[#8B5A3C] text-[#6B3E2E] hover:bg-[#F5E6D3] px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        {/* Score Summary — shown when there's data */}
        {hasAnyData && (
          <div className="bg-white border-2 border-[#8B5A3C] rounded-xl p-6">
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">📊 Score Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {venues.map((v, i) => {
                const s = scores[i];
                const isBest = i === bestIdx && s.total > 0;
                return (
                  <div key={i} className={`rounded-xl p-5 border-2 relative ${isBest ? 'border-[#2d7a3a] bg-[#f0faf1]' : 'border-gray-200 bg-gray-50'}`}>
                    {isBest && <div className="absolute -top-3 left-4 bg-[#2d7a3a] text-white text-xs font-bold px-3 py-0.5 rounded-full">⭐ Top Pick</div>}
                    <div className="font-serif text-lg font-bold text-[#6B3E2E] mb-1 truncate">{v.name || `Venue ${i + 1}`}</div>
                    {v.region && <div className="text-xs text-gray-500 mb-3">{v.region}</div>}
                    <div className={`text-4xl font-bold mb-1 ${s.total >= 70 ? 'text-[#2d7a3a]' : s.total >= 45 ? 'text-[#8B5A3C]' : 'text-[#c0392b]'}`}>
                      {s.total}<span className="text-lg font-normal text-gray-400">/100</span>
                    </div>
                    <div className="space-y-1.5 mt-3">
                      {Object.entries(s.breakdown).map(([key, val]) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                            <span>{key}</span>
                            <span className="truncate ml-2 text-right max-w-[140px]">{val.note}</span>
                          </div>
                          <ScoreBar score={val.score} max={val.max} />
                        </div>
                      ))}
                    </div>
                    {s.redFlags.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {s.redFlags.map((f, fi) => (
                          <div key={fi} className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">⚠️ {f}</div>
                        ))}
                      </div>
                    )}
                    {s.greenFlags.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {s.greenFlags.map((f, fi) => (
                          <div key={fi} className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">✓ {f}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {scores.some(s => s.total > 0) && (
              <div className="mt-4 bg-[#F5E6D3] rounded-lg p-4">
                <p className="text-[#6B3E2E] font-semibold">
                  💡 Our take: <span className="font-bold">{venues[bestIdx].name || `Venue ${bestIdx + 1}`}</span> scores highest based on your priorities.
                  {scores[bestIdx].redFlags.length > 0 && ' But review the red flags before deciding.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Priorities Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-[#6B3E2E] mb-2">🎯 What Matters Most to You?</h2>
          <p className="text-sm text-gray-500 mb-4">Drag each slider to set how much each factor matters. 1 = minor, 5 = dealbreaker.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <WeightSlider label="Budget / Cost" value={weights.budget} onChange={v => setWeights(w => ({ ...w, budget: v }))} />
            <WeightSlider label="Guest Capacity" value={weights.capacity} onChange={v => setWeights(w => ({ ...w, capacity: v }))} />
            <WeightSlider label="Outdoor Space" value={weights.outdoor} onChange={v => setWeights(w => ({ ...w, outdoor: v }))} />
            <WeightSlider label="Noise Ordinance / End Time" value={weights.noiseOrdinance} onChange={v => setWeights(w => ({ ...w, noiseOrdinance: v }))} />
            <WeightSlider label="Venue Exclusivity" value={weights.exclusivity} onChange={v => setWeights(w => ({ ...w, exclusivity: v }))} />
            <WeightSlider label="Catering Flexibility" value={weights.catering} onChange={v => setWeights(w => ({ ...w, catering: v }))} />
            <WeightSlider label="Guest Accommodation" value={weights.accommodation} onChange={v => setWeights(w => ({ ...w, accommodation: v }))} />
            <WeightSlider label="Logistics / Setup" value={weights.logistics} onChange={v => setWeights(w => ({ ...w, logistics: v }))} />
          </div>
        </div>

        {/* Venue Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {venues.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition border-2 ${activeTab === i ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]' : 'bg-white text-[#6B3E2E] border-[#8B5A3C] hover:bg-[#F5E6D3]'}`}
              >
                {v.name || `Venue ${i + 1}`}
                {scores[i].total > 0 && (
                  <span className={`ml-2 text-xs font-bold ${activeTab === i ? 'text-white/80' : 'text-[#8B5A3C]'}`}>
                    {scores[i].total}
                  </span>
                )}
              </button>
            ))}
            {venues.length < 3 && (
              <button
                onClick={addVenue}
                className="px-4 py-2 rounded-lg text-sm font-semibold border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#8B5A3C] hover:text-[#6B3E2E] transition"
              >
                + Add Venue
              </button>
            )}
          </div>

          {/* Venue Form */}
          {venues.map((v, i) => i === activeTab && (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#6B3E2E]">Venue Details</h2>
                {venues.length > 2 && (
                  <button onClick={() => removeVenue(i)} className="text-red-400 hover:text-red-600 text-sm">Remove venue</button>
                )}
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-[#8B5A3C] text-sm uppercase tracking-wider mb-3">Basic Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Venue Name *" value={v.name} onChange={val => updateVenue(i, 'name', val)} placeholder="e.g. Stag's Leap Wine Cellars" />
                  <SelectField
                    label="Region *" value={v.region}
                    options={REGIONS.filter(r => r).map(r => ({ value: r, label: r }))}
                    onChange={val => updateVenue(i, 'region', val)}
                  />
                  <NumberField label="Min Guests" value={v.guestMin} onChange={val => updateVenue(i, 'guestMin', val)} placeholder="e.g. 50" />
                  <NumberField label="Max Guests" value={v.guestMax} onChange={val => updateVenue(i, 'guestMax', val)} placeholder="e.g. 200" />
                </div>
              </div>

              {/* Costs */}
              <div>
                <h3 className="font-semibold text-[#8B5A3C] text-sm uppercase tracking-wider mb-3">Costs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField label="Venue Rental Fee" value={v.venueRentalFee} onChange={val => updateVenue(i, 'venueRentalFee', val)} prefix="$" placeholder="e.g. 8000" helpText="Base fee for the day" />
                  <NumberField label="Wine Minimum" value={v.wineMinimum} onChange={val => updateVenue(i, 'wineMinimum', val)} prefix="$" placeholder="e.g. 3000" helpText="Min spend on winery wine" />
                  <NumberField label="Corkage Fee (per bottle)" value={v.corkageFee} onChange={val => updateVenue(i, 'corkageFee', val)} prefix="$" placeholder="e.g. 15" helpText="Fee to bring outside wine" />
                  <div>
                    <SelectField
                      label="Ceremony Included?" value={v.ceremonyIncluded}
                      options={[{ value: 'yes', label: 'Yes — included' }, { value: 'extra', label: 'Yes — extra fee' }, { value: 'no', label: 'No ceremony space' }]}
                      onChange={val => updateVenue(i, 'ceremonyIncluded', val)}
                    />
                  </div>
                  {v.ceremonyIncluded === 'extra' && (
                    <NumberField label="Ceremony Fee" value={v.ceremonyFee} onChange={val => updateVenue(i, 'ceremonyFee', val)} prefix="$" placeholder="e.g. 2500" />
                  )}
                  <SelectField
                    label="Catering Style" value={v.cateringStyle}
                    options={[{ value: 'in-house', label: 'In-house only' }, { value: 'preferred', label: 'Preferred vendor list' }, { value: 'open', label: 'Open — bring any vendor' }]}
                    onChange={val => updateVenue(i, 'cateringStyle', val)}
                  />
                  <NumberField label="Est. Catering Cost (per person)" value={v.cateringCostPer} onChange={val => updateVenue(i, 'cateringCostPer', val)} prefix="$" placeholder="e.g. 120" helpText="From venue quote or caterer" />
                </div>
              </div>

              {/* Space & Logistics */}
              <div>
                <h3 className="font-semibold text-[#8B5A3C] text-sm uppercase tracking-wider mb-3">Space & Logistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Indoor Space?" value={v.indoorSpace}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                    onChange={val => updateVenue(i, 'indoorSpace', val)}
                  />
                  <SelectField
                    label="Outdoor Space?" value={v.outdoorSpace}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                    onChange={val => updateVenue(i, 'outdoorSpace', val)}
                  />
                  <TextField label="Noise Ordinance Cutoff" value={v.noiseOrdinance} onChange={val => updateVenue(i, 'noiseOrdinance', val)} placeholder="e.g. 10:00 PM" />
                  <TextField label="Vendor Setup Access From" value={v.vendorHours} onChange={val => updateVenue(i, 'vendorHours', val)} placeholder="e.g. 8:00 AM" />
                  <SelectField
                    label="Venue Exclusivity" value={v.exclusivity}
                    options={[{ value: 'full', label: 'Full — venue is yours only' }, { value: 'partial', label: 'Partial — some public access' }, { value: 'none', label: 'None — winery stays open' }]}
                    onChange={val => updateVenue(i, 'exclusivity', val)}
                  />
                  <SelectField
                    label="Guest Accommodation" value={v.accommodation}
                    options={[{ value: 'onsite', label: 'On-site accommodation' }, { value: 'nearby', label: 'Hotels within 15 min' }, { value: 'none', label: 'No nearby options' }]}
                    onChange={val => updateVenue(i, 'accommodation', val)}
                  />
                  <SelectField
                    label="Harvest Season Blackout?" value={v.harvestBlackout}
                    options={[{ value: 'no', label: 'No blackout dates' }, { value: 'yes', label: 'Yes — Aug–Oct restricted' }, { value: 'unknown', label: 'Not sure yet' }]}
                    onChange={val => updateVenue(i, 'harvestBlackout', val)}
                  />
                  <NumberField label="Parking Spots" value={v.parkingSpots} onChange={val => updateVenue(i, 'parkingSpots', val)} placeholder="e.g. 80" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Notes</label>
                <textarea
                  value={v.notes}
                  onChange={e => updateVenue(i, 'notes', e.target.value)}
                  placeholder="Anything else from your venue tour — vibe, coordinator responsiveness, gut feeling…"
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B5A3C] resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Winery-specific tips */}
        <div className="bg-[#F5E6D3] rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">🍷 What to Watch Out For at Winery Venues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">Wine Minimums Can Surprise You</div>
              <p>Many wineries require a minimum wine purchase — often $2,000–$10,000+. This is on top of the venue rental fee. Ask if it's per-event or per-person and whether leftover bottles come home with you.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">Exclusivity Is Critical</div>
              <p>Some wineries stay open to the public during your event. Imagine strangers walking through during your ceremony. Always ask whether the tasting room closes and whether non-wedding guests are present.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">Noise Ordinances Are Real</div>
              <p>Most CA wine country counties enforce a 10:00 PM cutoff — some as early as 9:00 PM. Live music typically must stop 30 min before. Confirm the exact rule, not the venue's interpretation of it.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">Harvest Season Logistics</div>
              <p>August through October is harvest. Tractors, workers, and harvest trucks may be on property. Some wineries blackout wedding dates entirely. Others allow weddings but the energy is different.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">Catering Flexibility = Budget Flexibility</div>
              <p>In-house or preferred-only catering means you can't shop around. Open vendor policies let you negotiate and often save $15–30 per person. Factor this into your total cost comparison.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-[#6B3E2E] mb-1">No Indoor Backup = Real Risk</div>
              <p>Outdoor-only venues in CA wine country mean a June heat wave or October wind storm could ruin your day. Ask about tent policies, who provides them, and if a rain date is possible.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Ready to Start Touring?</h2>
          <p className="text-gray-600">Browse 435+ California winery venues — filter by region, capacity, and style.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-6 rounded-lg transition">
              Browse All Wineries →
            </Link>
            <Link href="/tools/budget-estimator" className="bg-white border-2 border-[#6B3E2E] text-[#6B3E2E] hover:bg-[#F5E6D3] font-semibold py-3 px-6 rounded-lg transition">
              Estimate Your Budget
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-6">Winery Venue Comparison FAQ</h2>
          <div className="space-y-5 text-sm text-gray-700">
            {[
              {
                q: 'How does the scoring work?',
                a: 'Each venue is scored across 8 criteria: budget, capacity, outdoor/indoor space, noise ordinance, exclusivity, catering flexibility, accommodation, and logistics. You control how much each factor matters using the priority sliders. The weighted scores produce a total out of 100.'
              },
              {
                q: 'Will my comparison be saved?',
                a: 'Yes — everything is encoded directly into the URL. Copy the share link and your full comparison is preserved. Bookmark it, text it to your partner, or open it later. No account required. The link is permanent as long as you keep it.'
              },
              {
                q: 'What is a wine minimum and why does it matter?',
                a: 'Most wineries require you to purchase a minimum dollar amount of their wine. This can range from $1,500 to over $10,000 and is separate from the venue rental fee. It\'s one of the biggest hidden costs couples discover too late. Always confirm what happens to unsold bottles — many wineries let you take them home.'
              },
              {
                q: 'What\'s a typical noise ordinance in CA wine country?',
                a: 'Most counties in Napa, Sonoma, and Paso Robles enforce a 10:00 PM amplified music cutoff. Some require it even earlier. Violating it can result in fines and early shutdown. Your venue coordinator should have the exact county ordinance — get it in writing.'
              },
              {
                q: 'Should I worry about harvest season?',
                a: 'It depends on the winery. Some fully close to weddings during August–October harvest. Others allow it but harvest activity may be visible or audible on property. If you want a fall wedding, ask explicitly what harvest looks like at that venue and whether any dates are blocked.'
              },
            ].map(({ q, a }, idx) => (
              <div key={idx} className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="font-bold text-[#6B3E2E] mb-2">{q}</div>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
