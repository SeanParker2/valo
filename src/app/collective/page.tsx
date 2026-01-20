"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/organisms/Sidebar";
import InfoHover from "@/components/molecules/InfoHover";
import { Upload, Heart, Quote, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const FILTERS = ["TRENDING", "LATEST", "EDITOR'S PICK"];

export default function CollectivePage() {
  const [activeFilter, setActiveFilter] = useState("TRENDING");
  const [likedPosts, setLikedPosts] = useLocalStorage<string[]>("valo-collective-likes", []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => setIsLoadingMore(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-atelier-bg text-atelier-black">
      <Sidebar />

      <main className="pl-28 md:pl-32 w-full">
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 bg-atelier-bg/95 backdrop-blur-md border-b border-[#e5e0d8] px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-atelier-black mb-4">The Collective</h1>
            <p className="font-sans text-sm text-gray-500 tracking-widest uppercase">Curated moments from VALO owners worldwide.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
              {FILTERS.map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300",
                    activeFilter === filter 
                      ? "bg-atelier-black text-white shadow-md" 
                      : "text-gray-500 hover:text-black"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <button className="bg-atelier-gold text-white px-8 py-3 font-sans text-xs font-bold tracking-widest hover:bg-black transition-colors shadow-lg flex items-center gap-2">
              <Upload className="w-4 h-4" /> SUBMIT PHOTO
            </button>
          </div>
        </header>

        {/* --- MASONRY GRID --- */}
        <div className="px-8 md:px-16 py-12">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">

            {/* Item 1 */}
            <div className="break-inside-avoid group relative">
              <div className="relative overflow-hidden rounded-sm shadow-xl cursor-zoom-in">
                <Image 
                  src="/images/texture-01.svg" 
                  alt="Post"
                  width={1200}
                  height={1600}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-8">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike("post-1"); }}
                      className={cn(
                        "p-2 rounded-full backdrop-blur-md transition-colors",
                        likedPosts.includes("post-1") ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white text-white hover:text-black"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", likedPosts.includes("post-1") && "fill-current")} />
                    </button>
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-widest text-white/80 uppercase mb-2 block">Featured Doll</span>
                    <Link href="/archive" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/90 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full transition-all group/btn">
                      <span className="w-2 h-2 rounded-full bg-atelier-gold"></span>
                      <span className="text-xs font-bold text-white group-hover/btn:text-black">Noa / Series 01</span>
                      <ArrowRight className="w-3 h-3 text-white group-hover/btn:text-black" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Image src="/images/avatar-01.svg" width={32} height={32} className="w-8 h-8 rounded-full border border-gray-300" alt="Avatar" />
                  <div>
                    <span className="block text-xs font-bold text-atelier-black">Luna.Stargazer</span>
                    <span className="block text-[10px] text-gray-500 tracking-wider">London, UK</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">❤️ 2.4k</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="break-inside-avoid group relative">
              <div className="relative overflow-hidden rounded-sm shadow-xl cursor-zoom-in">
                <Image 
                  src="/images/texture-02.svg" 
                  alt="Post"
                  width={1200}
                  height={1600}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 left-4 bg-atelier-gold text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase shadow-md">
                  Editor&apos;s Choice
                </div>
              </div>
              <div className="mt-4 px-2">
                 <p className="font-serif italic text-lg text-gray-800 leading-snug">&ldquo;The way the resin catches the morning light is just breathtaking.&rdquo;</p>
                 <div className="mt-3 flex items-center gap-2">
                    <Image src="/images/avatar-02.svg" width={24} height={24} className="w-6 h-6 rounded-full border border-gray-300" alt="Avatar" />
                    <span className="text-xs font-bold text-gray-500">By K.Wong</span>
                 </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="break-inside-avoid group relative">
              <div className="bg-white p-12 border border-gray-200 shadow-lg text-center flex flex-col items-center justify-center aspect-4/5">
                <Quote className="w-8 h-8 text-atelier-gold mb-6 opacity-50" />
                <p className="font-serif text-3xl text-atelier-black leading-relaxed">
                  <InfoHover term="BJD" definition="Ball-Jointed Doll: articulated dolls with spherical joints." variant="light" /> is not just a hobby, it is the <br/> <span className="italic text-gray-500">projection of self</span>.
                </p>
                <div className="w-12 h-px bg-black mt-8 mb-4"></div>
                <span className="text-xs font-bold tracking-widest text-gray-400">DISCUSSION TOPIC</span>
                <button className="mt-6 text-xs border-b border-black pb-1 hover:text-atelier-gold hover:border-atelier-gold transition-colors">
                  JOIN THE THREAD
                </button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="break-inside-avoid group relative">
              <div className="relative overflow-hidden rounded-sm shadow-xl cursor-zoom-in">
                <Image 
                  src="/images/texture-03.svg" 
                  alt="Post"
                  width={1000}
                  height={1400}
                  className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-8">
                  <div className="flex justify-end">
                    <button 
                       onClick={(e) => { e.stopPropagation(); toggleLike("post-4"); }}
                       className={cn(
                         "p-2 rounded-full backdrop-blur-md transition-colors",
                         likedPosts.includes("post-4") ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white text-white hover:text-black"
                       )}
                     >
                       <Heart className={cn("w-5 h-5", likedPosts.includes("post-4") && "fill-current")} />
                     </button>
                  </div>
                  <div className="text-white">
                    <span className="text-[10px] font-bold tracking-widest uppercase block mb-1 text-gray-400">Outfit</span>
                    <span className="font-serif text-xl italic">Vintage Victorian Set</span>
                  </div>
                </div>
              </div>
               <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Image src="/images/avatar-01.svg" width={32} height={32} className="w-8 h-8 rounded-full border border-gray-300" alt="Avatar" />
                  <div>
                    <span className="block text-xs font-bold text-atelier-black">Sarah.Crafts</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">❤️ 856</span>
              </div>
            </div>

            {/* Item 5 */}
            <div className="break-inside-avoid group relative">
              <div className="relative overflow-hidden rounded-sm shadow-xl cursor-zoom-in">
                <Image 
                  src="/images/texture-04.svg" 
                  alt="Post"
                  width={1200}
                  height={800}
                  className="w-full h-auto contrast-125"
                />
              </div>
              <div className="mt-4 px-2">
                 <div className="flex gap-2 mb-2">
                     <span className="px-2 py-1 bg-gray-200 rounded text-[10px] font-bold text-gray-600">#Monochrome</span>
                     <span className="px-2 py-1 bg-gray-200 rounded text-[10px] font-bold text-gray-600">#Sculpt</span>
                 </div>
              </div>
            </div>

          </div>
          
          <div className="flex justify-center mt-20 mb-20">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="border border-atelier-black px-12 py-4 text-xs font-bold tracking-[0.2em] hover:bg-atelier-black hover:text-white transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  LOADING...
                </>
              ) : (
                "LOAD MORE INSPIRATION"
              )}
            </button>
          </div>
          
        </div>

      </main>
    </div>
  );
}
