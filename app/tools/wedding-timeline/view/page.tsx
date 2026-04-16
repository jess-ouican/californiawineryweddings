import { Suspense } from 'react';
import TimelineView from './TimelineView';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-[#6B3E2E] font-serif text-xl">Loading timeline…</div>}>
      <TimelineView />
    </Suspense>
  );
}
