import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: '#6B3E2E',
        cream: '#FAF8F3',
        gold: '#D4A574',
      },
      fontFamily: {
        serif: 'var(--font-crimson)',
        outfit: 'var(--font-outfit)',
      },
    },
  },
  plugins: [],
};
export default config;
