'use client';

import Link from 'next/link';

// Mapping of region names to weather guide slugs
const regionWeatherMap: Record<string, string> = {
  'Napa': 'napa',
  'Sonoma County': 'sonoma',
  'Healdsburg': 'healdsburg',
  'Temecula Valley': 'temecula',
  'Paso Robles': 'paso_robles',
  'Santa Barbara': 'santa_barbara',
  'Lodi': 'lodi',
  'Monterey County': 'monterey',
  'Livermore Valley': 'livermore',
  'Ramona': 'ramona',
  'Santa Cruz Mountains': 'santa_cruz',
};

interface RegionWeatherWidgetProps {
  regionName: string;
}

export default function RegionWeatherWidget({ regionName }: RegionWeatherWidgetProps) {
  const weatherSlug = regionWeatherMap[regionName];

  if (!weatherSlug) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-amber-50 p-6 rounded-lg border-2 border-blue-200 mb-12">
      <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">
        🌤️ Climate & Best Wedding Months
      </h2>
      <p className="text-gray-700 mb-4 text-sm">
        Understanding weather patterns helps you plan the perfect date. {regionName} experiences distinct seasons that affect outdoor ceremonies and photography.
      </p>
      <Link href={`/tools/wedding-weather#${weatherSlug}`}>
        <div className="bg-white p-4 rounded-lg border border-blue-300 hover:shadow-md transition cursor-pointer">
          <p className="font-semibold text-[#6B3E2E] mb-2">View {regionName} Weather Guide</p>
          <p className="text-sm text-gray-600">
            See month-by-month temperatures, rainfall, and harvest season timing →
          </p>
        </div>
      </Link>
    </div>
  );
}
