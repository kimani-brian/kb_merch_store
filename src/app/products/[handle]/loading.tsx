export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-48 bg-brand-gray-dark" />
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="hidden flex-col gap-3 sm:flex">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-20 border-2 border-brand-gray-dark bg-brand-gray-dark" />
            ))}
          </div>
          <div className="aspect-square w-full border-2 border-brand-gray-dark bg-brand-gray-dark" />
        </div>

        {/* Purchase block skeleton */}
        <div className="space-y-6">
          <div className="h-4 w-40 bg-brand-gray-dark" />
          <div className="h-14 w-full bg-brand-gray-dark" />
          <div className="h-6 w-32 bg-brand-gray-dark" />
          <div className="space-y-2 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-14 border-2 border-brand-gray-dark bg-brand-gray-dark" />
            ))}
          </div>
          <div className="h-14 w-full border-2 border-brand-gray-dark bg-brand-gray-dark" />
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full border-2 border-brand-gray-dark bg-brand-gray-dark" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
