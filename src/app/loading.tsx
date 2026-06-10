export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen bg-paper text-black items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-5xl tracking-widest animate-pulse mb-6 text-black">VALO</div>
        <div className="w-48 h-px bg-divider mx-auto overflow-hidden rounded-full">
          <div className="h-full bg-gold animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: "40%" }} />
        </div>
        <p className="font-serif text-sm text-gray-400 mt-6">Loading atelier</p>
      </div>
    </div>
  );
}
