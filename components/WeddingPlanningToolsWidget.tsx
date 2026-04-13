import Link from 'next/link';

export default function WeddingPlanningToolsWidget() {
  return (
    <div className="bg-gradient-to-b from-[#F5E6D3] to-[#E8D4B8] p-6 rounded-lg border-2 border-[#8B5A3C]">
      <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">
        🎓 Wedding Planning Tools
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        Use our free calculators to plan every detail of your celebration:
      </p>
      <div className="space-y-3">
        <Link href="/tools/wine-calculator">
          <div className="bg-white hover:bg-gray-50 p-3 rounded border border-gray-200 cursor-pointer transition">
            <p className="font-semibold text-sm text-[#6B3E2E]">🍇 Wine Calculator</p>
            <p className="text-xs text-gray-600">Bottles & costs</p>
          </div>
        </Link>
        <Link href="/tools/shuttle-calculator">
          <div className="bg-white hover:bg-gray-50 p-3 rounded border border-gray-200 cursor-pointer transition">
            <p className="font-semibold text-sm text-[#6B3E2E]">🚐 Shuttle Calculator</p>
            <p className="text-xs text-gray-600">Transportation</p>
          </div>
        </Link>
        <Link href="/tools/wedding-weather">
          <div className="bg-white hover:bg-gray-50 p-3 rounded border border-gray-200 cursor-pointer transition">
            <p className="font-semibold text-sm text-[#6B3E2E]">🌤️ Weather Guide</p>
            <p className="text-xs text-gray-600">Month-by-month</p>
          </div>
        </Link>
      </div>
      <Link href="/tools">
        <p className="text-xs text-[#6B3E2E] hover:underline font-semibold mt-4 text-center">
          View All Tools →
        </p>
      </Link>
    </div>
  );
}
