import { Metadata } from 'next';

export function generateWinerySEO(title: string, region: string | null, rating: number): Metadata {
  const regionText = region ? ` in ${region}` : '';
  const description = `${title} - Winery wedding venue${regionText}, California. ${rating}/5 stars. Book your dream wine country wedding.`;
  
  return {
    title: `${title} - Winery Wedding Venue${regionText} | California Winery Weddings`,
    description,
    openGraph: {
      title: `${title} - Winery Wedding Venue${regionText}`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Winery Wedding Venue${regionText}`,
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

export function generateWinerySchema(winery: any, region: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'WeddingVenue'],
    name: winery.title,
    description: region 
      ? `${winery.title} - Wedding venue winery in ${region}, California`
      : `${winery.title} - Wedding venue winery in California`,
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

/**
 * Generate BreadcrumbList schema for navigation hierarchy
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage schema for region pages
 */
export function generateFAQSchema(region: string, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does a winery wedding cost in ${region}, California?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Winery wedding costs in ${region} vary widely depending on the venue, guest count, and season. Most ${region} wineries charge venue rental fees ranging from $1,500 to $5,000+, with additional costs for catering, beverages, and services. Many wineries offer all-inclusive packages that can range from $5,000 to $25,000+ total. Contact individual venues for detailed pricing and packages.`,
        },
      },
      {
        '@type': 'Question',
        name: `How many winery wedding venues are in ${region}, California?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are ${count} wedding-friendly wineries and vineyards in ${region}, California available on California Winery Weddings. Each venue offers unique settings, from intimate estate gardens to grand ballrooms, accommodating groups from 20 to 300+ guests.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best time of year to have a winery wedding in ${region}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best time for a winery wedding in ${region} is typically late spring (May-June) or early fall (September-October) when the weather is pleasant and the vineyard views are stunning. Summer can be hot, and winter may have limited outdoor options. Check with your chosen venue for their peak seasons and availability.`,
        },
      },
    ],
  };
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(
  title: string,
  description: string,
  publishedDate: string,
  updatedDate?: string,
  author = 'California Winery Weddings'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://www.californiawineryweddings.com',
    },
    datePublished: publishedDate,
    dateModified: updatedDate || publishedDate,
    publisher: {
      '@type': 'Organization',
      name: 'California Winery Weddings',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.californiawineryweddings.com/logo.png',
      },
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://www.californiawineryweddings.com/og-image.jpg',
      width: 1200,
      height: 630,
    },
  };
}
