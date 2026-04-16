'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BudgetResult {
  venue: { low: number; high: number };
  catering: { low: number; high: number };
  wine: { low: number; high: number };
  photography: { low: number; high: number };
  florals: { low: number; high: number };
  music: { low: number; high: number };
  officiant: { low: number; high: number };
  rentals: { low: number; high: number };
  transportation: { low: number; high: number };
  hair_makeup: { low: number; high: number };
  cake: { low: number; high: number };
  invitations: { low: number; high: number };
  tips_misc: { low: number; high: number };
  total: { low: number; high: number };
  perGuest: { low: number; high: number };
}

const REGION_MULTIPLIERS: Record<string, { label: string; multiplier: number; description: string }> = {
  napa: { label: 'Napa Valley', multiplier: 1.45, description: 'Most prestigious, highest demand' },
  sonoma: { label: 'Sonoma County', multiplier: 1.25, description: 'Upscale but more options available' },
  paso_robles: { label: 'Paso Robles', multiplier: 0.85, description: 'Excellent value, stunning scenery' },
  santa_barbara: { label: 'Santa Barbara', multiplier: 1.15, description: 'Coastal wine country charm' },
  temecula: { label: 'Temecula Valley', multiplier: 0.80, description: 'Southern CA, best value for LA couples' },
  lodi: { label: 'Lodi / Central Valley', multiplier: 0.70, description: 'Most budget-friendly option' },
  livermore: { label: 'Livermore / East Bay', multiplier: 0.90, description: 'Close to Bay Area, good value' },
  santa_cruz: { label: 'Santa Cruz Mountains', multiplier: 1.05, description: 'Boutique, intimate estates' },
};

const SEASON_MULTIPLIERS: Record<string, { label: string; multiplier: number; note: string }> = {
  peak: { label: 'Peak (Sept–Oct)', multiplier: 1.20, note: 'Harvest season — stunning but book 18+ months out' },
  high: { label: 'High (May–Aug)', multiplier: 1.10, note: 'Warm weather, peak outdoor season' },
  shoulder: { label: 'Shoulder (Mar–Apr, Nov)', multiplier: 0.90, note: 'Great weather, better availability and pricing' },
  off: { label: 'Off-Peak (Dec–Feb)', multiplier: 0.75, note: 'Lowest prices, indoor-focused, cozy atmosphere' },
};

const DAY_MULTIPLIERS: Record<string, { label: string; multiplier: number }> = {
  saturday: { label: 'Saturday', multiplier: 1.15 },
  sunday: { label: 'Sunday', multiplier: 1.00 },
  friday: { label: 'Friday', multiplier: 0.90 },
  weekday: { label: 'Weekday (Mon–Thu)', multiplier: 0.75 },
};

const STYLE_CONFIG: Record<string, { label: string; emoji: string; description: string }> = {
  intimate: { label: 'Intimate', emoji: '🥂', description: 'Under 50 guests, private estate feel' },
  classic: { label: 'Classic', emoji: '🍾', description: '50–120 guests, full reception' },
  grand: { label: 'Grand Celebration', emoji: '✨', description: '120–200 guests, all-out affair' },
};

function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatRange(low: number, high: number): string {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

export default function BudgetEstimatorPage() {
  const [guestCount, setGuestCount] = useState(80);
  const [region, setRegion] = useState('napa');
  const [season, setSeason] = useState('high');
  const [dayOfWeek, setDayOfWeek] = useState('saturday');
  const [style, setStyle] = useState('classic');
  const [includePhotography, setIncludePhotography] = useState(true);
  const [includeFlorals, setIncludeFlorals] = useState(true);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeTransportation, setIncludeTransportation] = useState(true);
  const [result, setResult] = useState<BudgetResult | null>(null);

  const calculate = () => {
    const regionMult = REGION_MULTIPLIERS[region].multiplier;
    const seasonMult = SEASON_MULTIPLIERS[season].multiplier;
    const dayMult = DAY_MULTIPLIERS[dayOfWeek].multiplier;
    const combinedMult = regionMult * seasonMult * dayMult;

    // Style factor
    const styleFactor = style === 'intimate' ? 0.80 : style === 'grand' ? 1.20 : 1.0;

    // Base rates per guest (moderate CA market baseline)
    const baseVenueLow = 4500;
    const baseVenueHigh = 8000;
    const cateringPerGuestLow = 95;
    const cateringPerGuestHigh = 175;
    const winePerGuestLow = 28;
    const winePerGuestHigh = 55;

    const venue = {
      low: Math.round(baseVenueLow * combinedMult * styleFactor),
      high: Math.round(baseVenueHigh * combinedMult * styleFactor),
    };

    const catering = {
      low: Math.round(guestCount * cateringPerGuestLow * combinedMult * styleFactor),
      high: Math.round(guestCount * cateringPerGuestHigh * combinedMult * styleFactor),
    };

    const wine = {
      low: Math.round(guestCount * winePerGuestLow * regionMult),
      high: Math.round(guestCount * winePerGuestHigh * regionMult),
    };

    const photography = includePhotography
      ? {
          low: Math.round(3500 * regionMult * styleFactor),
          high: Math.round(7500 * regionMult * styleFactor),
        }
      : { low: 0, high: 0 };

    const florals = includeFlorals
      ? {
          low: Math.round((1200 + guestCount * 18) * combinedMult * styleFactor),
          high: Math.round((2500 + guestCount * 38) * combinedMult * styleFactor),
        }
      : { low: 0, high: 0 };

    const music = includeMusic
      ? {
          low: Math.round(1800 * regionMult * styleFactor),
          high: Math.round(5500 * regionMult * styleFactor),
        }
      : { low: 0, high: 0 };

    const officiant = {
      low: Math.round(400 * regionMult),
      high: Math.round(1200 * regionMult),
    };

    const rentals = {
      low: Math.round((guestCount * 22) * combinedMult * styleFactor),
      high: Math.round((guestCount * 55) * combinedMult * styleFactor),
    };

    const transportation = includeTransportation
      ? {
          low: Math.round(1200 * regionMult),
          high: Math.round(3500 * regionMult),
        }
      : { low: 0, high: 0 };

    const hair_makeup = {
      low: Math.round(600 * regionMult),
      high: Math.round(1800 * regionMult),
    };

    const cake = {
      low: Math.round(guestCount * 6),
      high: Math.round(guestCount * 14),
    };

    const invitations = {
      low: Math.round(guestCount * 4),
      high: Math.round(guestCount * 9),
    };

    const subtotalLow =
      venue.low + catering.low + wine.low + photography.low + florals.low +
      music.low + officiant.low + rentals.low + transportation.low +
      hair_makeup.low + cake.low + invitations.low;

    const subtotalHigh =
      venue.high + catering.high + wine.high + photography.high + florals.high +
      music.high + officiant.high + rentals.high + transportation.high +
      hair_makeup.high + cake.high + invitations.high;

    const tips_misc = {
      low: Math.round(subtotalLow * 0.08),
      high: Math.round(subtotalHigh * 0.12),
    };

    const total = {
      low: subtotalLow + tips_misc.low,
      high: subtotalHigh + tips_misc.high,
    };

    const perGuest = {
      low: Math.round(total.low / guestCount),
      high: Math.round(total.high / guestCount),
    };

    setResult({
      venue, catering, wine, photography, florals, music,
      officiant, rentals, transportation, hair_makeup, cake,
      invitations, tips_misc, total, perGuest,
    });
  };

  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestCount, region, season, dayOfWeek, style, includePhotography, includeFlorals, includeMusic, includeTransportation]);

  const lineItems = result
    ? [
        { label: '🏛️ Venue Fee', value: result.venue, always: true },
        { label: '🍽️ Catering & Bar Service', value: result.catering, always: true },
        { label: '🍷 Wine & Beverages', value: result.wine, always: true },
        { label: '📸 Photography & Videography', value: result.photography, always: false, toggle: includePhotography },
        { label: '💐 Florals & Décor', value: result.florals, always: false, toggle: includeFlorals },
        { label: '🎵 Music / DJ / Band', value: result.music, always: false, toggle: includeMusic },
        { label: '💒 Officiant', value: result.officiant, always: true },
        { label: '🪑 Rentals (tables, chairs, linens)', value: result.rentals, always: true },
        { label: '🚐 Guest Transportation', value: result.transportation, always: false, toggle: includeTransportation },
        { label: '💄 Hair & Makeup', value: result.hair_makeup, always: true },
        { label: '🎂 Cake & Desserts', value: result.cake, always: true },
        { label: '✉️ Invitations & Stationery', value: result.invitations, always: true },
        { label: '✨ Tips, Gratuities & Miscellaneous', value: result.tips_misc, always: true },
      ].filter((item) => item.always || item.toggle)
    : [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4 leading-tight">
            💰 Winery Wedding Budget Estimator
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Get a realistic, itemized budget estimate for your California winery wedding — tailored to your region, guest count, season, and style. Updated with real 2024–2025 wine country rates.
          </p>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT: Inputs */}
            <div className="bg-white rounded-lg border-2 border-[#8B5A3C] p-8 space-y-8">
              <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Your Wedding Details</h2>

              {/* Guest Count */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-800">Guest Count</label>
                  <span className="font-bold text-[#6B3E2E] text-lg">{guestCount} guests</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={250}
                  step={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B3E2E]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>20</span>
                  <span>250</span>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="font-semibold text-gray-800 block mb-3">Wine Region</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(REGION_MULTIPLIERS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setRegion(key)}
                      className={`text-left px-3 py-2 rounded-lg text-sm border-2 transition ${
                        region === key
                          ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#8B5A3C]'
                      }`}
                    >
                      <div className="font-semibold">{val.label}</div>
                      <div className={`text-xs mt-0.5 ${region === key ? 'text-amber-200' : 'text-gray-400'}`}>
                        {val.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <label className="font-semibold text-gray-800 block mb-3">Season</label>
                <div className="space-y-2">
                  {Object.entries(SEASON_MULTIPLIERS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setSeason(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                        season === key
                          ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#8B5A3C]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{val.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          season === key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {val.multiplier > 1 ? `+${Math.round((val.multiplier - 1) * 100)}%` : val.multiplier < 1 ? `-${Math.round((1 - val.multiplier) * 100)}%` : 'Base'}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 ${season === key ? 'text-amber-200' : 'text-gray-500'}`}>
                        {val.note}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day of Week */}
              <div>
                <label className="font-semibold text-gray-800 block mb-2">Day of Week</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DAY_MULTIPLIERS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setDayOfWeek(key)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold border-2 transition flex justify-between items-center ${
                        dayOfWeek === key
                          ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#8B5A3C]'
                      }`}
                    >
                      <span>{val.label}</span>
                      {val.multiplier !== 1.0 && (
                        <span className={`text-xs ${dayOfWeek === key ? 'text-amber-200' : 'text-gray-400'}`}>
                          {val.multiplier > 1 ? `+${Math.round((val.multiplier - 1) * 100)}%` : `-${Math.round((1 - val.multiplier) * 100)}%`}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="font-semibold text-gray-800 block mb-2">Wedding Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STYLE_CONFIG).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setStyle(key)}
                      className={`px-3 py-3 rounded-lg text-sm border-2 transition text-center ${
                        style === key
                          ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#8B5A3C]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{val.emoji}</div>
                      <div className="font-semibold text-xs">{val.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Services */}
              <div>
                <label className="font-semibold text-gray-800 block mb-3">Include in Estimate</label>
                <div className="space-y-3">
                  {[
                    { label: '📸 Photography & Videography', state: includePhotography, setter: setIncludePhotography },
                    { label: '💐 Florals & Décor', state: includeFlorals, setter: setIncludeFlorals },
                    { label: '🎵 Music / DJ / Band', state: includeMusic, setter: setIncludeMusic },
                    { label: '🚐 Guest Transportation', state: includeTransportation, setter: setIncludeTransportation },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="w-5 h-5 rounded accent-[#6B3E2E]"
                      />
                      <span className="text-gray-700 group-hover:text-[#6B3E2E] transition text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Results */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Total Summary */}
                  <div className="bg-[#6B3E2E] text-white rounded-lg p-8">
                    <div className="text-center">
                      <p className="text-amber-200 text-sm font-semibold uppercase tracking-wide mb-2">
                        Estimated Total Budget
                      </p>
                      <p className="font-serif text-4xl sm:text-5xl font-bold mb-2">
                        {formatCurrency(result.total.low)}
                      </p>
                      <p className="text-amber-200 text-lg mb-1">
                        to {formatCurrency(result.total.high)}
                      </p>
                      <div className="border-t border-white/20 mt-4 pt-4">
                        <p className="text-amber-100 text-sm">
                          Per guest: {formatCurrency(result.perGuest.low)} – {formatCurrency(result.perGuest.high)}
                        </p>
                        <p className="text-amber-200 text-xs mt-1">
                          {REGION_MULTIPLIERS[region].label} · {SEASON_MULTIPLIERS[season].label} · {guestCount} guests
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Line Item Breakdown */}
                  <div className="bg-white rounded-lg border-2 border-[#8B5A3C] p-6">
                    <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-5">Itemized Breakdown</h3>
                    <div className="space-y-3">
                      {lineItems.map((item) => {
                        const totalLow = result.total.low;
                        const pct = Math.round(((item.value.low + item.value.high) / 2 / ((totalLow + result.total.high) / 2)) * 100);
                        return (
                          <div key={item.label}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                              <span className="text-sm font-semibold text-gray-900 ml-4 text-right whitespace-nowrap">
                                {formatRange(item.value.low, item.value.high)}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#8B5A3C] rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t-2 border-[#8B5A3C] mt-5 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total Estimate</span>
                        <span className="font-bold text-[#6B3E2E] text-lg">
                          {formatRange(result.total.low, result.total.high)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Region Insight */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-900 text-sm">
                      <span className="font-semibold">📍 {REGION_MULTIPLIERS[region].label}:</span>{' '}
                      {REGION_MULTIPLIERS[region].description}. {SEASON_MULTIPLIERS[season].note}.
                    </p>
                  </div>

                  {/* Budget Saving Tips */}
                  <div className="bg-[#F5E6D3] rounded-lg p-5">
                    <h4 className="font-serif text-lg font-bold text-[#6B3E2E] mb-3">💡 Money-Saving Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {season === 'peak' || season === 'high' ? (
                        <li>• Consider a <strong>Friday or Sunday</strong> wedding to save 10–15% on venue fees</li>
                      ) : null}
                      {region === 'napa' ? (
                        <li>• <strong>Sonoma County</strong> offers similar beauty at 15–20% lower venue costs</li>
                      ) : null}
                      <li>• Many wineries offer <strong>all-inclusive packages</strong> that bundle venue + wine + catering — ask for pricing</li>
                      <li>• <strong>Estate wines</strong> served directly from the winery often cost 30–40% less than sourcing externally</li>
                      <li>• A <strong>brunch or lunch</strong> reception can reduce catering costs by 20–30% vs. dinner</li>
                      {guestCount > 120 ? (
                        <li>• Large guest lists drive costs fast — consider a <strong>cocktail-style reception</strong> to reduce per-seat costs</li>
                      ) : null}
                      <li>• <strong>Off-peak months</strong> (Jan–Mar) can cut total costs by 20–30% — vineyards are still beautiful</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Region Comparison Table */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4 text-center">
            California Wine Region Cost Comparison
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Estimated all-in budget for a 100-guest Saturday summer wedding across California wine regions.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border-2 border-[#8B5A3C] overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#6B3E2E] text-white">
                  <th className="text-left py-4 px-5 font-semibold">Region</th>
                  <th className="text-left py-4 px-5 font-semibold">Venue Fee</th>
                  <th className="text-left py-4 px-5 font-semibold">Catering (per guest)</th>
                  <th className="text-left py-4 px-5 font-semibold">Total Est. Budget</th>
                  <th className="text-left py-4 px-5 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { region: 'Napa Valley', venue: '$8,000–$20,000+', catering: '$150–$275', total: '$65,000–$150,000+', best: 'Luxury, prestige, bucket-list weddings' },
                  { region: 'Sonoma County', venue: '$6,000–$15,000', catering: '$120–$220', total: '$50,000–$120,000', best: 'Upscale with more venue options' },
                  { region: 'Santa Barbara', venue: '$5,500–$14,000', catering: '$110–$200', total: '$45,000–$110,000', best: 'Coastal charm + wine country elegance' },
                  { region: 'Santa Cruz Mtns', venue: '$4,500–$11,000', catering: '$100–$185', total: '$38,000–$95,000', best: 'Boutique, intimate estate feel' },
                  { region: 'Livermore Valley', venue: '$4,000–$10,000', catering: '$95–$170', total: '$35,000–$88,000', best: 'Bay Area couples seeking value' },
                  { region: 'Paso Robles', venue: '$3,500–$9,000', catering: '$85–$155', total: '$30,000–$80,000', best: 'Stunning scenery, excellent value' },
                  { region: 'Temecula Valley', venue: '$3,000–$8,000', catering: '$80–$145', total: '$28,000–$75,000', best: 'Southern CA couples, LA weddings' },
                  { region: 'Lodi / Central Valley', venue: '$2,500–$6,500', catering: '$70–$130', total: '$22,000–$62,000', best: 'Most budget-friendly wine country option' },
                ].map((row, i) => (
                  <tr key={row.region} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]'}>
                    <td className="py-3 px-5 font-semibold text-[#6B3E2E]">{row.region}</td>
                    <td className="py-3 px-5 text-gray-700">{row.venue}</td>
                    <td className="py-3 px-5 text-gray-700">{row.catering}</td>
                    <td className="py-3 px-5 font-semibold text-gray-900">{row.total}</td>
                    <td className="py-3 px-5 text-gray-600 text-xs">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Estimates reflect 2024–2025 market rates. Actual costs vary by venue, season, and specific services. Always request itemized quotes from venues.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: 'How much does a winery wedding cost in California?',
                a: 'A California winery wedding typically ranges from $22,000 (Lodi/Central Valley, smaller guest count) to $150,000+ (Napa Valley, 100+ guests, peak season). The average all-in budget for a 100-guest Saturday summer wedding at a mid-range winery is $50,000–$90,000. Napa Valley commands a significant premium — often 40–50% more than comparable venues in Paso Robles or Temecula.',
              },
              {
                q: 'What\'s typically included in a winery venue fee?',
                a: 'Winery venue fees usually include use of the property (ceremony and reception spaces), tables and chairs, parking, a bridal suite, and sometimes a coordinator. What\'s rarely included: catering, wine, florals, linens, audio/visual, and overtime fees. Always ask for a complete list of inclusions and exclusions before comparing venues.',
              },
              {
                q: 'Do wineries require you to use their wine?',
                a: 'Many wineries have a "wine clause" requiring you to purchase wine exclusively from them — which is actually a benefit since estate wine is often more affordable and better quality than outside sourcing. Some venues charge a "corking fee" if you bring outside wine. Ask each venue about their beverage policy early in the conversation.',
              },
              {
                q: 'How far in advance should I book a winery wedding venue?',
                a: 'For peak season (Sept–Oct, harvest) and high-demand regions like Napa, book 18–24 months in advance. For shoulder seasons (spring, early winter) or less competitive regions like Paso Robles or Temecula, 12 months is often sufficient. Popular Saturday dates in Sonoma County can book 15–18 months out.',
              },
              {
                q: 'What are common hidden costs at winery weddings?',
                a: 'Watch out for: corking fees ($15–$35/bottle for outside wine), overtime charges ($250–$500/hour past curfew), mandatory gratuity on catering (18–22%), ceremony rehearsal fees, vendor meal requirements, parking/valet costs, tent rental for weather backup ($2,000–$8,000), and power/generator fees for outdoor setups. Always request a complete fee schedule.',
              },
              {
                q: 'Is it cheaper to get married at a winery on a Sunday or weekday?',
                a: 'Yes — significantly. Sunday weddings typically run 10–15% less than Saturday. Friday weddings can save 15–25%. Weekday (Mon–Thu) weddings offer the largest discounts — often 25–35% off Saturday pricing — though guest attendance is typically lower. Many couples choose Sunday to save money while maintaining a full "weekend" feel for out-of-town guests.',
              },
              {
                q: 'How much wine do I need for my winery wedding?',
                a: 'A general rule is 1 bottle per 2–3 guests for a reception (or about 1 glass per person per hour). For a 4-hour reception with 100 guests and moderate drinkers, plan for 60–80 bottles. Use our Wine Calculator for a precise breakdown by red, white, and sparkling.',
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-[#D4A96B] pb-8">
                <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">{item.q}</h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Ask Venues */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4 text-center">
            25 Questions to Ask Every Winery Venue
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Use this checklist when touring venues to uncover hidden costs and compare apples to apples.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Venue & Exclusivity', [
                'Is the venue exclusively ours for the day?',
                'What are the setup and breakdown time windows?',
                'Is there a separate rehearsal fee or time?',
                'What is the maximum capacity (seated dinner)?',
                'What is the rain/weather backup plan?',
              ]],
              ['Beverages & Wine', [
                'Are we required to purchase wine from you?',
                'What is your corking fee if we bring outside wine?',
                'What wine selections are available for events?',
                'Do you offer bulk/event pricing on cases?',
                'Is there a minimum wine purchase requirement?',
              ]],
              ['Catering & Service', [
                'Do you have a preferred catering list or exclusivity?',
                'Is gratuity included in catering quotes?',
                'Are vendor meals required and at what cost?',
                'Is there a kitchen or prep area for caterers?',
                'What tables, chairs, and linens are included?',
              ]],
              ['Costs & Logistics', [
                'What is the overtime rate past curfew?',
                'Are there noise restrictions or sound ordinances?',
                'What is the parking situation for guests?',
                'Are there any security or insurance requirements?',
                'What deposits are required and when?',
                'What is the cancellation/refund policy?',
                'Are there generator or power fees for DJs/bands?',
                'Is there a venue coordinator included?',
                'What vendors have worked here and can you recommend?',
                'Are there any dates already blocked around ours?',
              ]],
            ].map(([category, questions]) => (
              <div key={category as string} className="bg-white rounded-lg p-6 border border-[#D4A96B]">
                <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-4">{category as string}</h3>
                <ul className="space-y-2">
                  {(questions as string[]).map((q) => (
                    <li key={q} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#8B5A3C] mt-0.5 flex-shrink-0">□</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">
            Ready to Find Your Venue?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Browse 435+ verified California winery and vineyard venues with real pricing, reviews, and capacity information. Filter by region, guest count, and style to find venues that match your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Browse All Winery Venues →
            </Link>
            <Link
              href="/tools/wine-calculator"
              className="inline-block bg-white hover:bg-gray-50 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg border-2 border-[#6B3E2E] transition"
            >
              🍇 Wine Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
