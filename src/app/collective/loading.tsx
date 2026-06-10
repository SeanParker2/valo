export default function CollectiveLoading() {
  return (
    <div className="flex min-h-screen bg-paper text-black">
      <div className="pl-28 md:pl-32 w-full px-8 md:px-16 py-12">
        <div className="mb-12">
          <div className="h-12 w-64 bg-gray-200 animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-100 animate-pulse" />
        </div>
        <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <div className={`${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"} bg-gray-200 animate-pulse`} />
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                <div>
                  <div className="h-3 w-24 bg-gray-100 animate-pulse" />
                  <div className="h-2 w-16 bg-gray-50 animate-pulse mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
