import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Wedding Planning Tools | California Winery Weddings',
  description:
    'Free wedding planning tools for California winery weddings: budget estimator, wine calculator, wine pairing planner, shuttle calculator, wedding weather guide, wedding day timeline generator, and vendor tipping calculator.',
  keywords: [
    'winery wedding budget calculator',
    'vineyard wedding cost estimator',
    'wedding planning tools',
    'wine calculator',
    'wedding wine pairing',
    'wedding wine menu',
    'wine pairing guide wedding',
    'shuttle calculator',
    'wedding weather',
    'wedding day timeline generator',
    'winery wedding timeline',
    'California winery wedding cost',
    'how much does a winery wedding cost',
    'wedding wine pairing calculator',
    'what wine to serve at wedding',
    'wedding vendor tipping calculator',
    'how much to tip wedding vendors',
    'winery wedding tip guide',
    'winery wedding venue comparison',
    'wedding venue comparison tool',
    'compare wedding venues',
    'how to choose a wedding venue',
    'wine country wedding venue checklist',
    'winery wedding checklist',
    'vineyard wedding checklist',
    'winery wedding planning timeline',
    'how to plan a winery wedding',
    'wedding seating chart',
    'free wedding seating chart tool',
    'wedding seating planner',
    'wedding guest list tracker',
    'wedding RSVP tracker',
  ],
  openGraph: {
    title: 'Free Wedding Planning Tools',
    description: 'Plan your California winery wedding with our free tools.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools',
  },
};

export default function ToolsIndex() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#6B3E2E] mb-6 leading-tight">
            Free Wedding Planning Tools
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plan your perfect winery wedding with our suite of free calculators and guides. From wine quantities to guest transportation, we've got you covered.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Budget Estimator */}
            <Link href="/tools/budget-estimator">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-4">💰</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Budget Estimator
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Get an itemized budget estimate for your winery wedding — tailored to your region, guest count, season, and style. With real California wine country rates.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Estimate Budget →
                </div>
              </div>
            </Link>

            {/* Wine Calculator */}
            <Link href="/tools/wine-calculator">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-4">🍇</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Wine Calculator
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Calculate exact bottle quantities for your guest count, event duration, and preference mix. Get case recommendations and cost estimates.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Open Calculator →
                </div>
              </div>
            </Link>

            {/* Shuttle Calculator */}
            <Link href="/tools/shuttle-calculator">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-4">🚐</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Shuttle Calculator
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Plan guest transportation with recommendations for sedans, vans, and buses. Calculate trip counts and costs based on California wine country rates.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Open Calculator →
                </div>
              </div>
            </Link>

            {/* Weather Guide */}
            <Link href="/tools/wedding-weather">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-4">🌤️</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Wedding Weather Guide
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Explore month-by-month weather patterns for all 11 California wine regions. Plan your date around harvest, rainfall, and optimal conditions.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  View Guide →
                </div>
              </div>
            </Link>

            {/* Wine Pairing Planner — NEW */}
            <Link href="/tools/wine-pairing">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">🍷</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Wine Pairing Planner
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Build your complete wedding wine menu. Select each course and get expert California wine pairing recommendations — with varietals, regional picks, price ranges, and insider tips.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Plan Wine Menu →
                </div>
              </div>
            </Link>

            {/* Wedding Day Timeline */}
            <Link href="/tools/wedding-timeline">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">🕐</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Timeline Generator
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Build your winery wedding day schedule — optimized for golden hour portraits, noise ordinance cutoffs, harvest season, and CA wine country logistics.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Build Timeline →
                </div>
              </div>
            </Link>

            {/* Venue Comparison Scorecard — NEW */}
            <Link href="/tools/venue-comparison">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">🏛️</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Venue Comparison
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Compare up to 3 winery venues side by side. Score wine minimums, exclusivity, noise ordinances, catering flexibility, and more — with a shareable link for your partner.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Compare Venues →
                </div>
              </div>
            </Link>

            {/* Vendor Tipping Calculator — NEW */}
            <Link href="/tools/vendor-tipping">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">💌</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Vendor Tipping Calculator
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Know exactly how much to tip every vendor at your winery wedding — caterers, photographers, DJs, bartenders, and more. With CA wine country etiquette.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Calculate Tips →
                </div>
              </div>
            </Link>

            {/* Seating Chart Planner — NEW */}
            <Link href="/tools/seating-planner">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">🪑</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Seating Chart Planner
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Build your winery wedding seating plan with drag-and-drop table assignments. Track RSVPs, dietary restrictions, and get per-table California wine suggestions.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  Plan Seating →
                </div>
              </div>
            </Link>

            {/* Wedding Checklist — NEW */}
            <Link href="/tools/wedding-checklist">
              <div className="bg-white hover:shadow-xl border-2 border-[#8B5A3C] rounded-lg p-8 transition cursor-pointer h-full flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#6B3E2E] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                <div className="text-4xl mb-4">📋</div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-3">
                  Winery Wedding Checklist
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  The complete month-by-month winery wedding checklist — from booking your venue to the day after. Covers wine minimums, corkage fees, noise ordinances, harvest conflicts, and every detail unique to vineyard venues.
                </p>
                <div className="text-[#6B3E2E] font-semibold hover:text-[#8B5A3C]">
                  View Checklist →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-8 text-center">
            Plan with Confidence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8B5A3C] mb-2">100%</div>
              <p className="text-gray-700">Free — no signup required</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8B5A3C] mb-2">Real Data</div>
              <p className="text-gray-700">CA wine country rates & data</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8B5A3C] mb-2">Expert Tips</div>
              <p className="text-gray-700">Recommendations from pros</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">
            Ready to Plan Your Wedding?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse 435+ verified California wineries and vineyards that host weddings. Get personalized recommendations, read real reviews, and connect with venues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Browse All Wineries
            </Link>
            <Link
              href="/#regions"
              className="inline-block bg-white hover:bg-gray-100 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg border-2 border-[#6B3E2E] transition"
            >
              Explore Regions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
