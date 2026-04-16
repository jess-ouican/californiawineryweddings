import { Suspense } from 'react';
import SeatingView from './SeatingView';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-[#6B3E2E] font-serif text-xl">Loading seating plan…</div>}>
      <SeatingView />
    </Suspense>
  );
}
