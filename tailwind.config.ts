import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#6B3E2E',
          light: '#8B5A3C',
          dark: '#5a3422',
        },
        cream: '#FAF8F3',
        gold: '#D4A574',
      },
      fontFamily: {
        serif: 'var(--font-crimson)',
        outfit: 'var(--font-outfit)',
      },
    },
  },
  safelist: [
    'text-wine',
    'bg-wine',
    'hover:bg-wine',
    'text-[#6B3E2E]',
    'bg-[#6B3E2E]',
    'hover:bg-[#5a3422]',
    'focus:ring-[#6B3E2E]',
    'border-[#6B3E2E]',
    'hover:text-[#6B3E2E]',
    'text-[#FAF8F3]',
    'bg-[#FAF8F3]',
    'text-[#D4A574]',
    'from-[#FAF8F3]',
    'to-[#F5E6D3]',
    'from-[#F5E6D3]',
    'to-[#F0D5B8]',
    'from-[#6B3E2E]',
    'to-[#8B5A3C]',
  ],
  plugins: [],
};

export default config;
