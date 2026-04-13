import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2D1810] text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">
              California Winery Weddings
            </h3>
            <p className="text-sm text-gray-300">
              Discover 435+ verified California wineries and vineyards for your perfect wedding day.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#regions" className="hover:text-white transition">
                  Regions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Wineries</h4>
            <p className="text-sm text-gray-300 mb-3">
              Get your venue featured. Premium listings starting at $49/month.
            </p>
            <a
              href="mailto:hello@californiawineryweddings.com"
              className="text-[#D4A574] hover:text-white transition text-sm font-medium"
            >
              Get Listed →
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} California Winery Weddings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
