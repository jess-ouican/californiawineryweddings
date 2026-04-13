'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6B3E2E] to-[#8B5A3C] rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-xl font-bold">🍷</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#6B3E2E]">
                California Winery Weddings
              </h1>
              <p className="text-xs text-gray-600">Find Your Perfect Venue</p>
            </div>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#6B3E2E] font-medium text-sm transition"
            >
              Home
            </Link>
            <Link
              href="/#regions"
              className="text-gray-700 hover:text-[#6B3E2E] font-medium text-sm transition"
            >
              Regions
            </Link>
            <Link
              href="/tools"
              className="text-gray-700 hover:text-[#6B3E2E] font-medium text-sm transition"
            >
              Tools
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-[#6B3E2E] font-medium text-sm transition"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
