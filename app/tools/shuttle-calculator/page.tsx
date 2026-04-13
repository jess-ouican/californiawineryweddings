'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShuttleBreakdown {
  sedans: number;
  vans15: number;
  minibuses: number;
  coaches: number;
  estimatedTrips: number;
  costLow: number;
  costHigh: number;
}

export default function ShuttleCalculator() {
  const [totalGuests, setTotalGuests] = useState(100);
  const [needsTransport, setNeedsTransport] = useState(50);
  const [pickupLocations, setPickupLocations] = useState(1);
  const [roundTrip, setRoundTrip] = useState(true);
  const [result, setResult] = useState<ShuttleBreakdown | null>(null);

  // Vehicle capacities
  const capacities = {
    sedans: 4,
    vans15: 15,
    minibuses: 28,
    coaches: 56,
  };

  // CA wine country rates (per hour)
  const rates = {
    sedans: 150,
    vans15: 200,
    minibuses: 250,
    coaches: 350,
  };

  const calculate = () => {
    const needingTransport = Math.ceil(totalGuests * (needsTransport / 100));

    // Calculate vehicle mix - prefer larger vehicles for efficiency
    let sedans = 0;
    let vans15 = 0;
    let minibuses = 0;
    let coaches = 0;
    let remaining = needingTransport;

    // Start with largest vehicles
    coaches = Math.floor(remaining / capacities.coaches);
    remaining -= coaches * capacities.coaches;

    minibuses = Math.floor(remaining / capacities.minibuses);
    remaining -= minibuses * capacities.minibuses;

    vans15 = Math.floor(remaining / capacities.vans15);
    remaining -= vans15 * capacities.vans15;

    sedans = Math.ceil(remaining / capacities.sedans);

    // Estimate trips (assume 1-2 trips per vehicle based on timing)
    const vehicleCount = sedans + vans15 + minibuses + coaches;
    let estimatedTrips = 1;

    if (pickupLocations > 1) {
      estimatedTrips = Math.min(2, pickupLocations);
    }

    if (roundTrip) {
      estimatedTrips *= 2;
    }

    // Calculate costs - estimate 3 hours per trip (pickup + dropoff + travel)
    const hoursPerTrip = 3;
    const seoanCost = sedans > 0 ? sedans * rates.sedans * hoursPerTrip * estimatedTrips : 0;
    const van15Cost = vans15 > 0 ? vans15 * rates.vans15 * hoursPerTrip * estimatedTrips : 0;
    const minibusCost = minibuses > 0 ? minibuses * rates.minibuses * hoursPerTrip * estimatedTrips : 0;
    const coachCost = coaches > 0 ? coaches * rates.coaches * hoursPerTrip * estimatedTrips : 0;

    // Add 20% buffer for variations
    const totalCost = seoanCost + van15Cost + minibusCost + coachCost;
    const costLow = Math.round(totalCost);
    const costHigh = Math.round(totalCost * 1.2);

    setResult({
      sedans,
      vans15,
      minibuses,
      coaches,
      estimatedTrips,
      costLow,
      costHigh,
    });
  };

  // Auto-calculate
  useEffect(() => {
    calculate();
  }, [totalGuests, needsTransport, pickupLocations, roundTrip]);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            🚐 Shuttle Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Plan guest transportation with recommended vehicle mix and cost estimates for California wine country.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border-2 border-[#8B5A3C] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Your Transportation Needs</h2>

                {/* Total Guests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Wedding Guests: <span className="text-[#8B5A3C]">{totalGuests}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={totalGuests}
                    onChange={(e) => setTotalGuests(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B3E2E]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Needing Transport */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guests Needing Transportation: <span className="text-[#8B5A3C]">{needsTransport}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={needsTransport}
                    onChange={(e) => setNeedsTransport(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B3E2E]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    ~{Math.ceil(totalGuests * (needsTransport / 100))} guests
                  </p>
                </div>

                {/* Pickup Locations */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Pickup Locations
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPickupLocations(num)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                          pickupLocations === num
                            ? 'bg-[#6B3E2E] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num === 1 ? 'Hotel' : `${num} Locations`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {pickupLocations === 1 && 'Single pickup (most common)'}
                    {pickupLocations > 1 && `Multiple pickups from ${pickupLocations} locations`}
                  </p>
                </div>

                {/* Round Trip Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="w-5 h-5 rounded accent-[#6B3E2E]"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Round Trip (includes return transport)
                    </span>
                  </label>
                  <p className="text-xs text-gray-600 mt-2">
                    {roundTrip
                      ? 'Vehicles will return guests at end of night'
                      : 'One-way transport only'}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Your Fleet Recommendation</h2>

                {result && (
                  <>
                    {/* Vehicle Breakdown */}
                    <div className="bg-[#F5E6D3] p-6 rounded-lg space-y-3">
                      <h3 className="font-semibold text-gray-800">Recommended Vehicles</h3>

                      {result.coaches > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-blue-600">
                          <div>
                            <p className="font-semibold text-gray-800">Coach Bus</p>
                            <p className="text-xs text-gray-600">Seats: 56</p>
                          </div>
                          <p className="text-2xl font-bold text-[#6B3E2E]">{result.coaches}</p>
                        </div>
                      )}

                      {result.minibuses > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-green-600">
                          <div>
                            <p className="font-semibold text-gray-800">Minibus</p>
                            <p className="text-xs text-gray-600">Seats: 28</p>
                          </div>
                          <p className="text-2xl font-bold text-[#6B3E2E]">{result.minibuses}</p>
                        </div>
                      )}

                      {result.vans15 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-purple-600">
                          <div>
                            <p className="font-semibold text-gray-800">15-Passenger Van</p>
                            <p className="text-xs text-gray-600">Seats: 15</p>
                          </div>
                          <p className="text-2xl font-bold text-[#6B3E2E]">{result.vans15}</p>
                        </div>
                      )}

                      {result.sedans > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-amber-600">
                          <div>
                            <p className="font-semibold text-gray-800">Luxury Sedan</p>
                            <p className="text-xs text-gray-600">Seats: 4</p>
                          </div>
                          <p className="text-2xl font-bold text-[#6B3E2E]">{result.sedans}</p>
                        </div>
                      )}
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-white border-2 border-[#8B5A3C] p-6 rounded-lg space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Trips</p>
                        <p className="text-3xl font-bold text-[#6B3E2E]">{result.estimatedTrips}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {roundTrip ? 'Round-trip' : 'One-way'}
                          {pickupLocations > 1 && ` (${pickupLocations} locations)`}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Estimated Cost Range</p>
                        <p className="text-3xl font-bold text-[#6B3E2E]">
                          ${result.costLow.toLocaleString()} - ${result.costHigh.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on CA wine country rates ($150-350/hour)
                        </p>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-sm text-amber-900">
                        <span className="font-semibold">💡 Pro Tip:</span> Most Temecula, Napa, and Sonoma
                        wineries can recommend preferred transportation vendors. Ask your venue for their preferred
                        partners — they often have negotiated rates.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-8">Transportation Planning Tips</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-3">🚗 Pick the Right Vehicle Mix</h3>
              <p className="text-gray-700 mb-3">
                Larger vehicles (coaches, minibuses) are more cost-effective for moving many guests. Reserve sedans for VIPs
                or smaller arrivals. This calculator prioritizes efficiency.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-3">⏰ Timing is Everything</h3>
              <p className="text-gray-700 mb-3">
                Wine country is spread out. Plan 30-45 minutes between pickups and the venue. Factor in extra time for
                pre-reception drinks and bathroom breaks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-3">💰 Ask About Vendor Discounts</h3>
              <p className="text-gray-700 mb-3">
                Transportation companies in wine country often offer package deals for weddings. Your venue should have
                relationships with several vendors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-3">🍷 Designated Driver Incentives</h3>
              <p className="text-gray-700">
                Consider offering non-drivers a dedicated beverage service or special amenity to encourage safe choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">Ready to Plan Your Wedding?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse 435+ California wineries that host weddings. Most can recommend trusted transportation partners.
          </p>
          <Link
            href="/directory"
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Browse Wineries →
          </Link>
        </div>
      </section>
    </div>
  );
}
