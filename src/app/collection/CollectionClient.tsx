"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Heart, Package, Star, Plus, X, Calendar, MapPin, Edit3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ARCHIVE_ITEMS } from "@/lib/data";
import type { Doll } from "@/types";

interface CollectionEntry {
  dollId: string;
  status: "owned" | "wishlist" | "ordered";
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  faceup?: string;
  eyes?: string;
  wig?: string;
}

const STATUS_CONFIG = {
  owned: { label: "Owned", icon: Package, color: "text-green-600 bg-green-50" },
  wishlist: { label: "Wishlist", icon: Heart, color: "text-red-500 bg-red-50" },
  ordered: { label: "Ordered", icon: Star, color: "text-blue-600 bg-blue-50" },
};

export default function CollectionClient() {
  const [collection, setCollection] = useLocalStorage<CollectionEntry[]>("valo-collection", []);
  const [activeTab, setActiveTab] = useState<"all" | "owned" | "wishlist" | "ordered">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CollectionEntry>>({});

  const filteredCollection = useMemo(() => {
    if (activeTab === "all") return collection;
    return collection.filter((e) => e.status === activeTab);
  }, [collection, activeTab]);

  const getDoll = (dollId: string): Doll | undefined => {
    return ARCHIVE_ITEMS.find((d) => d.id === dollId);
  };

  const addToCollection = (dollId: string, status: CollectionEntry["status"]) => {
    if (collection.some((e) => e.dollId === dollId)) return;
    setCollection((prev) => [...prev, { dollId, status }]);
  };

  const removeFromCollection = (dollId: string) => {
    setCollection((prev) => prev.filter((e) => e.dollId !== dollId));
  };

  const updateEntry = (dollId: string, updates: Partial<CollectionEntry>) => {
    setCollection((prev) =>
      prev.map((e) => (e.dollId === dollId ? { ...e, ...updates } : e))
    );
    setEditingId(null);
  };

  const startEditing = (entry: CollectionEntry) => {
    setEditingId(entry.dollId);
    setEditForm({
      purchaseDate: entry.purchaseDate || "",
      purchasePrice: entry.purchasePrice || 0,
      notes: entry.notes || "",
      faceup: entry.faceup || "",
      eyes: entry.eyes || "",
      wig: entry.wig || "",
    });
  };

  const ownedCount = collection.filter((e) => e.status === "owned").length;
  const wishlistCount = collection.filter((e) => e.status === "wishlist").length;
  const orderedCount = collection.filter((e) => e.status === "ordered").length;

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar /></div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-8">
          <span className="section-label block mb-4">PERSONAL</span>
          <h1 className="section-title text-5xl md:text-7xl mb-6">My Collection</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed">
            Track your BJD collection, manage your wishlist, and catalog the details of each doll.
          </p>
        </header>

        {/* Stats */}
        <div className="px-8 md:px-16 pb-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Owned", value: ownedCount, icon: Package, color: "text-green-600" },
              { label: "Wishlist", value: wishlistCount, icon: Heart, color: "text-red-500" },
              { label: "Ordered", value: orderedCount, icon: Star, color: "text-blue-600" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card-content p-4 text-center">
                  <Icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
                  <div className="font-serif text-3xl mb-1">{stat.value}</div>
                  <div className="section-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 md:px-16 pb-8">
          <div className="flex gap-2">
            {(["all", "owned", "wishlist", "ordered"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-[11px] font-bold tracking-widest transition-all border-b",
                  activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
                )}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Grid */}
        <div className="px-8 md:px-16 pb-24">
          {filteredCollection.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-6" />
              <h3 className="font-serif text-2xl text-gray-400 mb-4">
                {activeTab === "all" ? "Your collection is empty" : `No ${activeTab} dolls`}
              </h3>
              <p className="font-serif text-sm text-gray-400 mb-8 max-w-md mx-auto">
                {activeTab === "all"
                  ? "Start building your collection by browsing the archive and adding dolls to your collection."
                  : "Browse the archive and add dolls to your collection."}
              </p>
              <Link href="/archive" className="btn-secondary">
                BROWSE ARCHIVE
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollection.map((entry) => {
                const doll = getDoll(entry.dollId);
                if (!doll) return null;
                const statusConfig = STATUS_CONFIG[entry.status];
                const StatusIcon = statusConfig.icon;
                const isEditing = editingId === entry.dollId;

                return (
                  <motion.div
                    key={entry.dollId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-content overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] bg-cream">
                      <Image src={doll.image} alt={doll.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute top-3 right-3">
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase", statusConfig.color)}>
                          <StatusIcon className="w-3 h-3" /> {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-2xl">{doll.name}</h3>
                          <p className="section-label">{doll.series} &bull; {doll.year}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => isEditing ? setEditingId(null) : startEditing(entry)}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCollection(entry.dollId)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isEditing ? (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                            <div>
                              <label className="section-label block mb-1">Purchase Date</label>
                              <input
                                type="date"
                                value={editForm.purchaseDate || ""}
                                onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                                className="input-brand text-sm"
                              />
                            </div>
                            <div>
                              <label className="section-label block mb-1">Purchase Price</label>
                              <input
                                type="number"
                                value={editForm.purchasePrice || ""}
                                onChange={(e) => setEditForm({ ...editForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                                placeholder="USD"
                                className="input-brand text-sm"
                              />
                            </div>
                            <div>
                              <label className="section-label block mb-1">Face-up</label>
                              <input
                                type="text"
                                value={editForm.faceup || ""}
                                onChange={(e) => setEditForm({ ...editForm, faceup: e.target.value })}
                                placeholder="Default / Custom / Artist name"
                                className="input-brand text-sm"
                              />
                            </div>
                            <div>
                              <label className="section-label block mb-1">Notes</label>
                              <textarea
                                value={editForm.notes || ""}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                placeholder="Any notes about this doll..."
                                rows={3}
                                className="input-brand text-sm resize-none"
                              />
                            </div>
                            <button
                              onClick={() => updateEntry(entry.dollId, editForm)}
                              className="btn-primary w-full py-2"
                            >
                              <Check className="w-4 h-4" /> SAVE
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            {entry.purchaseDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>{entry.purchaseDate}</span>
                              </div>
                            )}
                            {(entry.purchasePrice ?? 0) > 0 && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-mono text-[10px]">USD</span>
                                <span>${entry.purchasePrice}</span>
                              </div>
                            )}
                            {entry.faceup && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Edit3 className="w-3 h-3" />
                                <span>{entry.faceup}</span>
                              </div>
                            )}
                            {entry.notes && (
                              <p className="font-serif text-sm text-gray-400 mt-2">{entry.notes}</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add from Archive */}
        <section className="px-8 md:px-16 pb-24">
          <h2 className="section-label mb-6">ADD TO COLLECTION</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ARCHIVE_ITEMS.filter((d) => !collection.some((e) => e.dollId === d.id)).map((doll) => (
              <button
                key={doll.id}
                onClick={() => addToCollection(doll.id, "wishlist")}
                className="card-content p-3 text-left hover:border-gold transition-colors group"
              >
                <div className="relative aspect-square bg-cream mb-2 overflow-hidden">
                  <Image src={doll.image} alt={doll.name} fill className="object-cover" sizes="100px" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="block font-serif text-sm">{doll.name}</span>
                <span className="block section-label">{doll.series}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
