#!/bin/bash
# This script is called during the Vercel build process to generate sitemap.xml

# Generate the sitemap by calling the API route
echo "Generating sitemap.xml..."

# We'll use a Node script instead to ensure it runs properly
node -e "
const fs = require('fs');
const path = require('path');

// Load winery data
const wineries = JSON.parse(fs.readFileSync('./public/data/wineries.json', 'utf-8'));

// Get regions
const regions = {};
wineries.forEach(w => {
  if (w.region && !regions[w.region]) {
    regions[w.region] = {
      region: w.region,
      slug: w.region.toLowerCase().replace(/\\s+/g, '-'),
      count: 0
    };
  }
  if (w.region) regions[w.region].count++;
});

// Load blog posts
const blogDir = './public/blog-content';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));

// Build sitemap
const baseUrl = 'https://www.califoniawineryweddings.com';
let sitemap = \`<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
  <url>
    <loc>\${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>\${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
\`;

// Add regions
Object.values(regions).forEach(r => {
  sitemap += \`  <url>
    <loc>\${baseUrl}/regions/\${r.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
\`;
});

// Add wineries
wineries.forEach(w => {
  const slug = w.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  sitemap += \`  <url>
    <loc>\${baseUrl}/wineries/\${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
\`;
});

// Add blog posts
blogFiles.forEach(f => {
  const slug = f.replace('.json', '');
  sitemap += \`  <url>
    <loc>\${baseUrl}/blog/\${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
\`;
});

sitemap += \`</urlset>\`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log('✅ sitemap.xml generated with', wineries.length + Object.keys(regions).length + blogFiles.length, 'URLs');
"
