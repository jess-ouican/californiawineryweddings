import Link from 'next/link';

export const metadata = {
  title: 'Verification Successful | California Winery Weddings',
  description: 'Your winery listing has been verified successfully.',
};

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-[#6B3E2E] mb-4">
          Verified!
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Your winery listing has been verified successfully. Your "Verified Owner" badge is now active.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-green-800">
            <strong>What's next?</strong>
          </p>
          <ul className="text-sm text-green-800 mt-3 space-y-2 text-left">
            <li>✓ Your "Verified Owner" badge is now displayed on your listing</li>
            <li>✓ Your winery appears at the top of region pages</li>
            <li>✓ Couples see you're an official verified venue</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[#6B3E2E] text-white py-3 rounded-lg hover:bg-[#5a3422] transition font-semibold"
          >
            Back to Home
          </Link>
          <Link
            href="/directory"
            className="block w-full border-2 border-[#6B3E2E] text-[#6B3E2E] py-3 rounded-lg hover:bg-[#6B3E2E] hover:text-white transition font-semibold"
          >
            Browse All Wineries
          </Link>
        </div>
      </div>
    </div>
  );
}
