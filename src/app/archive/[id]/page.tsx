"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/organisms/Sidebar";
import { ArrowLeft, Share2, ShoppingBag } from "lucide-react";
import { ARCHIVE_ITEMS } from "@/lib/data";
import { motion } from "framer-motion";
import InfoHover from "@/components/molecules/InfoHover";

export default function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = ARCHIVE_ITEMS.find((i) => i.id === id) || null;

  if (!item) {
    return (
      <div className="flex min-h-screen bg-atelier-bg text-atelier-black items-center justify-center">
        <Sidebar variant="archive" />
        <p className="font-mono text-xs tracking-widest animate-pulse">SEARCHING ARCHIVES...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-atelier-bg text-atelier-black">
      <Sidebar variant="archive" />

      <main className="pl-28 md:pl-32 flex-1 w-full flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Left: Visuals */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full lg:w-1/2 h-1/2 lg:h-full relative bg-[#e5e0d8] p-8 md:p-12 lg:p-20 flex items-center justify-center"
        >
          <div className="relative w-full h-full shadow-2xl">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          
          <Link 
            href="/archive"
            className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-atelier-black transition-colors z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </Link>
        </motion.div>

        {/* Right: Specs & Narrative */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto custom-scrollbar bg-atelier-bg relative">
          <div className="p-12 md:p-20 lg:p-24 space-y-12">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 border border-atelier-black rounded-full text-[10px] font-bold tracking-widest uppercase">
                  {item.type}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  REF: VALO-{item.series.replace(" ", "-").toUpperCase()}-{item.id}
                </span>
              </div>
              <h1 className="font-serif text-6xl md:text-8xl text-atelier-black mb-2">{item.name}</h1>
              <p className="font-sans text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                {item.series} Collection • {item.year}
              </p>
            </div>

            <div className="w-full h-px bg-[#d6d3cd]"></div>

            {/* Narrative */}
            <div className="prose prose-stone">
              <p className="font-serif text-xl leading-relaxed text-gray-800">
                A study in <InfoHover term="equilibrium" definition="The state of physical balance; specifically referring to the doll's ability to stand unaided." variant="light" />. 
                {item.name} represents the culmination of our research into {item.series.toLowerCase()} aesthetics. 
                Cast in our signature UV-resistant resin, this sculpt features enhanced joint mobility and a refined silhouette.
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Sculpt Material</h3>
                <p className="font-serif text-lg">French Resin (White Skin)</p>
              </div>
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Height</h3>
                <p className="font-serif text-lg">65.5 cm (SD Scale)</p>
              </div>
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Wig Size</h3>
                <p className="font-serif text-lg">8-9 inch</p>
              </div>
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Eyes</h3>
                <p className="font-serif text-lg">14mm Low Dome</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-8">
              <button className="flex-1 bg-atelier-black text-white py-4 font-sans text-xs font-bold tracking-[0.2em] hover:bg-atelier-gold transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                INQUIRE AVAILABILITY
              </button>
              <button className="w-16 border border-gray-300 flex items-center justify-center hover:border-atelier-black transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
