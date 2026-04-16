'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

interface WinePairing {
  wine: string;
  varietals: string[];
  description: string;
  caRegions: string[];
  priceRange: string;
  tip: string;
}

interface CourseOption {
  id: string;
  label: string;
  emoji: string;
  options: {
    id: string;
    name: string;
    description: string;
    pairings: WinePairing[];
  }[];
}

const COURSES: CourseOption[] = [
  {
    id: 'cocktail',
    label: 'Cocktail Hour',
    emoji: '🥂',
    options: [
      {
        id: 'charcuterie',
        name: 'Charcuterie & Cheese Board',
        description: 'Cured meats, aged cheeses, nuts, honeycomb',
        pairings: [
          {
            wine: 'Sparkling Wine / Champagne',
            varietals: ['Blanc de Blancs', 'Brut Rosé', 'Pétillant Naturel'],
            description: 'Crisp bubbles cut through the fat of cured meats and complement the saltiness of aged cheeses.',
            caRegions: ['Carneros (Napa/Sonoma)', 'Anderson Valley', 'Santa Cruz Mountains'],
            priceRange: '$25–$60/bottle',
            tip: 'Ask your winery if they produce a sparkling wine — serving estate bubbles during cocktail hour is a memorable touch guests love.',
          },
          {
            wine: 'Sauvignon Blanc',
            varietals: ['Fumé Blanc', 'Sauvignon Blanc'],
            description: 'Herbaceous notes and bright acidity are a classic match for fresh cheeses and light bites.',
            caRegions: ['Napa Valley', 'Livermore Valley', 'Lake County'],
            priceRange: '$18–$45/bottle',
            tip: 'Napa Fumé Blancs have a rounder, oakier style that pairs beautifully with triple-cream cheeses.',
          },
        ],
      },
      {
        id: 'raw-bar',
        name: 'Raw Bar / Oysters',
        description: 'Oysters, shrimp cocktail, ceviche',
        pairings: [
          {
            wine: 'Blanc de Blancs Sparkling',
            varietals: ['Chardonnay-based sparkling', 'Brut Zero'],
            description: 'The mineral salinity and tiny bubbles are the ultimate match for fresh oysters — a classic pairing.',
            caRegions: ['Carneros', 'Anderson Valley', 'Santa Barbara'],
            priceRange: '$30–$70/bottle',
            tip: 'Point Reyes oysters with a Carneros Blanc de Blancs = peak California coastal luxury.',
          },
          {
            wine: 'Dry Rosé',
            varietals: ['Grenache Rosé', 'Pinot Noir Rosé', 'Mourvèdre Rosé'],
            description: 'A dry Provençal-style rosé has enough body for shrimp and ceviche while staying light and elegant.',
            caRegions: ['Santa Barbara', 'Paso Robles', 'Sonoma Coast'],
            priceRange: '$20–$50/bottle',
            tip: 'CA rosé has exploded in quality — many wineries now produce gorgeous estate rosés at half the price of imports.',
          },
        ],
      },
      {
        id: 'passed-apps',
        name: 'Passed Appetizers',
        description: 'Bruschetta, mini sliders, stuffed mushrooms, spring rolls',
        pairings: [
          {
            wine: 'Dry Rosé',
            varietals: ['Grenache Rosé', 'Sangiovese Rosé', 'Pinot Rosé'],
            description: 'Versatile and crowd-pleasing — rosé bridges meat and veggie bites effortlessly.',
            caRegions: ['Paso Robles', 'Santa Barbara', 'Temecula'],
            priceRange: '$18–$40/bottle',
            tip: 'Rosé is the ultimate cocktail-hour wine — it pleases both red and white wine drinkers.',
          },
          {
            wine: 'Pinot Gris / Pinot Grigio',
            varietals: ['Pinot Gris', 'Pinot Grigio'],
            description: 'Light and aromatic — handles the range of flavors in passed apps without overwhelming any single bite.',
            caRegions: ['Russian River Valley', 'Santa Barbara', 'Monterey'],
            priceRange: '$18–$38/bottle',
            tip: 'CA Pinot Gris tends to be fuller and more floral than Italian Grigio — a great step up for guests who usually drink basic whites.',
          },
        ],
      },
    ],
  },
  {
    id: 'first-course',
    label: 'First Course',
    emoji: '🥗',
    options: [
      {
        id: 'salad',
        name: 'Garden or Arugula Salad',
        description: 'Mixed greens, vinaigrette, seasonal vegetables',
        pairings: [
          {
            wine: 'Sauvignon Blanc',
            varietals: ['Sauvignon Blanc', 'Fumé Blanc', 'Verdejo blend'],
            description: 'The herbal, citrus notes mirror vinaigrette dressing and fresh greens perfectly.',
            caRegions: ['Napa Valley', 'Livermore Valley', 'Monterey'],
            priceRange: '$18–$42/bottle',
            tip: 'For arugula salads with lemon, go for a Sauv Blanc with high acidity — the citrus elements echo each other.',
          },
          {
            wine: 'Unoaked Chardonnay',
            varietals: ['Unoaked Chardonnay', 'Chablis-style'],
            description: 'Crisp and clean without buttery oak to compete with light salad flavors.',
            caRegions: ['Sonoma Coast', 'Santa Barbara', 'Santa Cruz Mountains'],
            priceRange: '$22–$55/bottle',
            tip: 'Ask for "un-oaked" or "stainless steel" Chardonnay — many CA wineries now make this style and it\'s a revelation.',
          },
        ],
      },
      {
        id: 'soup',
        name: 'Soup',
        description: 'Butternut squash bisque, tomato bisque, or French onion',
        pairings: [
          {
            wine: 'Viognier',
            varietals: ['Viognier', 'Viognier blend'],
            description: 'Viognier\'s floral apricot notes are a beautiful match for creamy bisque soups.',
            caRegions: ['Paso Robles', 'Livermore Valley', 'Amador County'],
            priceRange: '$20–$48/bottle',
            tip: 'Paso Robles produces some of the best Viognier in California — look for single-vineyard expressions from this region.',
          },
          {
            wine: 'Dry Sherry / Roussanne',
            varietals: ['Roussanne', 'Marsanne', 'White Rhône blend'],
            description: 'Rich and textured whites stand up to the depth of French onion and tomato bisque.',
            caRegions: ['Santa Barbara (Rhône Rangers)', 'Paso Robles'],
            priceRange: '$22–$50/bottle',
            tip: 'CA\'s "Rhône Rangers" movement produces incredible Roussanne and Marsanne — often a steal compared to imports.',
          },
        ],
      },
      {
        id: 'seafood-appetizer',
        name: 'Seafood Starter',
        description: 'Seared scallops, shrimp bisque, tuna tartare',
        pairings: [
          {
            wine: 'Oaked Chardonnay',
            varietals: ['Chardonnay', 'Burgundy-style Chardonnay'],
            description: 'Buttery oak Chardonnay mirrors the richness of seared scallops — a Napa classic.',
            caRegions: ['Napa Valley', 'Carneros', 'Russian River Valley'],
            priceRange: '$30–$80/bottle',
            tip: 'Carneros Chardonnays hit the perfect balance of fruit, butter, and mineral — ideal with scallops and lobster.',
          },
          {
            wine: 'Pinot Noir (Light)',
            varietals: ['Light Pinot Noir', 'Pinot Noir'],
            description: 'A lighter-bodied Pinot with tuna tartare is an unexpected but sophisticated pairing.',
            caRegions: ['Russian River Valley', 'Sonoma Coast', 'Santa Cruz Mountains'],
            priceRange: '$28–$75/bottle',
            tip: 'If you\'re serving tuna tartare, a Sonoma Coast Pinot is a showstopper pairing — earthy and bright.',
          },
        ],
      },
    ],
  },
  {
    id: 'main-course',
    label: 'Main Course',
    emoji: '🍽️',
    options: [
      {
        id: 'chicken',
        name: 'Chicken',
        description: 'Roasted chicken, chicken marsala, stuffed chicken breast',
        pairings: [
          {
            wine: 'Chardonnay',
            varietals: ['Chardonnay', 'Burgundy-style Chardonnay'],
            description: 'The richest, most versatile pairing for chicken — Chardonnay\'s body and acidity handle every preparation.',
            caRegions: ['Napa Valley', 'Sonoma Coast', 'Santa Barbara'],
            priceRange: '$28–$70/bottle',
            tip: 'For chicken marsala specifically, try a Carneros Chardonnay — the earthy mushroom notes in both the dish and wine create harmony.',
          },
          {
            wine: 'Pinot Noir',
            varietals: ['Pinot Noir', 'Pinot Noir blend'],
            description: 'Medium-bodied Pinot is the most elegant red for chicken — light enough not to overpower.',
            caRegions: ['Russian River Valley', 'Santa Rita Hills', 'Monterey'],
            priceRange: '$30–$80/bottle',
            tip: 'If you\'re set on red wine at dinner, Pinot Noir is your best move with chicken — it\'s also a crowd-pleaser for guests who want red.',
          },
        ],
      },
      {
        id: 'beef',
        name: 'Beef / Red Meat',
        description: 'Filet mignon, prime rib, beef tenderloin, short rib',
        pairings: [
          {
            wine: 'Cabernet Sauvignon',
            varietals: ['Cabernet Sauvignon', 'Cab-Merlot blend', 'Bordeaux blend'],
            description: 'The most iconic pairing in wine — Cab\'s tannins cut through beef fat and amplify every savory note.',
            caRegions: ['Napa Valley', 'Paso Robles', 'Alexander Valley'],
            priceRange: '$35–$120/bottle',
            tip: 'This is where winery weddings truly shine — serving the estate Cabernet with the main course is an unforgettable experience guests talk about for years.',
          },
          {
            wine: 'Zinfandel',
            varietals: ['Zinfandel', 'Old Vine Zinfandel'],
            description: 'For short rib or smoky preparations, Zinfandel\'s bold fruit and spice is stunning.',
            caRegions: ['Dry Creek Valley', 'Lodi', 'Amador County', 'Paso Robles'],
            priceRange: '$22–$55/bottle',
            tip: 'Old-vine Zinfandel from Dry Creek or Lodi is a quintessentially Californian experience — and often much more affordable than Napa Cab.',
          },
        ],
      },
      {
        id: 'salmon',
        name: 'Salmon / Fish',
        description: 'Salmon, halibut, sea bass, branzino',
        pairings: [
          {
            wine: 'Pinot Noir',
            varietals: ['Light Pinot Noir', 'Sonoma Pinot'],
            description: 'Salmon is rich enough to handle a light Pinot Noir — and the earthy notes create an incredible combination.',
            caRegions: ['Russian River Valley', 'Sonoma Coast', 'Anderson Valley'],
            priceRange: '$30–$80/bottle',
            tip: 'Salmon + Russian River Pinot Noir is one of the great CA wine country food experiences. If your winery grows Pinot, this is the move.',
          },
          {
            wine: 'Chardonnay',
            varietals: ['Chardonnay', 'White Burgundy style'],
            description: 'Classic pairing — buttery Chardonnay with buttery salmon is hard to beat.',
            caRegions: ['Carneros', 'Santa Barbara', 'Monterey'],
            priceRange: '$28–$65/bottle',
            tip: 'For halibut or sea bass, go for a leaner, higher-acid Chardonnay from Santa Barbara or Sonoma Coast.',
          },
        ],
      },
      {
        id: 'pork',
        name: 'Pork',
        description: 'Pork tenderloin, herb-crusted pork, pulled pork',
        pairings: [
          {
            wine: 'Pinot Noir',
            varietals: ['Pinot Noir', 'Gamay Noir'],
            description: 'Pork and Pinot is a French bistro classic — the earthiness complements roasted pork beautifully.',
            caRegions: ['Russian River Valley', 'Carneros', 'Santa Rita Hills'],
            priceRange: '$28–$75/bottle',
            tip: 'For herb-crusted pork loin, look for a Pinot with good earthiness — Russian River Valley is your best bet.',
          },
          {
            wine: 'Syrah',
            varietals: ['Syrah', 'Rhône-style Syrah'],
            description: 'A peppery, medium-bodied Syrah matches pork\'s richness with just enough tannin and spice.',
            caRegions: ['Paso Robles', 'Santa Barbara (Sta. Rita Hills)', 'Sonoma'],
            priceRange: '$24–$60/bottle',
            tip: 'Central Coast Syrah is some of the best value in California wine — and it pairs with almost everything on a wedding menu.',
          },
        ],
      },
      {
        id: 'vegetarian',
        name: 'Vegetarian / Pasta',
        description: 'Mushroom risotto, eggplant parmigiana, truffle pasta',
        pairings: [
          {
            wine: 'Pinot Noir',
            varietals: ['Pinot Noir', 'Burgundy-style Pinot'],
            description: 'Earthy mushroom dishes and truffle are famous partners for Pinot Noir\'s forest floor complexity.',
            caRegions: ['Russian River Valley', 'Santa Cruz Mountains', 'Sonoma Coast'],
            priceRange: '$28–$80/bottle',
            tip: 'If your menu features mushroom risotto, a Russian River Pinot is the single best wine pairing in the entire California catalog.',
          },
          {
            wine: 'Sangiovese / Italian Varietals',
            varietals: ['Sangiovese', 'Barbera', 'Montepulciano'],
            description: 'For Italian-inspired vegetarian dishes, Sangiovese\'s high acidity and tomato-friendly profile is ideal.',
            caRegions: ['Amador County', 'Lodi', 'Sierra Foothills'],
            priceRange: '$18–$40/bottle',
            tip: 'California\'s Sierra Foothills produce excellent Italian varietals at incredible value — a real hidden gem.',
          },
        ],
      },
    ],
  },
  {
    id: 'dessert',
    label: 'Dessert',
    emoji: '🎂',
    options: [
      {
        id: 'wedding-cake',
        name: 'Wedding Cake',
        description: 'Traditional tiered cake, vanilla, chocolate, or fruit flavors',
        pairings: [
          {
            wine: 'Brut or Extra Dry Sparkling',
            varietals: ['Brut Champagne-style', 'Moscato d\'Asti style', 'Demi-sec'],
            description: 'The traditional cake-and-bubbly toast — a sweeter sparkling (Extra Dry or Demi-Sec) pairs better than bone-dry Brut.',
            caRegions: ['Carneros', 'Anderson Valley', 'Napa Valley'],
            priceRange: '$25–$65/bottle',
            tip: 'Many couples serve Brut for the toast, but a Demi-Sec actually pairs better with cake. Consider offering both — one for toasting, one for sipping with dessert.',
          },
          {
            wine: 'Late Harvest Riesling / Muscat',
            varietals: ['Late Harvest Riesling', 'Orange Muscat', 'Late Harvest Gewürztraminer'],
            description: 'For fruit-flavored cakes, a sweet late-harvest white creates a dessert-within-a-dessert experience.',
            caRegions: ['Monterey', 'Temecula', 'Napa Valley'],
            priceRange: '$20–$45 (375ml)',
            tip: 'Late harvest wines come in 375ml half-bottles — perfect for a dessert table where guests only want a small pour.',
          },
        ],
      },
      {
        id: 'chocolate-desserts',
        name: 'Chocolate Desserts',
        description: 'Chocolate lava cake, mousse, truffles, dark chocolate',
        pairings: [
          {
            wine: 'Port-style Dessert Wine',
            varietals: ['Late Harvest Zinfandel', 'Port-style Zinfandel', 'Petite Sirah Port'],
            description: 'Rich, fortified sweetness from a California Port-style wine is the ultimate match for dark chocolate.',
            caRegions: ['Lodi', 'Amador County', 'Paso Robles'],
            priceRange: '$22–$50 (375–500ml)',
            tip: 'California producers make outstanding Port-style wines from Zinfandel and Petite Sirah — often from old-vine fruit in Lodi. These are incredibly impressive at a fraction of Portuguese Port prices.',
          },
          {
            wine: 'Cabernet Sauvignon',
            varietals: ['Full-bodied Cabernet', 'Dark Cabernet blend'],
            description: 'Dark chocolate and Cabernet is a bold, sophisticated pairing — the tannins and cocoa notes mirror each other.',
            caRegions: ['Napa Valley', 'Paso Robles'],
            priceRange: '$40–$100/bottle',
            tip: 'Only works with 70%+ dark chocolate — milk or semi-sweet chocolate makes big red wine taste harsh.',
          },
        ],
      },
      {
        id: 'fruit-desserts',
        name: 'Fruit Tarts / Berry Desserts',
        description: 'Fruit tart, strawberry shortcake, berry cobbler, lemon tart',
        pairings: [
          {
            wine: 'Sparkling Rosé',
            varietals: ['Brut Rosé', 'Sparkling Rosé', 'Crémant Rosé'],
            description: 'Strawberry and sparkling rosé is one of the most romantic combinations in food and wine.',
            caRegions: ['Carneros', 'Sonoma', 'Anderson Valley'],
            priceRange: '$25–$65/bottle',
            tip: 'Ending the night with sparkling rosé and fresh berry desserts is a beautiful, light way to close out a winery wedding.',
          },
          {
            wine: 'Muscat / Moscato',
            varietals: ['Muscat Canelli', 'Orange Muscat', 'Moscato Bianco'],
            description: 'Floral, lightly sweet Muscat is the most natural partner for citrus and fresh fruit desserts.',
            caRegions: ['Monterey', 'Temecula Valley', 'Napa Valley'],
            priceRange: '$18–$38/bottle',
            tip: 'Muscat Canelli from Monterey County is one of California\'s most underrated dessert wines — it smells like a bouquet of flowers.',
          },
        ],
      },
    ],
  },
];

const CA_WINE_REGIONS = [
  'All Regions',
  'Napa Valley',
  'Sonoma County',
  'Paso Robles',
  'Santa Barbara',
  'Russian River Valley',
  'Carneros',
  'Anderson Valley',
  'Livermore Valley',
  'Temecula Valley',
  'Santa Cruz Mountains',
  'Lodi / Central Valley',
  'Sierra Foothills',
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function WinePairingPlanner() {
  const [wineRegion, setWineRegion] = useState('All Regions');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const selectCourse = (courseId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [courseId]: optionId }));
    setShowResults(false);
  };

  const clearCourse = (courseId: string) => {
    setSelections(prev => {
      const next = { ...prev };
      delete next[courseId];
      return next;
    });
    setShowResults(false);
  };

  const getSelectedOption = (courseId: string) => {
    const sel = selections[courseId];
    if (!sel) return null;
    const course = COURSES.find(c => c.id === courseId);
    return course?.options.find(o => o.id === sel) ?? null;
  };

  const totalSelected = Object.keys(selections).length;

  const filterPairings = (pairings: WinePairing[]) => {
    if (wineRegion === 'All Regions') return pairings;
    return pairings.filter(p =>
      p.caRegions.some(r => r.includes(wineRegion) || wineRegion.split(' ')[0] && r.includes(wineRegion.split(' ')[0]))
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="inline-flex items-center text-[#8B5A3C] hover:text-[#6B3E2E] mb-6 font-medium">
            ← Back to Tools
          </Link>
          <div className="text-5xl mb-4">🍷</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4 leading-tight">
            Wedding Wine Pairing Planner
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Build your complete wedding wine menu. Select each course and get expert California wine pairing recommendations — with varietals, regional picks, price ranges, and pro tips from wine country insiders.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Region Filter */}
        <div className="bg-white rounded-xl border-2 border-[#E8D5C0] p-6 mb-8">
          <h2 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">
            🗺️ Filter by Wine Region (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            If you know which California wine region your venue is in, filter pairings to highlight wines from that area — including estate wines your venue may pour.
          </p>
          <div className="flex flex-wrap gap-2">
            {CA_WINE_REGIONS.map(region => (
              <button
                key={region}
                onClick={() => setWineRegion(region)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                  wineRegion === region
                    ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                    : 'bg-white text-[#6B3E2E] border-[#C4956A] hover:bg-[#FBF0E5]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Course Selector */}
        <div className="space-y-8 mb-10">
          {COURSES.map(course => {
            const selected = getSelectedOption(course.id);
            return (
              <div key={course.id} className="bg-white rounded-xl border-2 border-[#E8D5C0] overflow-hidden">
                {/* Course Header */}
                <div className="bg-[#F5E6D3] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{course.emoji}</span>
                    <h2 className="font-serif text-xl font-bold text-[#6B3E2E]">{course.label}</h2>
                  </div>
                  {selected && (
                    <button
                      onClick={() => clearCourse(course.id)}
                      className="text-sm text-gray-500 hover:text-red-600 transition"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>

                {/* Options */}
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {course.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => selectCourse(course.id, option.id)}
                        className={`text-left p-4 rounded-lg border-2 transition ${
                          selections[course.id] === option.id
                            ? 'border-[#6B3E2E] bg-[#FBF0E5]'
                            : 'border-[#E8D5C0] hover:border-[#C4956A] hover:bg-[#FBF5EE]'
                        }`}
                      >
                        <div className="font-semibold text-[#6B3E2E] text-sm mb-1">{option.name}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                        {selections[course.id] === option.id && (
                          <div className="mt-2 text-xs font-bold text-[#8B5A3C]">✓ Selected</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate Button */}
        {totalSelected > 0 && (
          <div className="text-center mb-12">
            <button
              onClick={() => setShowResults(true)}
              className="bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-bold py-4 px-10 rounded-xl text-lg transition shadow-lg hover:shadow-xl"
            >
              🍷 Generate My Wine Pairing Menu ({totalSelected} course{totalSelected !== 1 ? 's' : ''})
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && totalSelected > 0 && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-3">
                Your Wedding Wine Menu
              </h2>
              <p className="text-gray-600">
                Expert CA wine country pairings for your {totalSelected}-course wedding menu
                {wineRegion !== 'All Regions' ? ` · Filtered for ${wineRegion}` : ''}
              </p>
            </div>

            {COURSES.map(course => {
              const selected = getSelectedOption(course.id);
              if (!selected) return null;

              const visiblePairings = filterPairings(selected.pairings);
              const pairingsToShow = visiblePairings.length > 0 ? visiblePairings : selected.pairings;

              return (
                <div key={course.id} className="bg-white rounded-2xl border-2 border-[#C4956A] overflow-hidden shadow-sm">
                  {/* Course Title */}
                  <div className="bg-gradient-to-r from-[#6B3E2E] to-[#8B5A3C] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.emoji}</span>
                      <div>
                        <div className="text-white/70 text-xs font-medium uppercase tracking-wider">{course.label}</div>
                        <div className="text-white font-bold text-lg">{selected.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Pairings */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pairingsToShow.map((pairing, i) => (
                      <div key={i} className="bg-[#FBF8F4] rounded-xl p-5 border border-[#E8D5C0]">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${i === 0 ? 'text-[#6B3E2E]' : 'text-gray-500'}`}>
                              {i === 0 ? '⭐ Best Pairing' : 'Also Excellent'}
                            </div>
                            <h3 className="font-serif text-lg font-bold text-[#5a3422]">{pairing.wine}</h3>
                          </div>
                          <span className="text-xs bg-[#F5E6D3] text-[#8B5A3C] px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap">
                            {pairing.priceRange}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {pairing.varietals.map(v => (
                            <span key={v} className="text-xs bg-white border border-[#E8D5C0] text-gray-600 px-2 py-0.5 rounded-full">
                              {v}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{pairing.description}</p>

                        <div className="mb-3">
                          <div className="text-xs font-semibold text-[#8B5A3C] mb-1">🗺️ Best CA Regions</div>
                          <div className="flex flex-wrap gap-1">
                            {pairing.caRegions.map(r => (
                              <span key={r} className="text-xs bg-[#F0D5B8] text-[#6B3E2E] px-2 py-0.5 rounded-full">
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="text-xs font-bold text-amber-800 mb-1">💡 Pro Tip</div>
                          <p className="text-xs text-amber-900 leading-relaxed">{pairing.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-[#6B3E2E] to-[#8B5A3C] rounded-2xl p-8 text-white">
              <h3 className="font-serif text-2xl font-bold mb-4">📋 Quick Reference Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {COURSES.map(course => {
                  const sel = getSelectedOption(course.id);
                  if (!sel) return null;
                  const bestPairing = filterPairings(sel.pairings)[0] ?? sel.pairings[0];
                  return (
                    <div key={course.id} className="bg-white/10 rounded-lg p-4">
                      <div className="text-white/70 text-xs mb-1">{course.emoji} {course.label}</div>
                      <div className="font-semibold text-sm">{sel.name}</div>
                      <div className="text-amber-300 text-sm mt-1">→ {bestPairing.wine}</div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-white/20 pt-5">
                <p className="text-white/80 text-sm mb-4">
                  Share this wine menu with your caterer, venue, or wedding planner. For California winery weddings, ask your venue which of these varietals they produce — pouring estate wines is one of the most memorable details of a winery wedding.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-white text-[#6B3E2E] font-bold py-3 px-6 rounded-lg hover:bg-amber-50 transition text-sm"
                >
                  Browse 435+ CA Winery Venues →
                </Link>
              </div>
            </div>

            {/* Winery Search CTA */}
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Want to serve estate wines from your actual venue? Many CA wineries can pour their own wines at your wedding — often at a discount.
              </p>
              <Link
                href="/#regions"
                className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                Find Wineries by Region
              </Link>
            </div>
          </div>
        )}

        {/* Empty state prompt */}
        {totalSelected === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-lg font-medium">Select dishes from each course above to generate your wine menu</p>
            <p className="text-sm mt-2">You don't need to fill every course — just the ones you're serving</p>
          </div>
        )}
      </div>
    </div>
  );
}
