'use client';

import { useState } from 'react';
import Link from 'next/link';

// Historical CA wine region climate data (actual averages)
const regionWeatherData: Record<
  string,
  {
    name: string;
    slug: string;
    description: string;
    harvestMonths: string;
    months: Array<{
      month: string;
      highTemp: number;
      lowTemp: number;
      rainDays: number;
      rainProbability: number;
      harvestPeak: boolean;
      notes: string;
    }>;
  }
> = {
  napa: {
    name: 'Napa Valley',
    slug: 'napa',
    description: 'Iconic wine region with temperate spring and fall conditions.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 59,
        lowTemp: 46,
        rainDays: 11,
        rainProbability: 75,
        harvestPeak: false,
        notes: 'Rainy, cool. Beautiful vineyards but potentially muddy venues.',
      },
      {
        month: 'February',
        highTemp: 60,
        lowTemp: 46,
        rainDays: 10,
        rainProbability: 72,
        harvestPeak: false,
        notes: 'Still rainy but slightly warmer. Spring flowers emerging.',
      },
      {
        month: 'March',
        highTemp: 63,
        lowTemp: 47,
        rainDays: 9,
        rainProbability: 65,
        harvestPeak: false,
        notes: 'Spring arrives. Rain decreasing. Light layers essential.',
      },
      {
        month: 'April',
        highTemp: 68,
        lowTemp: 49,
        rainDays: 7,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Beautiful! Wildflowers in bloom. Ideal wedding month. Low rain.',
      },
      {
        month: 'May',
        highTemp: 75,
        lowTemp: 54,
        rainDays: 5,
        rainProbability: 35,
        harvestPeak: false,
        notes: 'Perfect weather. Lush green vineyards. Highly recommended.',
      },
      {
        month: 'June',
        highTemp: 82,
        lowTemp: 59,
        rainDays: 3,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Warm, dry, beautiful. Excellent for outdoor venues.',
      },
      {
        month: 'July',
        highTemp: 85,
        lowTemp: 62,
        rainDays: 2,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Hot and dry. Peak summer. Consider sun protection and shade.',
      },
      {
        month: 'August',
        highTemp: 85,
        lowTemp: 62,
        rainDays: 2,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest begins! Special vintage atmosphere. Hot.',
      },
      {
        month: 'September',
        highTemp: 81,
        lowTemp: 59,
        rainDays: 3,
        rainProbability: 10,
        harvestPeak: true,
        notes: 'Peak harvest season! Incredible energy and celebration vibes.',
      },
      {
        month: 'October',
        highTemp: 73,
        lowTemp: 54,
        rainDays: 4,
        rainProbability: 25,
        harvestPeak: true,
        notes: 'Harvest concludes. Fall colors. Perfect temps. Very popular.',
      },
      {
        month: 'November',
        highTemp: 63,
        lowTemp: 48,
        rainDays: 7,
        rainProbability: 55,
        harvestPeak: false,
        notes: 'Rain increases. Autumn beauty. Fewer crowds, lower prices.',
      },
      {
        month: 'December',
        highTemp: 58,
        lowTemp: 44,
        rainDays: 10,
        rainProbability: 70,
        harvestPeak: false,
        notes: 'Cold, rainy. Festive atmosphere for holiday-themed weddings.',
      },
    ],
  },
  sonoma: {
    name: 'Sonoma County',
    slug: 'sonoma',
    description: 'Cool coastal influence creates a mild climate perfect for both red and white wines.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 58,
        lowTemp: 45,
        rainDays: 12,
        rainProbability: 78,
        harvestPeak: false,
        notes: 'Wet and cool. Pristine vineyards but expect rain.',
      },
      {
        month: 'February',
        highTemp: 59,
        lowTemp: 45,
        rainDays: 11,
        rainProbability: 75,
        harvestPeak: false,
        notes: 'Rainy but wine country is beautiful. Spring approaches.',
      },
      {
        month: 'March',
        highTemp: 62,
        lowTemp: 46,
        rainDays: 9,
        rainProbability: 62,
        harvestPeak: false,
        notes: 'Spring rains ending. Mild temps. Wine region comes alive.',
      },
      {
        month: 'April',
        highTemp: 66,
        lowTemp: 48,
        rainDays: 7,
        rainProbability: 48,
        harvestPeak: false,
        notes: 'Lovely spring weather. Wildflowers peak. Cooler than inland.',
      },
      {
        month: 'May',
        highTemp: 72,
        lowTemp: 52,
        rainDays: 4,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Excellent! Mild, mostly dry. Gorgeous for outdoor ceremonies.',
      },
      {
        month: 'June',
        highTemp: 78,
        lowTemp: 56,
        rainDays: 3,
        rainProbability: 12,
        harvestPeak: false,
        notes: 'Warm but not hot. Coastal breeze keeps it comfortable.',
      },
      {
        month: 'July',
        highTemp: 80,
        lowTemp: 58,
        rainDays: 2,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Summer peak. Very dry. Still cooler than inland wine regions.',
      },
      {
        month: 'August',
        highTemp: 80,
        lowTemp: 58,
        rainDays: 2,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest begins. Warm days, cool nights. Premier month.',
      },
      {
        month: 'September',
        highTemp: 78,
        lowTemp: 56,
        rainDays: 2,
        rainProbability: 8,
        harvestPeak: true,
        notes: 'Peak harvest! Incredible atmosphere. Perfect weather.',
      },
      {
        month: 'October',
        highTemp: 70,
        lowTemp: 52,
        rainDays: 3,
        rainProbability: 20,
        harvestPeak: true,
        notes: 'Harvest ends. Ideal conditions. Less crowded than May.',
      },
      {
        month: 'November',
        highTemp: 61,
        lowTemp: 47,
        rainDays: 8,
        rainProbability: 58,
        harvestPeak: false,
        notes: 'Rain returning. Fall foliage. Great for intimate weddings.',
      },
      {
        month: 'December',
        highTemp: 57,
        lowTemp: 43,
        rainDays: 11,
        rainProbability: 72,
        harvestPeak: false,
        notes: 'Cool and wet. Holiday charm. Fewer tourists.',
      },
    ],
  },
  temecula: {
    name: 'Temecula Valley',
    slug: 'temecula',
    description: 'Sunny Southern California wine region with warm, dry conditions most of the year.',
    harvestMonths: 'August - September',
    months: [
      {
        month: 'January',
        highTemp: 62,
        lowTemp: 46,
        rainDays: 6,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Cool and pleasant. Light rain possible. Fresh air for photos.',
      },
      {
        month: 'February',
        highTemp: 64,
        lowTemp: 47,
        rainDays: 5,
        rainProbability: 40,
        harvestPeak: false,
        notes: 'Warming up. Minimal rain. Spring flowers starting.',
      },
      {
        month: 'March',
        highTemp: 68,
        lowTemp: 49,
        rainDays: 4,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Very pleasant. Sunny days. Excellent for outdoor events.',
      },
      {
        month: 'April',
        highTemp: 74,
        lowTemp: 52,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Beautiful spring! Warm, dry, sunny. Highly recommended.',
      },
      {
        month: 'May',
        highTemp: 82,
        lowTemp: 57,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Perfect! Hot days, cool nights. Dry and sunny. Peak season.',
      },
      {
        month: 'June',
        highTemp: 88,
        lowTemp: 62,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: false,
        notes: 'Hot and sunny. Consider indoor venues or shade coverage.',
      },
      {
        month: 'July',
        highTemp: 92,
        lowTemp: 66,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Very hot. Request evening venues. Abundant sunshine for photos.',
      },
      {
        month: 'August',
        highTemp: 91,
        lowTemp: 65,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Hot. Plan for heat. Beautiful sunsets.',
      },
      {
        month: 'September',
        highTemp: 88,
        lowTemp: 63,
        rainDays: 0,
        rainProbability: 3,
        harvestPeak: true,
        notes: 'Peak harvest! Hot days, cool nights. Perfect combination.',
      },
      {
        month: 'October',
        highTemp: 81,
        lowTemp: 57,
        rainDays: 1,
        rainProbability: 8,
        harvestPeak: false,
        notes: 'Harvest ends. Cooling down. Excellent weather. Golden hour light.',
      },
      {
        month: 'November',
        highTemp: 71,
        lowTemp: 51,
        rainDays: 2,
        rainProbability: 25,
        harvestPeak: false,
        notes: 'Mild and pleasant. Some rain possible. Fewer crowds.',
      },
      {
        month: 'December',
        highTemp: 64,
        lowTemp: 47,
        rainDays: 3,
        rainProbability: 35,
        harvestPeak: false,
        notes: 'Coolish and occasionally rainy. Holiday decorations shine here.',
      },
    ],
  },
  paso_robles: {
    name: 'Paso Robles',
    slug: 'paso-robles',
    description: 'Warm inland region with long, dry summers and distinctive harvest season.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 60,
        lowTemp: 42,
        rainDays: 7,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Cool and occasionally rainy. Peaceful vineyard backdrop.',
      },
      {
        month: 'February',
        highTemp: 62,
        lowTemp: 44,
        rainDays: 6,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Warming up. Less rain than January. Spring approaches.',
      },
      {
        month: 'March',
        highTemp: 66,
        lowTemp: 46,
        rainDays: 5,
        rainProbability: 35,
        harvestPeak: false,
        notes: 'Spring rains ending. Mild temps. Wildflowers blooming.',
      },
      {
        month: 'April',
        highTemp: 72,
        lowTemp: 49,
        rainDays: 3,
        rainProbability: 20,
        harvestPeak: false,
        notes: 'Beautiful spring! Warm, dry, sunny. Highly recommended.',
      },
      {
        month: 'May',
        highTemp: 80,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Excellent! Long sunny days. Perfect for outdoor events.',
      },
      {
        month: 'June',
        highTemp: 87,
        lowTemp: 60,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: false,
        notes: 'Hot and dry. Abundant sunshine. Consider shade for comfort.',
      },
      {
        month: 'July',
        highTemp: 91,
        lowTemp: 63,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Very hot inland. Long sunny days. Evening venues recommended.',
      },
      {
        month: 'August',
        highTemp: 90,
        lowTemp: 62,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Hot. Spectacular energy. Amazing sunsets.',
      },
      {
        month: 'September',
        highTemp: 87,
        lowTemp: 59,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect weather. Busiest season. Book early.',
      },
      {
        month: 'October',
        highTemp: 79,
        lowTemp: 52,
        rainDays: 1,
        rainProbability: 10,
        harvestPeak: true,
        notes: 'Harvest winds down. Cooling. Beautiful golden hour light.',
      },
      {
        month: 'November',
        highTemp: 69,
        lowTemp: 47,
        rainDays: 3,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Mild. Occasional rain. Fewer crowds, lower prices.',
      },
      {
        month: 'December',
        highTemp: 61,
        lowTemp: 43,
        rainDays: 5,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Cool with some rain. Holiday charm. Quiet season.',
      },
    ],
  },
  santa_barbara: {
    name: 'Santa Barbara Wine Country',
    slug: 'santa-barbara',
    description: 'Diverse coastal and valley locations with perfect-for-weddings spring and fall.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 61,
        lowTemp: 46,
        rainDays: 6,
        rainProbability: 48,
        harvestPeak: false,
        notes: 'Cool and clear. Occasional rain. Pristine photo conditions.',
      },
      {
        month: 'February',
        highTemp: 62,
        lowTemp: 46,
        rainDays: 5,
        rainProbability: 42,
        harvestPeak: false,
        notes: 'Similar to January. Spring flowers beginning. Beautiful light.',
      },
      {
        month: 'March',
        highTemp: 65,
        lowTemp: 48,
        rainDays: 4,
        rainProbability: 32,
        harvestPeak: false,
        notes: 'Spring arriving. Mild, increasingly sunny. Great for photos.',
      },
      {
        month: 'April',
        highTemp: 70,
        lowTemp: 50,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Beautiful! Warm days, cool nights. Wildflowers. Top rated month.',
      },
      {
        month: 'May',
        highTemp: 76,
        lowTemp: 54,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Perfection! Warm, dry, sunny. Ideal for outdoor weddings.',
      },
      {
        month: 'June',
        highTemp: 82,
        lowTemp: 58,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: false,
        notes: 'Warm and beautiful. Longer daylight. Excellent conditions.',
      },
      {
        month: 'July',
        highTemp: 85,
        lowTemp: 61,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Hot but coastal breezes cool things. Long sunny days.',
      },
      {
        month: 'August',
        highTemp: 85,
        lowTemp: 61,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Warm, dry. Exciting vintage atmosphere.',
      },
      {
        month: 'September',
        highTemp: 83,
        lowTemp: 60,
        rainDays: 0,
        rainProbability: 3,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect temps. Very popular. Book ahead.',
      },
      {
        month: 'October',
        highTemp: 76,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 12,
        harvestPeak: true,
        notes: 'Harvest ends. Cooling. Still gorgeous. Golden light for photos.',
      },
      {
        month: 'November',
        highTemp: 68,
        lowTemp: 50,
        rainDays: 3,
        rainProbability: 35,
        harvestPeak: false,
        notes: 'Mild autumn. Occasional rain. Fewer crowds.',
      },
      {
        month: 'December',
        highTemp: 62,
        lowTemp: 46,
        rainDays: 5,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Cool and rainy. Holiday atmosphere. Fewer tourists.',
      },
    ],
  },
  healdsburg: {
    name: 'Healdsburg (Sonoma)',
    slug: 'healdsburg',
    description: 'Charming town with Russian River influence. Ideal spring and fall climate.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 57,
        lowTemp: 44,
        rainDays: 12,
        rainProbability: 80,
        harvestPeak: false,
        notes: 'Wet and cool. Cozy venues. Rain likely on outdoor events.',
      },
      {
        month: 'February',
        highTemp: 58,
        lowTemp: 44,
        rainDays: 11,
        rainProbability: 77,
        harvestPeak: false,
        notes: 'Still rainy. Indoor venues recommended. Spring nearby.',
      },
      {
        month: 'March',
        highTemp: 61,
        lowTemp: 45,
        rainDays: 9,
        rainProbability: 65,
        harvestPeak: false,
        notes: 'Rain decreasing. Spring warming. Beautiful town awakening.',
      },
      {
        month: 'April',
        highTemp: 65,
        lowTemp: 47,
        rainDays: 6,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Spring peak! Wildflowers. Mild and mostly dry. Recommended.',
      },
      {
        month: 'May',
        highTemp: 71,
        lowTemp: 51,
        rainDays: 4,
        rainProbability: 25,
        harvestPeak: false,
        notes: 'Excellent! Warm, mostly dry. Healdsburg square perfect.',
      },
      {
        month: 'June',
        highTemp: 77,
        lowTemp: 55,
        rainDays: 2,
        rainProbability: 10,
        harvestPeak: false,
        notes: 'Beautiful summer. Warm, dry. Ideal for outdoor events.',
      },
      {
        month: 'July',
        highTemp: 79,
        lowTemp: 57,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Peak summer. Warm but not too hot. Longer days.',
      },
      {
        month: 'August',
        highTemp: 79,
        lowTemp: 57,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest season! Warm, dry. Energetic town. Book early.',
      },
      {
        month: 'September',
        highTemp: 77,
        lowTemp: 55,
        rainDays: 2,
        rainProbability: 8,
        harvestPeak: true,
        notes: 'Peak harvest! Ideal temps. Very popular. Reserve ahead.',
      },
      {
        month: 'October',
        highTemp: 69,
        lowTemp: 51,
        rainDays: 3,
        rainProbability: 18,
        harvestPeak: true,
        notes: 'Harvest ends. Cooling. Beautiful fall colors. Still excellent.',
      },
      {
        month: 'November',
        highTemp: 60,
        lowTemp: 46,
        rainDays: 7,
        rainProbability: 55,
        harvestPeak: false,
        notes: 'Rain increasing. Autumn beauty. Quieter season.',
      },
      {
        month: 'December',
        highTemp: 56,
        lowTemp: 42,
        rainDays: 10,
        rainProbability: 75,
        harvestPeak: false,
        notes: 'Wet and cool. Holiday charm. Intimate indoor venues shine.',
      },
    ],
  },
  lodi: {
    name: 'Lodi',
    slug: 'lodi',
    description: 'Central Valley wine region with hot summers and mild winters.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 58,
        lowTemp: 40,
        rainDays: 6,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Cool inland valley. Occasional rain. Clear sky days possible.',
      },
      {
        month: 'February',
        highTemp: 61,
        lowTemp: 42,
        rainDays: 5,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Warming. Spring starts. Less rain than January.',
      },
      {
        month: 'March',
        highTemp: 65,
        lowTemp: 44,
        rainDays: 4,
        rainProbability: 32,
        harvestPeak: false,
        notes: 'Spring! Dry and warm. Beautiful vineyard backdrop.',
      },
      {
        month: 'April',
        highTemp: 71,
        lowTemp: 47,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Beautiful spring! Warm, mostly dry. Highly recommended.',
      },
      {
        month: 'May',
        highTemp: 81,
        lowTemp: 53,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Hot inland days. Perfect vineyard conditions.',
      },
      {
        month: 'June',
        highTemp: 88,
        lowTemp: 59,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: false,
        notes: 'Hot and dry. Consider shade and cooling refreshments.',
      },
      {
        month: 'July',
        highTemp: 93,
        lowTemp: 63,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Very hot inland. Evening venues recommended. Stunning sunsets.',
      },
      {
        month: 'August',
        highTemp: 92,
        lowTemp: 62,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Very hot. Plan for heat management.',
      },
      {
        month: 'September',
        highTemp: 88,
        lowTemp: 59,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Peak harvest! Hot but cooling slightly. Busy season.',
      },
      {
        month: 'October',
        highTemp: 80,
        lowTemp: 52,
        rainDays: 0,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest ends. Cooling down. More comfortable temps.',
      },
      {
        month: 'November',
        highTemp: 69,
        lowTemp: 46,
        rainDays: 2,
        rainProbability: 28,
        harvestPeak: false,
        notes: 'Mild and pleasant. Occasional rain. Fewer crowds.',
      },
      {
        month: 'December',
        highTemp: 59,
        lowTemp: 40,
        rainDays: 4,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Cool with some rain. Holiday season atmosphere.',
      },
    ],
  },
  monterey: {
    name: 'Monterey County',
    slug: 'monterey',
    description: 'Coastal region with cool, maritime-influenced climate. Stunning ocean backdrops.',
    harvestMonths: 'September - October',
    months: [
      {
        month: 'January',
        highTemp: 59,
        lowTemp: 45,
        rainDays: 7,
        rainProbability: 55,
        harvestPeak: false,
        notes: 'Cool coastal weather. Rain possible. Dramatic ocean views.',
      },
      {
        month: 'February',
        highTemp: 60,
        lowTemp: 45,
        rainDays: 6,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Similar to January. Spring approaching. Moody light.',
      },
      {
        month: 'March',
        highTemp: 63,
        lowTemp: 46,
        rainDays: 5,
        rainProbability: 40,
        harvestPeak: false,
        notes: 'Spring starts. Cooler but rain decreasing. Wildflowers.',
      },
      {
        month: 'April',
        highTemp: 66,
        lowTemp: 48,
        rainDays: 3,
        rainProbability: 25,
        harvestPeak: false,
        notes: 'Lovely spring! Mild, mostly dry. Excellent light.',
      },
      {
        month: 'May',
        highTemp: 71,
        lowTemp: 51,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Beautiful! Cool but comfortable. Recommended.',
      },
      {
        month: 'June',
        highTemp: 76,
        lowTemp: 54,
        rainDays: 1,
        rainProbability: 8,
        harvestPeak: false,
        notes: 'Summer! Mild and mostly dry. Long daylight.',
      },
      {
        month: 'July',
        highTemp: 78,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Peak summer but still cool and comfortable. Dry.',
      },
      {
        month: 'August',
        highTemp: 77,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest begins. Warm but not hot. Coastal breeze. Recommended.',
      },
      {
        month: 'September',
        highTemp: 76,
        lowTemp: 54,
        rainDays: 1,
        rainProbability: 8,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect weather. Book well in advance.',
      },
      {
        month: 'October',
        highTemp: 71,
        lowTemp: 51,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: true,
        notes: 'Harvest ends. Still lovely. Fall colors emerging.',
      },
      {
        month: 'November',
        highTemp: 63,
        lowTemp: 47,
        rainDays: 5,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Rain increasing. Fall beauty. Fewer tourists.',
      },
      {
        month: 'December',
        highTemp: 58,
        lowTemp: 43,
        rainDays: 7,
        rainProbability: 60,
        harvestPeak: false,
        notes: 'Cool and rainy. Holiday atmosphere. Dramatic skies.',
      },
    ],
  },
  livermore: {
    name: 'Livermore Valley',
    slug: 'livermore',
    description: 'East Bay region with warm days and cool nights. Historic wine pioneer area.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 58,
        lowTemp: 40,
        rainDays: 6,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Cool inland. Occasionally rainy. Clear days for photos.',
      },
      {
        month: 'February',
        highTemp: 60,
        lowTemp: 42,
        rainDays: 5,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Warming slightly. Spring beginning. Less rain.',
      },
      {
        month: 'March',
        highTemp: 64,
        lowTemp: 43,
        rainDays: 4,
        rainProbability: 32,
        harvestPeak: false,
        notes: 'Spring! Drying and warming. Wildflowers in bloom.',
      },
      {
        month: 'April',
        highTemp: 70,
        lowTemp: 46,
        rainDays: 2,
        rainProbability: 15,
        harvestPeak: false,
        notes: 'Beautiful! Warm days, cool nights. Ideal spring conditions.',
      },
      {
        month: 'May',
        highTemp: 80,
        lowTemp: 52,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Excellent! Hot days, cool nights. Perfect for weddings.',
      },
      {
        month: 'June',
        highTemp: 87,
        lowTemp: 58,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: false,
        notes: 'Hot and dry inland. Consider shade for outdoor events.',
      },
      {
        month: 'July',
        highTemp: 91,
        lowTemp: 62,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Very hot. Evening venues best. Beautiful sunsets.',
      },
      {
        month: 'August',
        highTemp: 90,
        lowTemp: 61,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Hot. Spectacular energy and light.',
      },
      {
        month: 'September',
        highTemp: 87,
        lowTemp: 59,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect combination of warmth and heritage.',
      },
      {
        month: 'October',
        highTemp: 79,
        lowTemp: 52,
        rainDays: 1,
        rainProbability: 10,
        harvestPeak: true,
        notes: 'Harvest ends. Cooling. Golden light for photography.',
      },
      {
        month: 'November',
        highTemp: 68,
        lowTemp: 46,
        rainDays: 3,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Mild. Occasional rain. Fewer crowds.',
      },
      {
        month: 'December',
        highTemp: 59,
        lowTemp: 40,
        rainDays: 5,
        rainProbability: 48,
        harvestPeak: false,
        notes: 'Cool with some rain. Cozy venues. Holiday mood.',
      },
    ],
  },
  ramona: {
    name: 'Ramona',
    slug: 'ramona',
    description: 'San Diego County inland hills. Warm, sunny conditions and excellent fall weather.',
    harvestMonths: 'August - October',
    months: [
      {
        month: 'January',
        highTemp: 63,
        lowTemp: 45,
        rainDays: 4,
        rainProbability: 35,
        harvestPeak: false,
        notes: 'Mild and mostly sunny. Very pleasant. Rain unlikely.',
      },
      {
        month: 'February',
        highTemp: 65,
        lowTemp: 46,
        rainDays: 3,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Warming. Spring approaching. Sunny.',
      },
      {
        month: 'March',
        highTemp: 69,
        lowTemp: 48,
        rainDays: 3,
        rainProbability: 25,
        harvestPeak: false,
        notes: 'Spring! Warm, mostly sunny. Wildflowers emerging.',
      },
      {
        month: 'April',
        highTemp: 75,
        lowTemp: 51,
        rainDays: 2,
        rainProbability: 12,
        harvestPeak: false,
        notes: 'Beautiful! Warm, mostly dry. Excellent conditions.',
      },
      {
        month: 'May',
        highTemp: 83,
        lowTemp: 57,
        rainDays: 0,
        rainProbability: 3,
        harvestPeak: false,
        notes: 'Perfect! Hot, sunny, dry. Ideal wedding season.',
      },
      {
        month: 'June',
        highTemp: 89,
        lowTemp: 62,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Hot and sunny. Abundant clear skies. Plan for heat.',
      },
      {
        month: 'July',
        highTemp: 93,
        lowTemp: 66,
        rainDays: 0,
        rainProbability: 1,
        harvestPeak: false,
        notes: 'Very hot and dry. Exceptional sunlight. Heat management key.',
      },
      {
        month: 'August',
        highTemp: 92,
        lowTemp: 65,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Harvest begins. Hot. Beautiful sunsets. Popular season.',
      },
      {
        month: 'September',
        highTemp: 89,
        lowTemp: 63,
        rainDays: 0,
        rainProbability: 2,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect combo: warm but slightly cooler.',
      },
      {
        month: 'October',
        highTemp: 82,
        lowTemp: 57,
        rainDays: 0,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest ends. Cooling. Still hot and sunny. Excellent.',
      },
      {
        month: 'November',
        highTemp: 72,
        lowTemp: 51,
        rainDays: 1,
        rainProbability: 20,
        harvestPeak: false,
        notes: 'Mild and mostly sunny. Rare rain. Very pleasant.',
      },
      {
        month: 'December',
        highTemp: 65,
        lowTemp: 47,
        rainDays: 2,
        rainProbability: 30,
        harvestPeak: false,
        notes: 'Cool but mostly sunny. Holiday season. Occasional rain.',
      },
    ],
  },
  santa_cruz: {
    name: 'Santa Cruz Mountains',
    slug: 'santa-cruz',
    description: 'Redwood-surrounded wine region with cool, maritime climate.',
    harvestMonths: 'September - October',
    months: [
      {
        month: 'January',
        highTemp: 56,
        lowTemp: 42,
        rainDays: 10,
        rainProbability: 72,
        harvestPeak: false,
        notes: 'Wet and cool. Lush green. Rain likely. Indoor venues best.',
      },
      {
        month: 'February',
        highTemp: 57,
        lowTemp: 42,
        rainDays: 9,
        rainProbability: 68,
        harvestPeak: false,
        notes: 'Wet season continues. Dramatic foggy mornings.',
      },
      {
        month: 'March',
        highTemp: 60,
        lowTemp: 43,
        rainDays: 8,
        rainProbability: 60,
        harvestPeak: false,
        notes: 'Still wet. Spring beginning. Fog decreasing.',
      },
      {
        month: 'April',
        highTemp: 64,
        lowTemp: 45,
        rainDays: 6,
        rainProbability: 45,
        harvestPeak: false,
        notes: 'Spring peak! Wildflowers, rain decreasing. Recommended.',
      },
      {
        month: 'May',
        highTemp: 70,
        lowTemp: 49,
        rainDays: 3,
        rainProbability: 25,
        harvestPeak: false,
        notes: 'Excellent! Cool, mostly dry. Redwood backdrop stunning.',
      },
      {
        month: 'June',
        highTemp: 76,
        lowTemp: 53,
        rainDays: 2,
        rainProbability: 12,
        harvestPeak: false,
        notes: 'Beautiful summer! Warm, mostly dry. Fog mornings clear.',
      },
      {
        month: 'July',
        highTemp: 78,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: false,
        notes: 'Peak summer. Cool for mountains. Dry. Long days.',
      },
      {
        month: 'August',
        highTemp: 77,
        lowTemp: 55,
        rainDays: 1,
        rainProbability: 5,
        harvestPeak: true,
        notes: 'Harvest begins. Warm, dry. Mountain redwoods impressive.',
      },
      {
        month: 'September',
        highTemp: 75,
        lowTemp: 53,
        rainDays: 2,
        rainProbability: 8,
        harvestPeak: true,
        notes: 'Peak harvest! Perfect temps. Magical forest setting.',
      },
      {
        month: 'October',
        highTemp: 68,
        lowTemp: 49,
        rainDays: 3,
        rainProbability: 20,
        harvestPeak: true,
        notes: 'Harvest ends. Fall colors, cooler. Still excellent.',
      },
      {
        month: 'November',
        highTemp: 60,
        lowTemp: 44,
        rainDays: 7,
        rainProbability: 50,
        harvestPeak: false,
        notes: 'Rain returning. Fall foliage. Intimate atmosphere.',
      },
      {
        month: 'December',
        highTemp: 56,
        lowTemp: 41,
        rainDays: 10,
        rainProbability: 70,
        harvestPeak: false,
        notes: 'Wet season. Cozy indoor venues. Holiday feel.',
      },
    ],
  },
};

type RegionSlug = keyof typeof regionWeatherData;

export default function WeddingWeatherGuide() {
  const [selectedRegion, setSelectedRegion] = useState<RegionSlug>('napa');

  const region = regionWeatherData[selectedRegion];

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            🌤️ Wedding Weather Guide
          </h1>
          <p className="text-lg text-gray-700">
            Month-by-month climate patterns for all 11 California wine regions. Plan your wedding date with confidence.
          </p>
        </div>
      </section>

      {/* Region Selector */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Select a Region:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.keys(regionWeatherData).map((slug) => {
              const reg = regionWeatherData[slug as RegionSlug];
              return (
                <button
                  key={slug}
                  onClick={() => setSelectedRegion(slug as RegionSlug)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                    selectedRegion === slug
                      ? 'bg-[#6B3E2E] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {reg.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Region Info */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-2">
              {region.name} Climate
            </h2>
            <p className="text-lg text-gray-700 mb-4">{region.description}</p>
            <div className="bg-[#F5E6D3] p-4 rounded-lg inline-block">
              <p className="text-sm font-semibold text-gray-800">
                🍂 <span className="text-[#6B3E2E]">Harvest Season:</span> {region.harvestMonths}
              </p>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {region.months.map((month) => (
              <div
                key={month.month}
                className={`rounded-lg p-6 border-2 transition ${
                  month.harvestPeak
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400'
                    : 'bg-white border-[#8B5A3C] hover:shadow-lg'
                }`}
              >
                {/* Month Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#6B3E2E]">
                      {month.month}
                    </h3>
                    {month.harvestPeak && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded mt-1 inline-block">
                        🍇 HARVEST PEAK
                      </span>
                    )}
                  </div>
                </div>

                {/* Temperature */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Temperature</span>
                    <span className="text-lg font-bold text-[#6B3E2E]">
                      {month.highTemp}°F / {month.lowTemp}°F
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-red-400"
                      style={{
                        width: `${((month.highTemp - 40) / 55) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    High: {month.highTemp}° | Low: {month.lowTemp}°
                  </p>
                </div>

                {/* Rain Probability */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Rain Chance</span>
                    <span className="text-lg font-bold text-[#6B3E2E]">
                      {month.rainProbability}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${month.rainProbability}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Average rainy days: {month.rainDays}
                  </p>
                </div>

                {/* Notes */}
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  {month.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legend and Tips */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-8">Planning Tips</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-amber-500">
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">🍇 Harvest Season (Aug-Oct)</h3>
              <p className="text-gray-700">
                Peak wedding season in wine country! Incredible energy and atmosphere, but expect higher prices and
                booked venues. Perfect weather combines with the romance of harvest. Book early.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">🌸 Spring (Apr-May)</h3>
              <p className="text-gray-700">
                Second-most popular season. Perfect temperatures, blooming wildflowers, and generally lower prices than
                fall. Fewer crowds than harvest. Excellent photo light. Highly recommended.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">❄️ Winter (Dec-Feb)</h3>
              <p className="text-gray-700">
                Rainy season, especially in Napa/Sonoma. Not ideal for outdoor venues. But cozy indoor weddings are
                beautiful, fewer tourists, and discounts available. Consider it for intimate winter celebrations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">☀️ Summer (Jun-Jul)</h3>
              <p className="text-gray-700">
                Hot and dry. Coastal regions (Monterey, Santa Barbara) stay cool. Inland areas (Paso Robles, Lodi) get
                very hot — plan evening events. Abundant sunshine for photos. Water and shade essential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500">
              <h3 className="font-semibold text-lg text-[#6B3E2E] mb-2">🌧️ Rain Planning</h3>
              <p className="text-gray-700">
                Winter months (especially Nov-Feb in Napa/Sonoma) have 40-80% rain probability. Ask your venue about
                indoor backup spaces. Tent rental is common for winter events. Drainage can be an issue after heavy
                rain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Comparisons */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-8">Regional Climate Differences</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-800">
                <span className="font-semibold text-blue-900">Coastal Regions</span> (Monterey, Santa Barbara,
                Healdsburg): Cool year-round. Fog in summer mornings. Rain in winter. Moderate temperatures ideal for
                outdoor events. Peak season: April-May and September-October.
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-gray-800">
                <span className="font-semibold text-orange-900">Inland Valleys</span> (Paso Robles, Lodi, Livermore):
                Hot summers, cool winters. Hot days / cool nights ideal for wine. Very hot July-August. Spring
                (Apr-May) and fall (Sep-Oct) best. Watch heat for summer events.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <p className="text-gray-800">
                <span className="font-semibold text-red-900">Southern CA</span> (Temecula, Ramona): Warmest year-round.
                Sunny. Minimal rain. Hot inland areas. April-May and September-October ideal. Abundant sunshine for
                photos. Plan shade for summer events.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-gray-800">
                <span className="font-semibold text-green-900">Mountain Regions</span> (Santa Cruz Mountains): Coolest,
                wettest. Redwood forests stunning. Rain September-November. Spring peak season. April-May best. Fog
                dramatic but unpredictable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">Ready to Choose Your Venue?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse 435+ California wineries. Filter by region to see weather patterns, or contact venues to discuss
            their preferred seasons and backup plans.
          </p>
          <Link
            href="/directory"
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Browse Wineries by Region →
          </Link>
        </div>
      </section>
    </div>
  );
}
