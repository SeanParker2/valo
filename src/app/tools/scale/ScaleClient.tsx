"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { cn } from "@/lib/utils";

const SCALES = [
  {
    name: "SD17",
    ratio: "1/3",
    height: "65-70 cm",
    realHeight: "~170 cm equivalent",
    description: "The most popular scale. Full-size dolls with maximum detail and posing capability. Standing height reaches your knee.",
    common: "Volks SD, Iplehouse SID, Luts SD",
    pros: ["Maximum detail", "Best posing", "Largest clothing market"],
    cons: ["Heavy (2.5-3.5 kg)", "Needs dedicated display space", "Most expensive"],
  },
  {
    name: "SD",
    ratio: "1/3",
    height: "58-65 cm",
    realHeight: "~160 cm equivalent",
    description: "Standard SD scale. Slightly smaller than SD17 but still impressive. The 'classic' BJD size.",
    common: "Volks SD, Luts SD, Dollmore SD",
    pros: ["Great detail", "Wide accessory selection", "Good balance of size and manageability"],
    cons: ["Still large and heavy", "Requires shelf space"],
  },
  {
    name: "MSD",
    ratio: "1/4",
    height: "42-50 cm",
    realHeight: "~130 cm equivalent",
    description: "Mid-size scale. Perfect balance of detail and portability. Popular for first BJD purchases.",
    common: "Luts MSD, Dollmore MSD, Soom MSD",
    pros: ["Good detail", "Portable", "More affordable", "Easier to display"],
    cons: ["Smaller clothing market than SD", "Less dramatic presence"],
  },
  {
    name: "Yo-SD",
    ratio: "1/6",
    height: "26-35 cm",
    realHeight: "~90 cm equivalent",
    description: "Small scale, child-like proportions. Extremely portable and adorable. Great for desk display.",
    common: "Volks Yo-SD, Luts Yo-SD",
    pros: ["Very portable", "Affordable", "Cute proportions", "Easy to store"],
    cons: ["Limited detail", "Smaller clothing market", "Less posing capability"],
  },
];

export default function ScaleClient() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar /></div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-12">
          <span className="section-label block mb-4">TOOLS</span>
          <h1 className="section-title text-5xl md:text-7xl mb-6">Scale Guide</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed">
            BJD dolls come in multiple scales. Understanding the differences helps you choose the right size for your collection, display space, and budget.
          </p>
        </header>

        {/* Visual Height Comparison */}
        <section className="px-8 md:px-16 pb-16">
          <h2 className="section-label mb-6">HEIGHT COMPARISON</h2>
          <div className="flex items-end gap-8 md:gap-16 overflow-x-auto pb-4">
            {SCALES.map((scale, i) => {
              const heightPercent = [100, 90, 65, 40][i];
              return (
                <button
                  key={scale.name}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className={cn(
                    "flex flex-col items-center gap-3 transition-all shrink-0",
                    selected === i ? "opacity-100" : selected !== null ? "opacity-40" : "opacity-100 hover:opacity-80"
                  )}
                >
                  <div
                    className={cn(
                      "w-20 md:w-28 rounded-t-sm transition-colors",
                      selected === i ? "bg-gold" : "bg-cream"
                    )}
                    style={{ height: `${heightPercent * 3}px` }}
                  />
                  <div className="text-center">
                    <span className="block font-serif text-2xl">{scale.name}</span>
                    <span className="block font-mono text-[10px] text-gray-400 tracking-widest">{scale.ratio}</span>
                    <span className="block font-mono text-[10px] text-gray-400">{scale.height}</span>
                  </div>
                </button>
              );
            })}
            {/* Human reference */}
            <div className="flex flex-col items-center gap-3 opacity-30 shrink-0">
              <div className="w-16 md:w-20 bg-gray-300 rounded-t-sm" style={{ height: "300px" }} />
              <div className="text-center">
                <span className="block font-serif text-lg">Human</span>
                <span className="block font-mono text-[10px] text-gray-400">170 cm</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Cards */}
        <section className="px-8 md:px-16 pb-24">
          <h2 className="section-label mb-6">SCALE DETAILS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SCALES.map((scale, i) => (
              <button
                key={scale.name}
                onClick={() => setSelected(selected === i ? null : i)}
                className={cn(
                  "card-content p-8 text-left transition-all",
                  selected === i ? "ring-2 ring-gold" : "hover:border-gray-400"
                )}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="font-serif text-3xl">{scale.name}</span>
                    <span className="font-mono text-[10px] text-gold tracking-widest ml-3">{scale.ratio}</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">{scale.height}</span>
                </div>

                <p className="font-serif text-sm text-gray-500 leading-relaxed mb-4">{scale.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="section-label block mb-1">EQUIVALENT</span>
                    <span className="font-serif text-sm">{scale.realHeight}</span>
                  </div>
                  <div>
                    <span className="section-label block mb-1">COMMON BRANDS</span>
                    <span className="font-serif text-sm">{scale.common}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="section-label block mb-2">PROS</span>
                    <ul className="space-y-1">
                      {scale.pros.map((p) => (
                        <li key={p} className="flex items-start gap-1.5">
                          <span className="text-green-500 text-[10px] mt-0.5">+</span>
                          <span className="font-serif text-xs text-gray-500">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="section-label block mb-2">CONS</span>
                    <ul className="space-y-1">
                      {scale.cons.map((c) => (
                        <li key={c} className="flex items-start gap-1.5">
                          <span className="text-red-400 text-[10px] mt-0.5">&minus;</span>
                          <span className="font-serif text-xs text-gray-500">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 md:px-16 pb-24 text-center">
          <h2 className="section-title text-3xl mb-6">Ready to Choose?</h2>
          <p className="section-label mb-8">Browse our archive to find the perfect sculpt for your scale preference.</p>
          <Link href="/archive" className="btn-primary">BROWSE ARCHIVE</Link>
        </section>
      </main>
    </div>
  );
}
