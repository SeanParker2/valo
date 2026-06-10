export default function ArchiveDetailLoading() {
  return (
    <div className="flex min-h-screen bg-paper text-black">
      <div className="flex-1 flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#e5e0d8] animate-pulse" />
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-12 md:p-20 lg:p-24 space-y-8">
          <div className="h-8 w-24 bg-gray-200 animate-pulse" />
          <div className="h-16 w-64 bg-gray-200 animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 animate-pulse" />
          <div className="h-px bg-gray-100" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-gray-100 animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
