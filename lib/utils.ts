import { Winery } from './types';

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function unslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function loadWineries(): Promise<Winery[]> {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/jess-ouican/californiawineryweddings/main/public/data/wineries.json'
    );
    if (!response.ok) throw new Error('Failed to load wineries');
    return await response.json();
  } catch {
    // Fallback for local development
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'public/data/wineries.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  }
}

export function getWineriesByRegion(wineries: Winery[], region: string): Winery[] {
  const normalizedRegion = region.toLowerCase().trim();
  return wineries.filter(
    (w) => w.city.toLowerCase() === normalizedRegion || w.city.toLowerCase().includes(normalizedRegion)
  );
}

export function getTopRegions(wineries: Winery[]): { region: string; count: number; slug: string }[] {
  const regionCounts: Record<string, number> = {};
  
  wineries.forEach((w) => {
    const city = w.city;
    regionCounts[city] = (regionCounts[city] || 0) + 1;
  });

  return Object.entries(regionCounts)
    .map(([region, count]) => ({
      region,
      count,
      slug: slugify(region),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

export function getWineryBySlug(wineries: Winery[], slug: string): Winery | undefined {
  return wineries.find((w) => slugify(w.title) === slug);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
