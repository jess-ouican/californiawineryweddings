'use client';

import { useState, useCallback } from 'react';

interface Results {
  corkageTotal: number;
  buyoutTotal: number;
  bottlesNeeded: number;
  savings: number;
  winner: 'corkage' | 'buyout' | 'tie';
  corkageBreakdown: {
    wineBottleCost: number;
    corkageFees: number;
    total: number;
    perPersonCost: number;
  };
  buyoutBreakdown: {
    packageCost: number;
    total: number;
    perPersonCost: number;
  };
  recommendation: string;
}

const WINE_HOURS: Record<string, number> = {
  '3': 0.5,
  '4': 0.625,
  '5': 0.75,
  '6': 0.875,
  '7': 1.0,
  '8': 1.125,
};

export default function CorkageCalculator() {
  const [guestCount, setGuestCount] = useState<string>('100');
  const [eventHours, setEventHours] = useState<string>('6');
  const [corkageFeePerBottle, setCorkageFeePerBottle] = useState<string>('15');
  const [yourWineBottlePrice, setYourWineBottlePrice] = useState<string>('18');
  const [venueWinePricePerPerson, setVenueWinePricePerPerson] = useState<string>('45');
  const [drinkersPercent, setDrinkersPercent] = useState<string>('75');
  const [winePreference, setWinePreference] = useState<string>('50');
  const [results, setResults] = useState<Results | null>(null);
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    const guests = parseInt(guestCount) || 0;
    const hours = parseInt(eventHours) || 6;
    const corkageFee = parseFloat(corkageFeePerBottle) || 0;
    const yourBottlePrice = parseFloat(yourWineBottlePrice) || 0;
    const venuePricePerPerson = parseFloat(venueWinePricePerPerson) || 0;
    const drinkingGuests = Math.round(guests * (parseInt(drinkersPercent) / 100));
    const winePercent = parseInt(winePreference) / 100;

    // Standard: 1 glass per person per hour, 5 glasses per bottle
    const hoursMultiplier = WINE_HOURS[String(hours)] || 0.875;
    const glassesPerPerson = hours * hoursMultiplier;
    const wineGlassesNeeded = drinkingGuests * glassesPerPerson * winePercent;
    const bottlesNeeded = Math.ceil(wineGlassesNeeded / 5);

    // Corkage path: cost of your wine + corkage fees
    const wineBottleCost = bottlesNeeded * yourBottlePrice;
    const corkageFees = bottlesNeeded * corkageFee;
    const corkageTotal = wineBottleCost + corkageFees;

    // Buyout path: venue wine package
    const buyoutTotal = guests * venuePricePerPerson;

    const savings = Math.abs(corkageTotal - buyoutTotal);
    const winner = corkageTotal < buyoutTotal ? 'corkage' : corkageTotal > buyoutTotal ? 'buyout' : 'tie';

    let recommendation = '';
    if (winner === 'corkage') {
      recommendation = `Bringing your own wine saves you $${savings.toLocaleString()}. Make sure your venue allows outside wine and confirm the corkage fee in writing. Budget for a wine shop bulk discount — many retailers offer 10–20% off case purchases.`;
    } else if (winner === 'buyout') {
      recommendation = `The venue wine package saves you $${savings.toLocaleString()} and eliminates the hassle of sourcing, transporting, and managing your own wine. This is often the lower-stress choice for larger weddings.`;
    } else {
      recommendation = `Both options cost about the same. Consider convenience: the venue package includes service and you don't have to source wine. Bring-your-own gives you full control over the labels.`;
    }

    setResults({
      corkageTotal,
      buyoutTotal,
      bottlesNeeded,
      savings,
      winner,
      corkageBreakdown: {
        wineBottleCost,
        corkageFees,
        total: corkageTotal,
        perPersonCost: Math.round(corkageTotal / guests),
      },
      buyoutBreakdown: {
        packageCost: buyoutTotal,
        total: buyoutTotal,
        perPersonCost: Math.round(buyoutTotal / guests),
      },
      recommendation,
    });
  }, [guestCount, eventHours, corkageFeePerBottle, yourWineBottlePrice, venueWinePricePerPerson, drinkersPercent, winePreference]);

  const handleCopy = () => {
    if (!results) return;
    const text = `Corkage vs. Wine Buyout Comparison
Guests: ${guestCount} | Event: ${eventHours} hours | Bottles needed: ${results.bottlesNeeded}

Bring Your Own Wine + Corkage: $${results.corkageTotal.toLocaleString()} ($${results.corkageBreakdown.perPersonCost}/person)
  - Wine bottles: $${results.corkageBreakdown.wineBottleCost.toLocaleString()}
  - Corkage fees: $${results.corkageBreakdown.corkageFees.toLocaleString()}

Venue Wine Package: $${results.buyoutTotal.toLocaleString()} ($${results.buyoutBreakdown.perPersonCost}/person)

Winner: ${results.winner === 'corkage' ? '🍷 Bring Your Own (saves $' + results.savings.toLocaleString() + ')' : results.winner === 'buyout' ? '🏛️ Venue Package (saves $' + results.savings.toLocaleString() + ')' : "It's a tie!"}

Recommendation: ${results.recommendation}

Calculated at californiawineryweddings.com/tools/corkage-calculator`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { max-width: 100% !important; }
          body { background: white; }
        }
      `}</style>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-stone-900 text-white py-12 px-4 no-print">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">🍾</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Corkage Fee Calculator</h1>
          <p className="text-lg text-purple-200 max-w-xl mx-auto">
            Should you bring your own wine and pay the corkage fee — or buy the venue&apos;s wine package?
            Get the exact dollar comparison in under 2 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 print-full">

        {/* Print header (hidden on screen) */}
        <div className="hidden print:block mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-purple-900">Corkage vs. Wine Buyout Comparison</h1>
          <p className="text-gray-500 text-sm mt-1">californiawineryweddings.com/tools/corkage-calculator</p>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold text-stone-800 mb-5">Your Wedding Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Guest Count
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Event Hours */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Event Length (hours)
              </label>
              <select
                value={eventHours}
                onChange={(e) => setEventHours(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6 hours (typical)</option>
                <option value="7">7 hours</option>
                <option value="8">8 hours</option>
              </select>
            </div>

            {/* % Drinkers */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Guests Who Drink Alcohol
              </label>
              <select
                value={drinkersPercent}
                onChange={(e) => setDrinkersPercent(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="60">60% — Many non-drinkers</option>
                <option value="70">70% — Some non-drinkers</option>
                <option value="75">75% — Average crowd</option>
                <option value="85">85% — Mostly drinkers</option>
                <option value="95">95% — Wine-lover crowd</option>
              </select>
            </div>

            {/* Wine preference */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Drinkers Who Prefer Wine
              </label>
              <select
                value={winePreference}
                onChange={(e) => setWinePreference(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="40">40% — Big beer/spirits crowd</option>
                <option value="50">50% — Mixed crowd</option>
                <option value="65">65% — Wine-leaning</option>
                <option value="80">80% — Mostly wine drinkers</option>
                <option value="100">100% — Wine only (no bar)</option>
              </select>
            </div>
          </div>

          <div className="mt-5 border-t border-stone-100 pt-5">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Cost Inputs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* Corkage fee per bottle */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Corkage Fee / Bottle
                  <span className="text-stone-400 text-xs ml-1">(venue charge)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400">$</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={corkageFeePerBottle}
                    onChange={(e) => setCorkageFeePerBottle(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg pl-7 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-stone-400 mt-1">CA avg: $15–$25/bottle</p>
              </div>

              {/* Your bottle price */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Your Wine Cost / Bottle
                  <span className="text-stone-400 text-xs ml-1">(retail)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400">$</span>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={yourWineBottlePrice}
                    onChange={(e) => setYourWineBottlePrice(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg pl-7 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-stone-400 mt-1">Retail price you pay</p>
              </div>

              {/* Venue package price */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Venue Wine Package
                  <span className="text-stone-400 text-xs ml-1">(per person)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400">$</span>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={venueWinePricePerPerson}
                    onChange={(e) => setVenueWinePricePerPerson(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg pl-7 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-stone-400 mt-1">CA avg: $35–$65/person</p>
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
          >
            Calculate My Savings →
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-stone-800">Your Results</h2>
              <div className="flex gap-2 no-print">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm border border-stone-300 hover:border-purple-400 text-stone-600 hover:text-purple-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy Results'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-sm border border-stone-300 hover:border-purple-400 text-stone-600 hover:text-purple-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  🖨️ Print
                </button>
              </div>
            </div>

            {/* Winner Banner */}
            <div className={`rounded-xl p-4 mb-5 text-center ${
              results.winner === 'corkage'
                ? 'bg-green-50 border border-green-200'
                : results.winner === 'buyout'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-stone-50 border border-stone-200'
            }`}>
              {results.winner === 'corkage' && (
                <>
                  <div className="text-2xl font-bold text-green-700">🍷 Bring Your Own Wine Wins</div>
                  <div className="text-green-600 mt-1">You save <span className="font-bold">${results.savings.toLocaleString()}</span> vs. the venue package</div>
                </>
              )}
              {results.winner === 'buyout' && (
                <>
                  <div className="text-2xl font-bold text-blue-700">🏛️ Venue Wine Package Wins</div>
                  <div className="text-blue-600 mt-1">You save <span className="font-bold">${results.savings.toLocaleString()}</span> vs. bringing your own</div>
                </>
              )}
              {results.winner === 'tie' && (
                <>
                  <div className="text-2xl font-bold text-stone-700">⚖️ It&apos;s Basically a Tie</div>
                  <div className="text-stone-600 mt-1">Both options cost about the same — choose on convenience</div>
                </>
              )}
            </div>

            {/* Side-by-side breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

              {/* Corkage Option */}
              <div className={`rounded-xl border p-4 ${results.winner === 'corkage' ? 'border-green-300 bg-green-50' : 'border-stone-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🍷</span>
                  <h3 className="font-semibold text-stone-800">Bring Your Own Wine</h3>
                  {results.winner === 'corkage' && <span className="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Best Value</span>}
                </div>
                <div className="text-3xl font-bold text-stone-900 mb-1">${results.corkageTotal.toLocaleString()}</div>
                <div className="text-sm text-stone-500 mb-3">${results.corkageBreakdown.perPersonCost}/person · {results.bottlesNeeded} bottles</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Wine bottles ({results.bottlesNeeded}×${yourWineBottlePrice})</span>
                    <span className="font-medium">${results.corkageBreakdown.wineBottleCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Corkage fees ({results.bottlesNeeded}×${corkageFeePerBottle})</span>
                    <span className="font-medium">${results.corkageBreakdown.corkageFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-1.5 font-semibold">
                    <span>Total</span>
                    <span>${results.corkageBreakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Buyout Option */}
              <div className={`rounded-xl border p-4 ${results.winner === 'buyout' ? 'border-blue-300 bg-blue-50' : 'border-stone-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏛️</span>
                  <h3 className="font-semibold text-stone-800">Venue Wine Package</h3>
                  {results.winner === 'buyout' && <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Best Value</span>}
                </div>
                <div className="text-3xl font-bold text-stone-900 mb-1">${results.buyoutTotal.toLocaleString()}</div>
                <div className="text-sm text-stone-500 mb-3">${results.buyoutBreakdown.perPersonCost}/person · all-inclusive</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">{guestCount} guests × ${venueWinePricePerPerson}/person</span>
                    <span className="font-medium">${results.buyoutBreakdown.packageCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-1.5 font-semibold">
                    <span>Total</span>
                    <span>${results.buyoutBreakdown.total.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mt-2">Includes service, no sourcing or transport needed</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-amber-800 mb-1">💡 Recommendation</div>
              <p className="text-sm text-amber-900">{results.recommendation}</p>
            </div>

            {/* Pro tips */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600">
                <div className="font-semibold text-stone-700 mb-1">📋 Ask your venue:</div>
                <ul className="space-y-0.5">
                  <li>• Is there a corkage fee cap per event?</li>
                  <li>• Can you waive the corkage if I buy X cases?</li>
                  <li>• Are there approved wine lists?</li>
                  <li>• Is there a bottle minimum for their package?</li>
                </ul>
              </div>
              <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600">
                <div className="font-semibold text-stone-700 mb-1">💰 Money-saving tips:</div>
                <ul className="space-y-0.5">
                  <li>• Buy by the case for 10–20% off</li>
                  <li>• Costco wine is excellent value</li>
                  <li>• Check Total Wine for wedding bulk discounts</li>
                  <li>• Some CA wineries offer discounts for local weddings</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-10 prose prose-stone max-w-none">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">What Is a Corkage Fee at a Winery Wedding?</h2>
          <p className="text-stone-600 mb-4">
            A corkage fee is a per-bottle charge that a winery or venue charges when you bring outside wine instead of purchasing from their cellar. At California winery weddings, corkage fees typically range from <strong>$10 to $35 per bottle</strong>, though some premium venues charge $50 or more.
          </p>
          <p className="text-stone-600 mb-6">
            The decision isn&apos;t just about price — it&apos;s about control, convenience, and how the math shakes out for your specific guest count, event length, and wine preferences.
          </p>

          <h2 className="text-2xl font-bold text-stone-800 mb-4">Corkage Fee vs. Wine Buyout: What&apos;s the Difference?</h2>
          <p className="text-stone-600 mb-3">
            Most California winery venues offer two wine options:
          </p>
          <ul className="text-stone-600 mb-6 space-y-2">
            <li><strong>Bring your own (BYO) + corkage:</strong> You purchase wine at retail and pay a per-bottle fee for the venue to open and serve it. You control the labels, but you handle sourcing, delivery, and storage logistics.</li>
            <li><strong>Venue wine package:</strong> The winery provides wine from their cellar at a flat per-person rate (or per-bottle price). No sourcing hassle, but you pay their margin.</li>
          </ul>

          <h2 className="text-2xl font-bold text-stone-800 mb-4">When Does Corkage Fee Make Sense?</h2>
          <p className="text-stone-600 mb-3">
            Bringing your own wine + paying corkage is usually worth it when:
          </p>
          <ul className="text-stone-600 mb-6 space-y-1">
            <li>• The venue wine package is priced at $50+/person</li>
            <li>• You can source quality wine for under $15/bottle</li>
            <li>• The corkage fee is under $20/bottle</li>
            <li>• Your guest count is 75 or fewer (fewer bottles = manageable logistics)</li>
            <li>• You have a specific wine you want to feature (your favorite producer, estate wine, etc.)</li>
          </ul>

          <h2 className="text-2xl font-bold text-stone-800 mb-4">California Winery Corkage Fee Averages by Region</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-left p-3 border border-stone-200 font-semibold">Region</th>
                  <th className="text-left p-3 border border-stone-200 font-semibold">Typical Corkage Fee</th>
                  <th className="text-left p-3 border border-stone-200 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-stone-200">Napa Valley</td>
                  <td className="p-3 border border-stone-200">$25–$50/bottle</td>
                  <td className="p-3 border border-stone-200">Highest in California; premium venues often require wine buyout</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3 border border-stone-200">Sonoma County</td>
                  <td className="p-3 border border-stone-200">$15–$30/bottle</td>
                  <td className="p-3 border border-stone-200">More flexible; many venues allow BYO from any CA winery</td>
                </tr>
                <tr>
                  <td className="p-3 border border-stone-200">Paso Robles</td>
                  <td className="p-3 border border-stone-200">$10–$20/bottle</td>
                  <td className="p-3 border border-stone-200">One of the most BYO-friendly regions in CA</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3 border border-stone-200">Temecula Valley</td>
                  <td className="p-3 border border-stone-200">$12–$25/bottle</td>
                  <td className="p-3 border border-stone-200">Most venues require you buy from on-site winery</td>
                </tr>
                <tr>
                  <td className="p-3 border border-stone-200">Santa Barbara County</td>
                  <td className="p-3 border border-stone-200">$15–$35/bottle</td>
                  <td className="p-3 border border-stone-200">Policy varies widely; always confirm in contract</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-stone-800 mb-4">How Many Bottles Do You Need for a Wedding?</h2>
          <p className="text-stone-600 mb-3">
            The standard rule of thumb: <strong>one bottle of wine per person for the first two hours, then half a bottle per person per additional hour</strong>. A standard bottle has 5 glasses, so for a 100-person wedding over 6 hours where 75% drink and 65% prefer wine:
          </p>
          <ul className="text-stone-600 mb-6 space-y-1">
            <li>• 100 guests × 75% drinkers = 75 wine drinkers</li>
            <li>• 75 × 65% prefer wine = ~49 wine drinkers</li>
            <li>• 6 hours × ~0.875 glasses/hour = ~5.25 glasses/person</li>
            <li>• 49 × 5.25 = ~257 glasses ÷ 5 = <strong>~52 bottles needed</strong></li>
          </ul>
          <p className="text-stone-600 mb-6">
            Always add a 10–15% buffer for generous pours and spillage. Buy by the case (12 bottles) for the best pricing — most wine retailers offer 10–20% off case purchases.
          </p>

          <h2 className="text-2xl font-bold text-stone-800 mb-4">Questions to Ask Your Winery Venue About Corkage</h2>
          <ul className="text-stone-600 mb-6 space-y-2">
            <li><strong>Is there a corkage fee cap?</strong> Some venues cap total corkage at a flat dollar amount regardless of bottle count.</li>
            <li><strong>Can corkage be waived?</strong> Many wineries will waive or reduce the corkage fee if you purchase a minimum number of cases from their estate.</li>
            <li><strong>What wines are allowed?</strong> Some venues restrict BYO to California wines, or ban direct competitors.</li>
            <li><strong>Who handles service?</strong> Confirm whether the corkage fee includes staff to open and pour, or if that&apos;s extra.</li>
            <li><strong>What about leftover bottles?</strong> Understand the policy on guests taking home unfinished bottles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
