// ─── Types ───────────────────────────────────────────────────────────────────

export interface WinePairing {
  wine: string;
  varietals: string[];
  description: string;
  caRegions: string[];
  priceRange: string;
  tip: string;
}

export interface CourseOptionItem {
  id: string;
  name: string;
  description: string;
  pairings: WinePairing[];
}

export interface CourseOption {
  id: string;
  label: string;
  emoji: string;
  options: CourseOptionItem[];
}

// Selections: { courseId: optionId }
export type Selections = Record<string, string>;

// ─── Data ────────────────────────────────────────────────────────────────────

export const CA_WINE_REGIONS = [
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

export const COURSES: CourseOption[] = [
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
            description:
              'Crisp bubbles cut through the fat of cured meats and complement the saltiness of aged cheeses.',
            caRegions: ['Carneros (Napa/Sonoma)', 'Anderson Valley', 'Santa Cruz Mountains'],
            priceRange: '$25–$60/bottle',
            tip: 'Ask your winery if they produce a sparkling wine — serving estate bubbles during cocktail hour is a memorable touch guests love.',
          },
          {
            wine: 'Sauvignon Blanc',
            varietals: ['Fumé Blanc', 'Sauvignon Blanc'],
            description:
              'Herbaceous notes and bright acidity are a classic match for fresh cheeses and light bites.',
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
            description:
              'The mineral salinity and tiny bubbles are the ultimate match for fresh oysters — a classic pairing.',
            caRegions: ['Carneros', 'Anderson Valley', 'Santa Barbara'],
            priceRange: '$30–$70/bottle',
            tip: 'Point Reyes oysters with a Carneros Blanc de Blancs = peak California coastal luxury.',
          },
          {
            wine: 'Dry Rosé',
            varietals: ['Grenache Rosé', 'Pinot Noir Rosé', 'Mourvèdre Rosé'],
            description:
              'A dry Provençal-style rosé has enough body for shrimp and ceviche while staying light and elegant.',
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
            description:
              'Versatile and crowd-pleasing — rosé bridges meat and veggie bites effortlessly.',
            caRegions: ['Paso Robles', 'Santa Barbara', 'Temecula'],
            priceRange: '$18–$40/bottle',
            tip: 'Rosé is the ultimate cocktail-hour wine — it pleases both red and white wine drinkers.',
          },
          {
            wine: 'Pinot Gris / Pinot Grigio',
            varietals: ['Pinot Gris', 'Pinot Grigio'],
            description:
              'Light and aromatic — handles the range of flavors in passed apps without overwhelming any single bite.',
            caRegions: ['Russian River Valley', 'Santa Barbara', 'Monterey'],
            priceRange: '$18–$38/bottle',
            tip: "CA Pinot Gris tends to be fuller and more floral than Italian Grigio — a great step up for guests who usually drink basic whites.",
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
            description:
              'The herbal, citrus notes mirror vinaigrette dressing and fresh greens perfectly.',
            caRegions: ['Napa Valley', 'Livermore Valley', 'Monterey'],
            priceRange: '$18–$42/bottle',
            tip: 'For arugula salads with lemon, go for a Sauv Blanc with high acidity — the citrus elements echo each other.',
          },
          {
            wine: 'Unoaked Chardonnay',
            varietals: ['Unoaked Chardonnay', 'Chablis-style'],
            description:
              'Crisp and clean without buttery oak to compete with light salad flavors.',
            caRegions: ['Sonoma Coast', 'Santa Barbara', 'Santa Cruz Mountains'],
            priceRange: '$22–$55/bottle',
            tip: "Ask for \"un-oaked\" or \"stainless steel\" Chardonnay — many CA wineries now make this style and it's a revelation.",
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
            description:
              "Viognier's floral apricot notes are a beautiful match for creamy bisque soups.",
            caRegions: ['Paso Robles', 'Livermore Valley', 'Amador County'],
            priceRange: '$20–$48/bottle',
            tip: 'Paso Robles produces some of the best Viognier in California — look for single-vineyard expressions from this region.',
          },
          {
            wine: 'Roussanne / White Rhône',
            varietals: ['Roussanne', 'Marsanne', 'White Rhône blend'],
            description:
              'Rich and textured whites stand up to the depth of French onion and tomato bisque.',
            caRegions: ['Santa Barbara (Rhône Rangers)', 'Paso Robles'],
            priceRange: '$22–$50/bottle',
            tip: "CA's \"Rhône Rangers\" movement produces incredible Roussanne and Marsanne — often a steal compared to imports.",
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
            description:
              'Buttery oak Chardonnay mirrors the richness of seared scallops — a Napa classic.',
            caRegions: ['Napa Valley', 'Carneros', 'Russian River Valley'],
            priceRange: '$30–$80/bottle',
            tip: 'Carneros Chardonnays hit the perfect balance of fruit, butter, and mineral — ideal with scallops and lobster.',
          },
          {
            wine: 'Pinot Noir (Light)',
            varietals: ['Light Pinot Noir', 'Pinot Noir'],
            description:
              'A lighter-bodied Pinot with tuna tartare is an unexpected but sophisticated pairing.',
            caRegions: ['Russian River Valley', 'Sonoma Coast', 'Santa Cruz Mountains'],
            priceRange: '$28–$75/bottle',
            tip: "If you're serving tuna tartare, a Sonoma Coast Pinot is a showstopper pairing — earthy and bright.",
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
            description:
              "The richest, most versatile pairing for chicken — Chardonnay's body and acidity handle every preparation.",
            caRegions: ['Napa Valley', 'Sonoma Coast', 'Santa Barbara'],
            priceRange: '$28–$70/bottle',
            tip: 'For chicken marsala specifically, try a Carneros Chardonnay — the earthy mushroom notes in both the dish and wine create harmony.',
          },
          {
            wine: 'Pinot Noir',
            varietals: ['Pinot Noir', 'Pinot Noir blend'],
            description:
              'Medium-bodied Pinot is the most elegant red for chicken — light enough not to overpower.',
            caRegions: ['Russian River Valley', 'Santa Rita Hills', 'Monterey'],
            priceRange: '$30–$80/bottle',
            tip: "If you're set on red wine at dinner, Pinot Noir is your best move with chicken — it's also a crowd-pleaser for guests who want red.",
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
            description:
              "The most iconic pairing in wine — Cab's tannins cut through beef fat and amplify every savory note.",
            caRegions: ['Napa Valley', 'Paso Robles', 'Alexander Valley'],
            priceRange: '$35–$120/bottle',
            tip: 'This is where winery weddings truly shine — serving the estate Cabernet with the main course is an unforgettable experience guests talk about for years.',
          },
          {
            wine: 'Zinfandel',
            varietals: ['Zinfandel', 'Old Vine Zinfandel'],
            description:
              "For short rib or smoky preparations, Zinfandel's bold fruit and spice is stunning.",
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
            description:
              "Salmon is rich enough to handle a light Pinot Noir — and the earthy notes create an incredible combination.",
            caRegions: ['Russian River Valley', 'Sonoma Coast', 'Anderson Valley'],
            priceRange: '$30–$80/bottle',
            tip: "Salmon + Russian River Pinot Noir is one of the great CA wine country food experiences. If your winery grows Pinot, this is the move.",
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
            description:
              "Pork and Pinot is a French bistro classic — the earthiness complements roasted pork beautifully.",
            caRegions: ['Russian River Valley', 'Carneros', 'Santa Rita Hills'],
            priceRange: '$28–$75/bottle',
            tip: 'For herb-crusted pork loin, look for a Pinot with good earthiness — Russian River Valley is your best bet.',
          },
          {
            wine: 'Syrah',
            varietals: ['Syrah', 'Rhône-style Syrah'],
            description:
              "A peppery, medium-bodied Syrah matches pork's richness with just enough tannin and spice.",
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
            description:
              "Earthy mushroom dishes and truffle are famous partners for Pinot Noir's forest floor complexity.",
            caRegions: ['Russian River Valley', 'Santa Cruz Mountains', 'Sonoma Coast'],
            priceRange: '$28–$80/bottle',
            tip: "If your menu features mushroom risotto, a Russian River Pinot is the single best wine pairing in the entire California catalog.",
          },
          {
            wine: 'Sangiovese / Italian Varietals',
            varietals: ['Sangiovese', 'Barbera', 'Montepulciano'],
            description:
              "For Italian-inspired vegetarian dishes, Sangiovese's high acidity and tomato-friendly profile is ideal.",
            caRegions: ['Amador County', 'Lodi', 'Sierra Foothills'],
            priceRange: '$18–$40/bottle',
            tip: "California's Sierra Foothills produce excellent Italian varietals at incredible value — a real hidden gem.",
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
            description:
              'The traditional cake-and-bubbly toast — a sweeter sparkling (Extra Dry or Demi-Sec) pairs better than bone-dry Brut.',
            caRegions: ['Carneros', 'Anderson Valley', 'Napa Valley'],
            priceRange: '$25–$65/bottle',
            tip: 'Many couples serve Brut for the toast, but a Demi-Sec actually pairs better with cake. Consider offering both — one for toasting, one for sipping with dessert.',
          },
          {
            wine: 'Late Harvest / Muscat',
            varietals: ['Late Harvest Riesling', 'Orange Muscat', 'Late Harvest Gewürztraminer'],
            description:
              'For fruit-flavored cakes, a sweet late-harvest white creates a dessert-within-a-dessert experience.',
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
            description:
              'Rich, fortified sweetness from a California Port-style wine is the ultimate match for dark chocolate.',
            caRegions: ['Lodi', 'Amador County', 'Paso Robles'],
            priceRange: '$22–$50 (375–500ml)',
            tip: 'California producers make outstanding Port-style wines from Zinfandel and Petite Sirah — often from old-vine fruit in Lodi. These are incredibly impressive at a fraction of Portuguese Port prices.',
          },
          {
            wine: 'Cabernet Sauvignon',
            varietals: ['Full-bodied Cabernet', 'Dark Cabernet blend'],
            description:
              "Dark chocolate and Cabernet is a bold, sophisticated pairing — the tannins and cocoa notes mirror each other.",
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
            description:
              'Strawberry and sparkling rosé is one of the most romantic combinations in food and wine.',
            caRegions: ['Carneros', 'Sonoma', 'Anderson Valley'],
            priceRange: '$25–$65/bottle',
            tip: 'Ending the night with sparkling rosé and fresh berry desserts is a beautiful, light way to close out a winery wedding.',
          },
          {
            wine: 'Muscat / Moscato',
            varietals: ['Muscat Canelli', 'Orange Muscat', 'Moscato Bianco'],
            description:
              'Floral, lightly sweet Muscat is the most natural partner for citrus and fresh fruit desserts.',
            caRegions: ['Monterey', 'Temecula Valley', 'Napa Valley'],
            priceRange: '$18–$38/bottle',
            tip: "Muscat Canelli from Monterey County is one of California's most underrated dessert wines — it smells like a bouquet of flowers.",
          },
        ],
      },
    ],
  },
];

// ─── URL encoding/decoding ────────────────────────────────────────────────────

/**
 * Encodes selections + region into a compact query string.
 * e.g. ?cocktail=charcuterie&first-course=salad&main-course=beef&dessert=wedding-cake&region=Napa+Valley
 */
export function selectionsToSearch(
  selections: Selections,
  region: string
): string {
  const params = new URLSearchParams();
  for (const [courseId, optionId] of Object.entries(selections)) {
    params.set(courseId, optionId);
  }
  if (region && region !== 'All Regions') {
    params.set('region', region);
  }
  return params.toString();
}

export function searchToSelections(search: string): {
  selections: Selections;
  region: string;
} {
  const params = new URLSearchParams(search);
  const selections: Selections = {};
  const courseIds = new Set(COURSES.map(c => c.id));

  for (const [key, value] of params.entries()) {
    if (key === 'region') continue;
    if (courseIds.has(key)) {
      // Validate that the optionId actually exists in this course
      const course = COURSES.find(c => c.id === key);
      if (course?.options.find(o => o.id === value)) {
        selections[key] = value;
      }
    }
  }

  const region = params.get('region') ?? 'All Regions';
  return {
    selections,
    region: CA_WINE_REGIONS.includes(region) ? region : 'All Regions',
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getSelectedOption(
  courseId: string,
  selections: Selections
): CourseOptionItem | null {
  const optId = selections[courseId];
  if (!optId) return null;
  const course = COURSES.find(c => c.id === courseId);
  return course?.options.find(o => o.id === optId) ?? null;
}

export function filterPairings(
  pairings: WinePairing[],
  region: string
): WinePairing[] {
  if (region === 'All Regions') return pairings;
  const filtered = pairings.filter(p =>
    p.caRegions.some(r => r.includes(region) || region.includes(r.split(' ')[0]))
  );
  return filtered.length > 0 ? filtered : pairings;
}
