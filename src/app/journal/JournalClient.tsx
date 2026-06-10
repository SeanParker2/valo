"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopBar } from "@/components/organisms/TopBar";
import { cn } from "@/lib/utils";
import type { JournalArticle } from "@/types/journal";

const CATEGORIES = ["All", "Craft", "Studio", "Material", "Community"] as const;

interface JournalClientProps {
  articles: JournalArticle[];
}

export default function JournalClient({ articles }: JournalClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-12">
          <span className="section-label block mb-4">FROM THE ATELIER</span>
          <h1 className="section-title text-6xl md:text-7xl lg:text-8xl mb-6">Journal</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed mb-8">
            Stories from the workbench — material research, engineering breakthroughs, collector profiles, and the quiet obsession behind every VALO doll.
          </p>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={cn(
                  "px-4 py-2 text-xs font-bold tracking-widest transition-all border-b",
                  activeCategory === cat
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="px-8 md:px-16 pb-24">
          {/* Featured Article */}
          {featured && (
            <Link href={`/journal/${featured.slug}`} className="group block mb-24" data-cursor="view">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/3] bg-[#e5e0d8] overflow-hidden"
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="font-mono text-[10px] tracking-widest text-gold uppercase">{featured.category}</span>
                  <h2 className="section-title text-4xl md:text-5xl mt-4 mb-4 group-hover:text-gold transition-colors">
                    {featured.title}
                  </h2>
                  <p className="font-serif text-lg text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[10px] tracking-widest text-gray-400 uppercase">{featured.author}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="font-mono text-[10px] text-gray-400">{featured.readTime}</span>
                  </div>
                </motion.div>
              </div>
            </Link>
          )}

          {/* Article Grid */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {rest.map((article, index) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/journal/${article.slug}`} className="group block" data-cursor="view">
                    <div className="relative aspect-[4/3] bg-[#e5e0d8] overflow-hidden mb-6">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-gold uppercase">{article.category}</span>
                    <h3 className="section-title text-2xl md:text-3xl mt-3 mb-3 group-hover:text-gold transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-serif text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-[10px] tracking-widest text-gray-400 uppercase">{article.author}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="font-mono text-[10px] text-gray-400">{article.readTime}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filteredArticles.length === 0 && (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-gray-400 mb-6">No articles in this category</p>
              <button
                onClick={() => setActiveCategory("All")}
                className="btn-ghost"
              >
                VIEW ALL
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
