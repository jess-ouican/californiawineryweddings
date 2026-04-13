'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CalculationResult {
  redBottles: number;
  whiteBottles: number;
  sparklingBottles: number;
  totalBottles: number;
  casesNeeded: number;
  costLowEstimate: number;
  costHighEstimate: number;
}

export default function WineCalculator() {
  const [guests, setGuests] = useState(75);
  const [duration, setDuration] = useState(4);
  const [drinkingLevel, setDrinkingLevel] = useState('moderate');
  const [redPercent, setRedPercent] = useState(40);
  const [whitePercent, setWhitePercent] = useState(40);
  const [sparklingPercent, setSparklingPercent] = useState(20);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Drinking rates (glasses per person per hour)
  const drinkingRates = {
    light: 0.5,
    moderate: 1.0,
    heavy: 1.5,
  };

  const calculate = () => {
    const rate = drinkingRates[drinkingLevel as keyof typeof drinkingRates];
    const totalGlasses = guests * duration * rate;
    const bottlesPerCase = 12;
    const glassesPerBottle = 5; // Standard pour

    const totalBottles = Math.ceil(totalGlasses / glassesPerBottle);
    const redBottles = Math.ceil(totalBottles * (redPercent / 100));
    const whiteBottles = Math.ceil(totalBottles * (whitePercent / 100));
    const sparklingBottles = Math.ceil(totalBottles * (sparklingPercent / 100));
    
    const casesNeeded = Math.ceil(totalBottles / bottlesPerCase);
    const costLowEstimate = totalBottles * 15;
    const costHighEstimate = totalBottles * 25;

    setResult({
      redBottles,
      whiteBottles,
      sparklingBottles,
      totalBottles,
      casesNeeded,
      costLowEstimate,
      costHighEstimate,
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculate();
  }, [guests, duration, drinkingLevel, redPercent, whitePercent, sparklingPercent]);

  /**
   * Auto-distribute sliders to always total 100%.
   * When one slider changes, the other two are adjusted proportionally.
   */
  const handleWineMixChange = (changedType: 'red' | 'white' | 'sparkling', newValue: number) => {
    // Clamp the value between 0 and 100
    newValue = Math.max(0, Math.min(100, newValue));

    // Get the current percentages
    const current = {
      red: redPercent,
      white: whitePercent,
      sparkling: sparklingPercent,
    };

    // Update the changed slider
    current[changedType] = newValue;

    // Calculate how much the other two sliders need to share
    const remainingPercent = 100 - newValue;

    // Get the two unchanged sliders and their current values
    const otherTypes = (['red', 'white', 'sparkling'] as const).filter((t) => t !== changedType);
    const currentOthersTotal = otherTypes.reduce((sum, t) => sum + current[t], 0);

    // Redistribute the remaining percentage proportionally based on current values
    let newRed = changedType === 'red' ? newValue : current.red;
    let newWhite = changedType === 'white' ? newValue : current.white;
    let newSparkling = changedType === 'sparkling' ? newValue : current.sparkling;

    if (currentOthersTotal === 0) {
      // If both others are zero, split remaining equally
      const eachOther = Math.round(remainingPercent / 2);
      otherTypes.forEach((t) => {
        current[t] = eachOther;
      });
      newRed = current.red;
      newWhite = current.white;
      newSparkling = current.sparkling;
    } else {
      // Distribute proportionally
      const ratio = remainingPercent / currentOthersTotal;
      otherTypes.forEach((t) => {
        current[t] = Math.round(current[t] * ratio);
      });
      newRed = current.red;
      newWhite = current.white;
      newSparkling = current.sparkling;
    }

    // Fix any rounding errors to ensure total is exactly 100%
    const total = newRed + newWhite + newSparkling;
    const diff = 100 - total;

    if (diff !== 0) {
      if (changedType === 'red') {
        newWhite += diff;
      } else if (changedType === 'white') {
        newSparkling += diff;
      } else {
        newRed += diff;
      }
    }

    // Ensure all values are non-negative
    newRed = Math.max(0, newRed);
    newWhite = Math.max(0, newWhite);
    newSparkling = Math.max(0, newSparkling);

    setRedPercent(newRed);
    setWhitePercent(newWhite);
    setSparklingPercent(newSparkling);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            🍇 Wine Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Determine exact wine quantities, bottle counts, and cost estimates for your wedding reception.
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
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Your Event Details</h2>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests: <span className="text-[#8B5A3C]">{guests}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B3E2E]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Duration (hours): <span className="text-[#8B5A3C]">{duration}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B3E2E]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2 hrs</span>
                    <span>8 hrs</span>
                  </div>
                </div>

                {/* Drinking Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Guest Drinking Level
                  </label>
                  <div className="flex gap-3">
                    {(['light', 'moderate', 'heavy'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDrinkingLevel(level)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                          drinkingLevel === level
                            ? 'bg-[#6B3E2E] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {drinkingLevel === 'light' &&
                      'Conservative estimate: ~0.5 glasses per person per hour'}
                    {drinkingLevel === 'moderate' &&
                      'Standard estimate: ~1 glass per person per hour'}
                    {drinkingLevel === 'heavy' &&
                      'Generous estimate: ~1.5 glasses per person per hour'}
                  </p>
                </div>

                {/* Wine Mix */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Wine Mix
                  </label>
                  <div className="bg-green-50 border border-green-200 p-3 rounded mb-4">
                    <p className="text-sm font-semibold text-green-700">
                      Total: {redPercent + whitePercent + sparklingPercent}% ✓
                    </p>
                  </div>
                  <div className="space-y-4">
                    {/* Red */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Red</span>
                        <span className="text-sm font-bold text-[#6B3E2E]">{redPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={redPercent}
                        onChange={(e) => handleWineMixChange('red', Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B2E2E 0%, #8B2E2E ${redPercent}%, #e5e7eb ${redPercent}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>

                    {/* White */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">White</span>
                        <span className="text-sm font-bold text-[#6B3E2E]">{whitePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={whitePercent}
                        onChange={(e) => handleWineMixChange('white', Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${whitePercent}%, #e5e7eb ${whitePercent}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>

                    {/* Sparkling */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Sparkling</span>
                        <span className="text-sm font-bold text-[#6B3E2E]">{sparklingPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sparklingPercent}
                        onChange={(e) => handleWineMixChange('sparkling', Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${sparklingPercent}%, #e5e7eb ${sparklingPercent}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Your Wine Order</h2>

                {result && (
                  <>
                    {/* Visual Breakdown */}
                    <div className="bg-[#F5E6D3] p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">Bottle Breakdown</h3>
                      <div className="space-y-4">
                        {/* Red */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Red Wine</span>
                            <span className="font-bold text-[#6B3E2E]">{result.redBottles}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-700"
                              style={{
                                width: `${(result.redBottles / result.totalBottles) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* White */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">White Wine</span>
                            <span className="font-bold text-[#6B3E2E]">{result.whiteBottles}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500"
                              style={{
                                width: `${(result.whiteBottles / result.totalBottles) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Sparkling */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Sparkling Wine</span>
                            <span className="font-bold text-[#6B3E2E]">{result.sparklingBottles}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400"
                              style={{
                                width: `${(result.sparklingBottles / result.totalBottles) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-white border-2 border-[#8B5A3C] p-6 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Bottles Needed</p>
                          <p className="text-3xl font-bold text-[#6B3E2E]">{result.totalBottles}</p>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600">Cases to Order</p>
                          <p className="text-3xl font-bold text-[#6B3E2E]">{result.casesNeeded}</p>
                          <p className="text-xs text-gray-500 mt-1">(12 bottles per case)</p>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600">Estimated Cost Range</p>
                          <p className="text-3xl font-bold text-[#6B3E2E]">
                            ${result.costLowEstimate.toLocaleString()} - ${result.costHighEstimate.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ($15-25 per bottle average)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Tip */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-sm text-amber-900">
                        <span className="font-semibold">💡 Pro Tip:</span> Many of our listed wineries offer bulk
                        pricing for weddings — submit an inquiry to ask about wine packages and potential discounts.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">
                How many glasses per bottle?
              </h3>
              <p className="text-gray-700">
                A standard 750ml bottle yields about 5 glasses with typical 5oz pours. This calculator uses that standard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">
                What if not all guests drink wine?
              </h3>
              <p className="text-gray-700">
                Reduce the "guest count" or lower the "drinking level" to conservative to account for non-drinkers or light drinkers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">
                Should I order extra?
              </h3>
              <p className="text-gray-700">
                Yes — always order 10-20% extra to account for spillage, toasts, and extra glasses. Many venues handle returns easily.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">
                Where should I buy wine for my wedding?
              </h3>
              <p className="text-gray-700">
                Start by asking your venue about wine packages or preferred vendors. You can also source directly from{' '}
                <Link href="/directory" className="text-[#6B3E2E] hover:underline font-semibold">
                  California wineries listed here
                </Link>{' '}
                — many offer wedding discounts for bulk orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">Ready to Book Your Venue?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse 435+ verified California wineries and vineyards that host weddings. Many offer wine packages at bulk rates.
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
