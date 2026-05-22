// PageSkeleton — drop-in loading placeholder that matches page layout
// Prevents layout shift while auth/data resolves
// Usage: if (isLoading) return <PageSkeleton />

export default function PageSkeleton() {
  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 animate-pulse">
      {/* Header bar */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />
      {/* Card rows */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-6 rounded-2xl bg-gray-100 p-6 space-y-3">
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

// DarkPageSkeleton — for pages with dark backgrounds (e.g. services)
export function DarkPageSkeleton() {
  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded-lg mb-8" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-6 rounded-2xl bg-white/5 p-6 space-y-3">
          <div className="h-5 w-1/3 bg-white/10 rounded" />
          <div className="h-4 w-2/3 bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
