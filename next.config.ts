import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimize for static generation
  staticPageGenerationTimeout: 300,
  
  // Expose environment variables needed during build
  env: {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },

  // Configure Image optimization for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/gps-cs-s/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    // Disable static imports to allow dynamic external images
    disableStaticImages: false,
    // Cache images for 365 days
    minimumCacheTTL: 31536000,
  },
  
  // Ensure public files are accessible
  headers: async () => [
    {
      source: '/data/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};

export default nextConfig;
