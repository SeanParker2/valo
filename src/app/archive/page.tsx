"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar, SidebarButton } from "@/components/organisms/Sidebar";
import InfoHover from "@/components/molecules/InfoHover";
import { Search, Filter, X } from "lucide-react";
import { ARCHIVE_ITEMS } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Series 01", "Series 02", "Collab", "Concept", "One-off"];

export default function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredItems = activeFilter === "All" 
    ? ARCHIVE_ITEMS 
    : ARCHIVE_ITEMS.filter(item => item.series.includes(activeFilter) || item.type.includes(activeFilter));

  return (
    <div className="flex min-h-screen bg-atelier-bg text-atelier-black">
      <Sidebar variant="archive">
        <div className="w-px h-20 bg-[#e5e0d8] mb-12"></div>
        <SidebarButton 
          icon={isSearchOpen ? X : Search} 
          label={isSearchOpen ? "CLOSE" : "SEARCH"} 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          active={isSearchOpen}
        />
        <SidebarButton icon={Filter} label="FILTER" />
        <div className="w-px h-20 bg-[#e5e0d8] mt-12"></div>
      </Sidebar>

      <main className="pl-28 md:pl-32 flex-1 w-full flex flex-col">
        {/* Header */}
        <header className="px-8 md:px-16 py-12 md:py-20 border-b border-[#e5e0d8] flex flex-col md:flex-row md:items-end justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-7xl text-atelier-black mb-4"
            >
              The Archive
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-gray-600 tracking-wide max-w-md"
            >
              A curated registry of all VALO creations. From <InfoHover term="prototypes" definition="Experimental casts used to test articulation and resin flow." variant="light" /> to final releases.
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 relative z-10">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "transition-all duration-300 relative",
                  activeFilter === filter ? "text-atelier-black" : "hover:text-atelier-black"
                )}
              >
                {filter}
                {activeFilter === filter && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-atelier-black"
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 bg-white z-20 flex items-center px-8 md:px-16"
              >
                <Search className="w-8 h-8 text-gray-300 mr-4" />
                <input 
                  type="text" 
                  placeholder="Search by ID, Name, or Series..." 
                  className="w-full h-full bg-transparent text-3xl font-serif text-atelier-black outline-none placeholder:text-gray-200"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Grid */}
        <motion.div 
          layout
          className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 min-h-[50vh]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-3/4 w-full mb-6 overflow-hidden bg-gray-100">
                  <Image 
                    src={item.image}  
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                  
                  {/* Overlay Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase border border-gray-100">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-gray-200 pb-4 group-hover:border-atelier-black transition-colors duration-300">
                  <div>
                    <h3 className="font-serif text-3xl text-atelier-black mb-1 group-hover:italic transition-all">{item.name}</h3>
                    <p className="font-sans text-xs tracking-widest text-gray-500 uppercase">{item.series}</p>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{item.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <footer className="px-8 md:px-16 py-12 text-center border-t border-[#e5e0d8] mt-auto">
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            {filteredItems.length} Records Found
          </span>
        </footer>
      </main>
    </div>
  );
}
