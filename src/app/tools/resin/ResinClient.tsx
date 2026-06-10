"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { cn } from "@/lib/utils";
import InfoHover from "@/components/molecules/InfoHover";

const RESIN_COLORS = [
  {
    name: "White Skin",
    hex: "#f5e6d3",
    undertone: "Cool pink",
    description: "Our lightest standard tone. Porcelain-like under studio light, with a subtle cool pink undertone that catches light beautifully. The most popular choice for photography.",
    bestFor: "Studio photography, fair-skinned character concepts",
    uvResistance: "Excellent",
    yellowing: "Minimal over 2+ years with proper care",
  },
  {
    name: "Normal Skin",
    hex: "#e8d0b5",
    undertone: "Warm yellow",
    description: "A warm, natural ivory that mimics light-to-medium human skin tones. Versatile and works well in any lighting condition. The 'safe' choice for first-time buyers.",
    bestFor: "Everyday display, natural-looking characters",
    uvResistance: "Excellent",
    yellowing: "Minimal",
  },
  {
    name: "Suntan",
    hex: "#d6b69c",
    undertone: "Warm golden",
    description: "A sun-kissed warm tone that evokes Mediterranean complexions. Deeper than Normal Skin but still translucent enough to show the 'glow' effect under natural light.",
    bestFor: "Outdoor photography, warm-toned characters",
    uvResistance: "Excellent",
    yellowing: "Minimal",
  },
  {
    name: "Tan",
    hex: "#c4a882",
    undertone: "Warm amber",
    description: "A deeper tan with rich amber undertones. Shows beautiful depth when light penetrates the resin. Popular for characters with a natural, outdoorsy aesthetic.",
    bestFor: "Natural light photography, earthy characters",
    uvResistance: "Good",
    yellowing: "Low",
  },
  {
    name: "Fantasy Pink",
    hex: "#f0c4c4",
    undertone: "Rose",
    description: "A limited-edition tinted resin with subtle rose undertones. Creates an ethereal, otherworldly appearance. Each batch is hand-mixed, so slight variations occur.",
    bestFor: "Fantasy characters, artistic photography",
    uvResistance: "Good",
    yellowing: "Moderate (store away from sunlight)",
    limited: true,
  },
  {
    name: "Fantasy Lavender",
    hex: "#d8c8e0",
    undertone: "Cool purple",
    description: "Our most unique color — a subtle lavender that shifts between cool purple and gray depending on the light. Featured on our Iris sculpt.",
    bestFor: "Fantasy characters, moody photography",
    uvResistance: "Fair",
    yellowing: "Moderate",
    limited: true,
  },
  {
    name: "Porcelain",
    hex: "#f0f0f0",
    undertone: "Neutral cool",
    description: "An almost-white tone with the faintest blue undertone. Designed to mimic fine porcelain ceramics. Extremely translucent — light passes through several millimeters.",
    bestFor: "Doll-as-art concepts, museum-style display",
    uvResistance: "Excellent",
    yellowing: "Very low",
    limited: true,
  },
];

export default function ResinClient() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar /></div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-12">
          <span className="section-label block mb-4">MATERIALS</span>
          <h1 className="section-title text-5xl md:text-7xl mb-6">Resin Colors</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed">
            Every VALO doll is cast in artisan French resin. Each color has a unique character — from porcelain whites to warm tans and limited-edition fantasy tones.
          </p>
        </header>

        {/* Color Swatches Grid */}
        <section className="px-8 md:px-16 pb-8">
          <div className="flex gap-4 flex-wrap">
            {RESIN_COLORS.map((color, i) => (
              <button
                key={color.name}
                onClick={() => setSelected(selected === i ? null : i)}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all",
                  selected === i ? "scale-110" : selected !== null ? "opacity-40" : "hover:scale-105"
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all",
                    selected === i ? "border-gold shadow-lg" : "border-divider"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-mono text-[10px] tracking-widest text-gray-500">{color.name}</span>
                {color.limited && <span className="font-mono text-[8px] text-gold tracking-widest">LIMITED</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Detail Cards */}
        <section className="px-8 md:px-16 pb-24">
          <div className="space-y-6">
            {RESIN_COLORS.map((color, i) => (
              <button
                key={color.name}
                onClick={() => setSelected(selected === i ? null : i)}
                className={cn(
                  "card-content p-8 text-left w-full transition-all",
                  selected === i ? "ring-2 ring-gold" : selected !== null ? "hidden" : ""
                )}
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full shrink-0 border-2 border-divider" style={{ backgroundColor: color.hex }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-serif text-2xl">{color.name}</span>
                      {color.limited && <span className="font-mono text-[10px] text-gold tracking-widest">LIMITED EDITION</span>}
                    </div>
                    <p className="font-serif text-sm text-gray-500 leading-relaxed mb-4">{color.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="section-label block mb-1">UNDERTONE</span>
                        <span className="font-serif text-sm">{color.undertone}</span>
                      </div>
                      <div>
                        <span className="section-label block mb-1">BEST FOR</span>
                        <span className="font-serif text-sm">{color.bestFor}</span>
                      </div>
                      <div>
                        <span className="section-label block mb-1">UV RESISTANCE</span>
                        <span className="font-serif text-sm">{color.uvResistance}</span>
                      </div>
                      <div>
                        <span className="section-label block mb-1">YELLOWING</span>
                        <span className="font-serif text-sm">{color.yellowing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Care Tips */}
        <section className="px-8 md:px-16 pb-24">
          <div className="card-content p-8 md:p-12">
            <h2 className="section-title text-2xl mb-4">Resin Care Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="section-label mb-2">PREVENT YELLOWING</h3>
                <ul className="space-y-2">
                  <li className="font-serif text-sm text-gray-500">Store away from direct sunlight</li>
                  <li className="font-serif text-sm text-gray-500">Use UV-protective display cases</li>
                  <li className="font-serif text-sm text-gray-500">Avoid prolonged exposure to fluorescent lighting</li>
                </ul>
              </div>
              <div>
                <h3 className="section-label mb-2">MAINTAIN FINISH</h3>
                <ul className="space-y-2">
                  <li className="font-serif text-sm text-gray-500">Clean with soft microfiber cloth only</li>
                  <li className="font-serif text-sm text-gray-500">Avoid alcohol-based cleaners</li>
                  <li className="font-serif text-sm text-gray-500">Apply UV-resistant sealant annually</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 md:px-16 pb-24 text-center">
          <h2 className="section-title text-3xl mb-6">See Colors in Action</h2>
          <p className="section-label mb-8">Use the Light Lab to preview how each resin color looks under different lighting conditions.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/lab" className="btn-primary">OPEN LIGHT LAB</Link>
            <Link href="/archive" className="btn-secondary">BROWSE ARCHIVE</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
