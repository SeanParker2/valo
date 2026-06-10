"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopBar } from "@/components/organisms/TopBar";
import InfoHover from "@/components/molecules/InfoHover";
import { Upload, Heart, Quote, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Lightbox } from "@/components/ui/Lightbox";
import { SubmitPhotoModal } from "@/components/molecules/SubmitPhotoModal";
import { CommentSection } from "@/components/molecules/CommentSection";
import { BLUR_PLACEHOLDER } from "@/lib/utils/blur";
import type { CommunityPost, CollectiveFilter } from "@/types";

const FILTERS: CollectiveFilter[] = ["TRENDING", "LATEST", "EDITOR'S PICK"];

interface CollectiveClientProps {
  initialPosts: CommunityPost[];
}

export default function CollectiveClient({ initialPosts }: CollectiveClientProps) {
  const [activeFilter, setActiveFilter] = useState<CollectiveFilter>("TRENDING");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useLocalStorage<string[]>("valo-collective-likes", []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPosts.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [initialPosts]);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => (prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]));
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      setAllLoaded(true);
    }, 1500);
  };

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;
    switch (activeFilter) {
      case "EDITOR'S PICK":
        posts = posts.filter((p) => p.badge === "Editor's Choice" || p.type === "discussion");
        break;
      case "LATEST":
        posts = [...posts].reverse();
        break;
    }
    if (activeTag) {
      posts = posts.filter((p) => p.tags?.includes(activeTag));
    }
    return posts;
  }, [activeFilter, activeTag, initialPosts]);

  const photoPosts = filteredPosts.filter((p) => p.type === "photo");
  const discussionPosts = filteredPosts.filter((p) => p.type === "discussion");

  const lightboxImages = useMemo(
    () =>
      photoPosts.map((post) => ({
        src: post.image,
        alt: post.alt,
        author: post.author.name,
        location: post.author.location,
      })),
    [photoPosts]
  );

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="sticky top-14 z-40 bg-paper/95 backdrop-blur-md border-b border-divider px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
          <div>
            <h1 className="section-title text-5xl md:text-6xl lg:text-7xl text-black mb-4">The Collective</h1>
            <p className="font-serif text-lg text-gray-500 max-w-lg">
              Curated moments from VALO owners worldwide. Photographs, stories, and the shared language of resin.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex bg-white rounded-full p-1 border border-divider shadow-sm">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={cn(
                    "px-6 py-2 rounded-full text-[11px] font-bold tracking-widest transition-all duration-300",
                    activeFilter === filter ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="btn-gold"
            >
              <Upload className="w-4 h-4" /> SUBMIT PHOTO
            </button>
          </div>
        </header>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="px-8 md:px-16 py-4 border-b border-divider flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold tracking-widest transition-all border-b",
                activeTag === null ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              )}
            >
              ALL TAGS
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold tracking-widest transition-all border-b",
                  activeTag === tag ? "border-gold text-gold" : "border-transparent text-gray-400 hover:text-black"
                )}
              >
                #{tag.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className="px-8 md:px-16 py-16">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {photoPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid group relative"
                >
                  <div
                    className="card-image cursor-zoom-in"
                    data-cursor="view"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={post.image}
                      alt={post.alt}
                      width={1200}
                      height={1600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-8">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                          className={cn(
                            "p-2 rounded-full backdrop-blur-md transition-colors",
                            likedPosts.includes(post.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/20 hover:bg-white text-white hover:text-black"
                          )}
                          aria-label={likedPosts.includes(post.id) ? "Unlike" : "Like"}
                        >
                          <Heart className={cn("w-5 h-5", likedPosts.includes(post.id) && "fill-current")} />
                        </button>
                      </div>
                      {post.dollName && (
                        <div>
                          <span className="text-xs font-bold tracking-widest text-white/80 uppercase mb-2 block">Featured Doll</span>
                          <Link
                            href="/archive"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/90 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full transition-all group/btn"
                          >
                            <span className="w-2 h-2 rounded-full bg-gold" />
                            <span className="text-xs font-bold text-white group-hover/btn:text-black">
                              {post.dollName} / {post.dollSeries}
                            </span>
                            <ArrowRight className="w-3 h-3 text-white group-hover/btn:text-black" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                      {post.author.avatar ? (
                        <Image src={post.author.avatar} width={28} height={28} className="w-7 h-7 rounded-full border border-divider" alt="" />
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-divider bg-cream flex items-center justify-center">
                          <span className="text-[10px] font-bold text-gray-400">{post.author.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <span className="block text-[11px] font-bold text-black">{post.author.name}</span>
                        {post.author.location && (
                          <span className="block text-[10px] text-gray-400 tracking-wider">{post.author.location}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                      <Heart className="w-3 h-3" aria-hidden="true" />
                      {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                    </span>
                  </div>
                  <CommentSection
                    postId={post.id}
                    isOpen={commentPostId === post.id}
                    onToggle={() => setCommentPostId(commentPostId === post.id ? null : post.id)}
                  />
                  {post.badge && (
                    <div className="absolute top-4 left-4 bg-gold text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase shadow-md">
                      {post.badge}
                    </div>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 px-2 flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {discussionPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid group relative"
              >
                <div className="card-content p-12 text-center flex flex-col items-center justify-center aspect-[4/5]">
                  <Quote className="w-8 h-8 text-gold mb-6 opacity-50" />
                  <p className="font-serif text-3xl text-black leading-relaxed">
                    <InfoHover term="BJD" definition="Ball-Jointed Doll: articulated dolls with spherical joints, typically cast in resin with internal elastic stringing." variant="light" />{" "}
                    is not just a hobby, it is the <br /> <span className="italic text-gray-500">projection of self</span>.
                  </p>
                  <p className="font-serif text-sm text-gray-400 mt-6 max-w-xs leading-relaxed">
                    The dolls we collect say something about who we are — or who we want to be. Each face-up, each outfit, each pose is a form of self-expression.
                  </p>
                  <div className="w-12 h-px bg-gold mt-8 mb-4" />
                  <span className="section-label">DISCUSSION TOPIC</span>
                  <button className="mt-6 btn-ghost">
                    JOIN THE THREAD
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-24 mb-24">
            {allLoaded ? (
              <p className="section-label">All inspiration loaded</p>
            ) : (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
            )}
          </div>
        </div>
      </main>

      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={lightboxImages}
        activeIndex={lightboxIndex ?? 0}
        onNavigate={setLightboxIndex}
        isLiked={lightboxIndex !== null ? likedPosts.includes(photoPosts[lightboxIndex]?.id) : false}
        onLike={lightboxIndex !== null ? () => toggleLike(photoPosts[lightboxIndex].id) : undefined}
      />

      <SubmitPhotoModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />
    </div>
  );
}
