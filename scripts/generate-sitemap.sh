#!/bin/bash
# Called during Vercel build to generate public/sitemap.xml

echo "Generating sitemap.xml..."

node -e "
const fs = require('fs');

const wineries = JSON.parse(fs.readFileSync('./public/data/wineries.json', 'utf-8'));
const baseUrl = 'https://www.californiawineryweddings.com';

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

const regionMap = {};
wineries.forEach(w => {
  if (w.region && w.region !== 'Unknown' && w.region !== 'Unknown Region') {
    if (!regionMap[w.region]) regionMap[w.region] = slugify(w.region);
  }
});

const blogDir = './public/blog-content';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));

const staticPages = [
  { path: '',                          freq: 'weekly',  pri: '1.0' },
  { path: '/about',                    freq: 'monthly', pri: '0.8' },
  { path: '/map',                      freq: 'weekly',  pri: '0.8' },
  { path: '/directory',                freq: 'weekly',  pri: '0.8' },
  { path: '/blog',                     freq: 'weekly',  pri: '0.9' },
  { path: '/tools',                    freq: 'monthly', pri: '0.8' },
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

const url = (loc, freq, pri) => \`  <url>\n    <loc>\${loc}</loc>\n    <changefreq>\${freq}</changefreq>\n    <priority>\${pri}</priority>\n  </url>\n\`;

let sitemap = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n';

staticPages.forEach(p => { sitemap += url(baseUrl + p.path, p.freq, p.pri); });
Object.values(regionMap).forEach(slug => { sitemap += url(\`\${baseUrl}/regions/\${slug}\`, 'weekly', '0.8'); });
wineries.forEach(w => { sitemap += url(\`\${baseUrl}/wineries/\${slugify(w.title)}\`, 'monthly', '0.7'); });
blogFiles.forEach(f => { sitemap += url(\`\${baseUrl}/blog/\${f.replace('.json','')}\`, 'monthly', '0.7'); });

sitemap += '</urlset>';
fs.writeFileSync('./public/sitemap.xml', sitemap);

const total = staticPages.length + Object.keys(regionMap).length + wineries.length + blogFiles.length;
console.log('✅ sitemap.xml generated:', total, 'URLs');
console.log('   Static:', staticPages.length, '| Regions:', Object.keys(regionMap).length, '| Wineries:', wineries.length, '| Blog:', blogFiles.length);
"
