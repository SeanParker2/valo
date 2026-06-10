"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopBar } from "@/components/organisms/TopBar";
import { ArrowLeft, Clock, User } from "lucide-react";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import type { JournalArticle } from "@/types/journal";

interface JournalDetailProps {
  article: JournalArticle | null;
}

export default function JournalDetail({ article }: JournalDetailProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!article) {
    return (
      <div className="flex min-h-screen bg-paper text-black items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <p className="font-serif text-3xl text-gray-400 mb-4">Article not found</p>
          <Link href="/journal" className="text-xs font-bold tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-colors">
            BACK TO JOURNAL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <ReadingProgress />

      <main className="pt-14 lg:pl-32 w-full">
        {/* Hero */}
        <div className="relative h-[50vh] overflow-hidden">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-paper" />
          <Link
            href="/journal"
            className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors z-20 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Journal
          </Link>
        </div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto px-8 md:px-16 py-16"
        >
          <span className="font-mono text-[10px] tracking-widest text-gold uppercase">{article.category}</span>
          <h1 className="section-title text-5xl md:text-6xl lg:text-7xl mt-4 mb-4">{article.title}</h1>
          <p className="font-serif text-xl text-gray-500 italic mb-8">{article.subtitle}</p>

          <div className="flex items-center gap-6 mb-12 pb-8 border-b border-divider">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="font-sans text-[10px] tracking-widest text-gray-400 uppercase">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="font-mono text-[10px] text-gray-400">{article.readTime}</span>
            </div>
            <span className="font-mono text-[10px] text-gray-400">{article.date}</span>
          </div>

          <div className="space-y-8">
            {article.content.map((block, i) => {
              const isFirstParagraph = block.type === "paragraph" && article.content.slice(0, i).every((b) => b.type !== "paragraph");
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={i}
                      className={`font-serif text-xl leading-relaxed text-gray-700 ${
                        isFirstParagraph ? "first-letter:text-6xl first-letter:font-serif first-letter:font-light first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.8] first-letter:text-black" : ""
                      }`}
                    >
                      {block.content}
                    </p>
                  );
                case "heading":
                  return (
                    <h2 key={i} className="section-title text-3xl md:text-4xl mt-12 mb-4">
                      {block.content}
                    </h2>
                  );
                case "quote":
                  return (
                    <blockquote key={i} className="border-l-2 border-gold pl-8 my-12">
                      <p className="font-serif text-2xl md:text-3xl italic text-gray-600 leading-relaxed">
                        &ldquo;{block.content}&rdquo;
                      </p>
                      {block.attribution && (
                        <cite className="block mt-4 section-label not-italic">
                          — {block.attribution}
                        </cite>
                      )}
                    </blockquote>
                  );
                case "divider":
                  return <div key={i} className="w-12 h-px bg-gold my-12" />;
                default:
                  return null;
              }
            })}
          </div>

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-divider flex gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-gray-100 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                #{tag}
              </span>
            ))}
          </div>
        </motion.article>
      </main>
    </div>
  );
}
