"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopBar } from "@/components/organisms/TopBar";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";
import { BLUR_PLACEHOLDER } from "@/lib/utils/blur";
import type { Doll } from "@/types";

const FILTERS = ["All", "Series 01", "Series 02", "Collab", "Concept", "One-off"];

interface ArchiveClientProps {
  initialItems: Doll[];
}

export default function ArchiveClient({ initialItems }: ArchiveClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "year" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredItems = useMemo(() => {
    let items = initialItems;
    if (activeFilter !== "All") {
      items = items.filter((item) => item.series === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.series.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
    }
    // Sort
    items = [...items].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "year") cmp = a.year.localeCompare(b.year);
      else if (sortBy === "price") cmp = a.pricing.basePrice - b.pricing.basePrice;
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return items;
  }, [activeFilter, searchQuery, sortBy, sortOrder, initialItems]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialItems.length };
    for (const item of initialItems) {
      counts[item.series] = (counts[item.series] || 0) + 1;
    }
    return counts;
  }, [initialItems]);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block">
        <Sidebar variant="archive" />
      </div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="sticky top-14 z-40 bg-paper/95 backdrop-blur-md border-b border-divider px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
          <div>
            <h1 className="section-title text-5xl md:text-6xl lg:text-7xl text-black mb-4">The Archive</h1>
            <p className="font-serif text-lg text-gray-500 max-w-lg">
              Every sculpt tells a story. Browse our collection of artisan ball-jointed dolls, each cast in French resin and engineered for fluid posing.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={cn(
                    "px-4 py-2 text-[11px] font-bold tracking-widest transition-all border-b",
                    activeFilter === filter
                      ? "border-black text-black"
                      : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                  )}
                >
                  {filter.toUpperCase()}
                  {filterCounts[filter] !== undefined && (
                    <span className="ml-1 text-[10px] text-gray-400">({filterCounts[filter]})</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery("");
              }}
              className={cn(
                "p-2 transition-colors",
                isSearchOpen ? "bg-black text-white" : "hover:bg-cream"
              )}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "year" | "price")}
                className="bg-transparent text-[11px] font-bold tracking-widest border-b border-transparent text-gray-400 hover:text-black cursor-pointer outline-none"
              >
                <option value="name">NAME</option>
                <option value="year">YEAR</option>
                <option value="price">PRICE</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
                aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-divider"
            >
              <div className="px-8 md:px-16 py-6 flex items-center gap-4">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search dolls by name, series, or type..."
                  aria-label="Search dolls"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-brand text-lg"
                  autoFocus
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} aria-label="Close search">
                  <X className="w-4 h-4 text-gray-400 hover:text-black" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-8 md:px-16 py-16">
          <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/archive/${item.id}`} className="break-inside-avoid group block" data-cursor="view">
                    <div className="card-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={800}
                        height={1000}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className={cn(
                          "w-full h-auto transition-transform duration-700 group-hover:scale-105",
                          index % 3 === 1 && "md:mt-16"
                        )}
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FavoriteButton
                          isFavorite={isFavorite(item.id)}
                          onToggle={() => toggleFavorite(item.id)}
                          size="sm"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 px-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-2xl text-black group-hover:text-gold transition-colors duration-300">
                          {item.name}
                        </h3>
                        <span className="font-mono text-[10px] tracking-widest text-gray-400">VALO-{item.id}</span>
                      </div>
                      <p className="font-sans text-[11px] text-gray-500 tracking-widest uppercase mt-1.5">
                        {item.series} &bull; {item.year}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <EmptyState
              type="search"
              query={searchQuery}
              onReset={() => { setActiveFilter("All"); setSearchQuery(""); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
