import { Metadata } from 'next';

export function generateWinerySEO(title: string, region: string, rating: number): Metadata {
  const description = `${title} - Winery wedding venue in ${region}, California. ${rating}/5 stars. Book your dream wine country wedding.`;
  
  return {
    title: `${title} - Winery Wedding Venue in ${region} | California Winery Weddings`,
    description,
    openGraph: {
      title: `${title} - Winery Wedding Venue in ${region}`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Winery Wedding Venue in ${region}`,
      description,
    },
  };
}

export function generateRegionSEO(region: string, count: number): Metadata {
  const description = `Discover ${count} wineries and vineyards for weddings in ${region}, California. Compare venues, read reviews, and book your perfect wine country wedding.`;
  
  return {
    title: `Winery Wedding Venues in ${region}, California | ${count} Options`,
    description,
    openGraph: {
      title: `Winery Wedding Venues in ${region}, California`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Winery Wedding Venues in ${region}`,
      description,
    },
  };
}

export const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'California Winery Weddings',
  url: 'https://www.californiawineryweddings.com',
  description: 'Discover 1,300+ California wineries and vineyards for your perfect wedding venue.',
};

export function generateWinerySchema(winery: any, region: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'WeddingVenue'],
    name: winery.title,
    description: `${winery.title} - Wedding venue winery in ${region}, California`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: winery.address,
      addressLocality: winery.city,
      addressRegion: 'California',
      postalCode: winery.postalCode,
      addressCountry: 'US',
    },
    telephone: winery.phone,
    url: winery.website,
    image: winery.imageUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: winery.totalScore,
      reviewCount: winery.reviewsCount,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: winery.location.lat,
      longitude: winery.location.lng,
    },
  };
}
