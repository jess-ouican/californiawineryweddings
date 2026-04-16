import { loadWineries } from '@/lib/data';
import { getAllRegions, slugify } from '@/lib/utils';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const wineries = await loadWineries();
    const regions = getAllRegions(wineries);
    
    // Get blog posts
    const blogDir = path.join(process.cwd(), 'public/blog-content');
    const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.json'));
    
    // Build sitemap XML
    const baseUrl = 'https://www.californiawineryweddings.com';
    
    // Static pages
    const staticPages = [
      { path: '',            freq: 'weekly',  pri: '1.0' },
      { path: '/about',      freq: 'monthly', pri: '0.8' },
      { path: '/map',        freq: 'weekly',  pri: '0.8' },
      { path: '/directory',  freq: 'weekly',  pri: '0.8' },
      { path: '/blog',       freq: 'weekly',  pri: '0.9' },
      { path: '/tools',                freq: 'monthly', pri: '0.8' },
      { path: '/tools/budget-estimator',   freq: 'monthly', pri: '0.8' },
      { path: '/tools/wine-calculator',    freq: 'monthly', pri: '0.8' },
      { path: '/tools/shuttle-calculator', freq: 'monthly', pri: '0.8' },
      { path: '/tools/wedding-weather',    freq: 'monthly', pri: '0.8' },
      { path: '/tools/wine-pairing',       freq: 'monthly', pri: '0.8' },
      { path: '/tools/wedding-timeline',   freq: 'monthly', pri: '0.8' },
      { path: '/tools/venue-comparison',   freq: 'monthly', pri: '0.8' },
      { path: '/tools/vendor-tipping',     freq: 'monthly', pri: '0.8' },
      { path: '/tools/seating-planner',    freq: 'monthly', pri: '0.8' },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    staticPages.forEach(({ path, freq, pri }) => {
      sitemap += `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>
`;
    });


    // Add region pages
    regions.forEach(region => {
      sitemap += `  <url>
    <loc>${baseUrl}/regions/${region.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add winery pages
    wineries.forEach(winery => {
      sitemap += `  <url>
    <loc>${baseUrl}/wineries/${slugify(winery.title)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Add blog posts
    blogFiles.forEach(file => {
      const slug = file.replace('.json', '');
      sitemap += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
