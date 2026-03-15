import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 border-b border-slate-100 bg-white" />
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="h-14 bg-slate-100 rounded-2xl shimmer-bg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl shimmer-bg" />
          ))}
        </div>
      </div>
    </div>
  );
}
