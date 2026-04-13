import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Jess Ouican | California Winery Weddings',
  description:
    'Meet Jess Ouican, founder of California Winery Weddings. Learn how her own Sonoma winery wedding inspired this directory for couples planning their perfect venue.',
  openGraph: {
    title: 'About Jess Ouican | California Winery Weddings',
    description:
      'Meet Jess Ouican, founder of California Winery Weddings. Learn how her own Sonoma winery wedding inspired this directory.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back Home
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">About Jess Ouican</h1>
          <p className="text-xl text-gray-700">Founder, California Winery Weddings</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Image */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/jessouican.png"
                  alt="Jess Ouican, founder of California Winery Weddings"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Jess at her Sonoma winery wedding, 2023
              </p>
            </div>

            {/* Bio */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-4">
                  The Wine Country Bride Who Built a Directory
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  In 2023, I got married in Sonoma County. Like every couple planning a winery wedding in California, I
                  faced a seemingly simple question: <em>Where do we actually get married?</em>
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">The Problem</h3>
                <p className="text-gray-700 leading-relaxed">
                  I spent weeks searching. Google Maps didn't know which wineries actually hosted weddings. Websites were
                  scattered and outdated. Wedding blogs listed 5-10 venues per region, but there are literally hundreds
                  across California. I'd find a winery I loved, call them, and hear: "We don't do events" or "We stopped
                  doing weddings during the pandemic." Wasted time, every time.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">My Sonoma Wedding</h3>
                <p className="text-gray-700 leading-relaxed">
                  Eventually, I found <strong>the right venue</strong> — a small family-owned winery in Sonoma that felt
                  like a secret we'd discovered. The ceremony was perfect. Our guests talked about the wine, the setting,
                  the warm hospitality. It was exactly what we wanted.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  But I remember thinking: <em>"Why was this so hard to find?"</em> And: <em>"How many couples never find
                  this place because it's not on anyone's list?"</em>
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">Why I Built This</h3>
                <p className="text-gray-700 leading-relaxed">
                  After my wedding, I started researching. I wanted to build a comprehensive directory — not just the
                  famous venues, but every serious winery and vineyard in California that hosts weddings. The real ones.
                  The hidden gems. The emerging spots. All verified, all with real reviews and data.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  California Winery Weddings is for couples who know wine country, who want to get married somewhere
                  meaningful, and who deserve a real resource to find it.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">What I Know</h3>
                <ul className="text-gray-700 leading-relaxed space-y-2 list-disc list-inside">
                  <li>California has wine country in every region — not just Napa</li>
                  <li>Small wineries are often better for weddings than massive ones</li>
                  <li>Real couples need real data, not marketing fluff</li>
                  <li>The best venue match isn't always the most famous (it's the right fit)</li>
                  <li>Wine country is for everyone — Temecula, Paso Robles, Santa Cruz, Mendocino, not just Napa</li>
                </ul>
              </div>

              <div className="bg-[#F5E6D3] p-6 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold text-[#6B3E2E]">Today:</span> California Winery Weddings is a verified
                  directory of 435+ wineries across California, with real reviews, ratings, and wedding information. My
                  goal is to help couples find their perfect venue — and to help wineries connect with couples who truly
                  want to get married at their place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#F5E6D3] py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-12 text-center">What This Directory Stands For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-[#8B5A3C]">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">🍷 Verified Data</h3>
              <p className="text-gray-700">
                Every winery is verified. Every review is real. No puffery, no marketing speak — just the truth about
                where you can actually get married in California.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#8B5A3C]">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">🤝 Real Recommendations</h3>
              <p className="text-gray-700">
                I talk to couples. I listen to what matters. This directory reflects what actually helps couples find the
                right venue — not what wineries pay to be featured.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#8B5A3C]">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">💚 Authentic California</h3>
              <p className="text-gray-700">
                Wine country is everywhere in California. This directory celebrates the full breadth — from the Bay Area to
                Southern California, coast to inland valleys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-6">Ready to Find Your Venue?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse 435+ verified California wineries. Start with a region, explore by ratings and reviews, or search for your
            perfect match.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Explore Wineries →
          </Link>
        </div>
      </section>
    </div>
  );
}
