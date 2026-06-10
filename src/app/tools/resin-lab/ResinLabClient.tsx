"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { cn } from "@/lib/utils";
import { Sun, Moon, Lightbulb, Flame, Eye, Layers, ArrowLeftRight } from "lucide-react";

const RESIN_COLORS = [
  { name: "White Skin", hex: "#f5e6d3", undertone: "Cool pink", description: "Our lightest tone, porcelain-like under studio light" },
  { name: "Normal Skin", hex: "#e8d0b5", undertone: "Warm yellow", description: "Warm ivory with natural undertones" },
  { name: "Suntan", hex: "#d6b69c", undertone: "Warm golden", description: "Sun-kissed warmth, perfect for outdoor photography" },
  { name: "Tan", hex: "#c4a882", undertone: "Warm amber", description: "Deeper tan with rich amber undertones" },
  { name: "Fantasy Pink", hex: "#f0c4c4", undertone: "Rose", description: "Limited edition rose-tinted resin" },
  { name: "Fantasy Lavender", hex: "#d8c8e0", undertone: "Cool purple", description: "Subtle lavender that shifts between cool purple and gray" },
  { name: "Porcelain", hex: "#f0f0f0", undertone: "Neutral cool", description: "Almost-white with faint blue undertone" },
  { name: "Deep", hex: "#3e2723", undertone: "Warm brown", description: "Our deepest tone, rich and dramatic" },
];

const LIGHTING_PRESETS = [
  { name: "Natural Daylight", icon: Sun, temp: 5600, color: "#ffffff", description: "Neutral, true-to-life colors" },
  { name: "Golden Hour", icon: Sun, temp: 3500, color: "#ffe4b5", description: "Warm, intimate tones" },
  { name: "Studio Flash", icon: Lightbulb, temp: 5600, color: "#f0f0ff", description: "Clean, professional look" },
  { name: "Moonlight", icon: Moon, temp: 8000, color: "#b0c4de", description: "Cool, ethereal atmosphere" },
  { name: "Tungsten", icon: Flame, temp: 2800, color: "#ffa500", description: "Warm indoor lighting" },
  { name: "Overcast", icon: Sun, temp: 6500, color: "#c0c0c0", description: "Soft, diffused light" },
];

export default function ResinLabClient() {
  const [selectedColors, setSelectedColors] = useState<string[]>(["#f5e6d3", "#e8d0b5"]);
  const [activeLighting, setActiveLighting] = useState(0);
  const [compareMode, setCompareMode] = useState<"side" | "overlay">("side");
  const [showDetails, setShowDetails] = useState(true);

  const lighting = LIGHTING_PRESETS[activeLighting];

  const toggleColor = (hex: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(hex)) return prev.filter((c) => c !== hex);
      if (prev.length >= 4) return prev;
      return [...prev, hex];
    });
  };

  const adjustColorForLighting = (hex: string, temp: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const warmFactor = temp < 5000 ? (5000 - temp) / 3000 : 0;
    const coolFactor = temp > 6000 ? (temp - 6000) / 3000 : 0;

    const newR = Math.min(255, r + warmFactor * 20 - coolFactor * 10);
    const newG = Math.min(255, g + warmFactor * 10 - coolFactor * 5);
    const newB = Math.min(255, b - warmFactor * 15 + coolFactor * 15);

    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar /></div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-8">
          <span className="section-label block mb-4">TOOLS</span>
          <h1 className="section-title text-5xl md:text-7xl mb-6">Resin Color Lab</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed">
            Compare how different resin colors look under various lighting conditions. Select up to 4 colors and see them side by side.
          </p>
        </header>

        <div className="px-8 md:px-16 pb-24">
          {/* Lighting Selector */}
          <section className="mb-12">
            <h2 className="section-label mb-4">LIGHTING CONDITION</h2>
            <div className="flex gap-3 flex-wrap">
              {LIGHTING_PRESETS.map((preset, i) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.name}
                    onClick={() => setActiveLighting(i)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 border transition-all",
                      activeLighting === i
                        ? "border-gold bg-gold/5 text-black"
                        : "border-divider text-gray-500 hover:border-gray-400 hover:text-black"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <span className="block text-[11px] font-bold">{preset.name}</span>
                      <span className="block font-mono text-[9px] text-gray-400">{preset.temp}K</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="font-serif text-sm text-gray-400 mt-3">{lighting.description}</p>
          </section>

          {/* Compare Mode Toggle */}
          <section className="mb-8">
            <div className="flex items-center gap-4">
              <span className="section-label">VIEW MODE</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareMode("side")}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold tracking-widest transition-all border-b",
                    compareMode === "side" ? "border-gold text-gold" : "border-transparent text-gray-500"
                  )}
                >
                  SIDE BY SIDE
                </button>
                <button
                  onClick={() => setCompareMode("overlay")}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold tracking-widest transition-all border-b",
                    compareMode === "overlay" ? "border-gold text-gold" : "border-transparent text-gray-500"
                  )}
                >
                  OVERLAY
                </button>
              </div>
            </div>
          </section>

          {/* Color Preview */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-label">SELECTED COLORS ({selectedColors.length}/4)</h2>
              {selectedColors.length > 0 && (
                <button
                  onClick={() => setSelectedColors([])}
                  className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {compareMode === "side" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedColors.map((hex) => {
                  const color = RESIN_COLORS.find((c) => c.hex === hex);
                  return (
                    <motion.div
                      key={hex}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="card-content p-4"
                    >
                      <div
                        className="w-full aspect-square rounded mb-3 transition-colors duration-500"
                        style={{ backgroundColor: adjustColorForLighting(hex, lighting.temp) }}
                      />
                      <span className="block text-[11px] font-bold">{color?.name}</span>
                      <span className="block font-mono text-[9px] text-gray-400">{hex}</span>
                      {showDetails && color && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-mono text-[9px] text-gray-500">Undertone</span>
                            <span className="font-mono text-[9px] text-gray-400">{color.undertone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mono text-[9px] text-gray-500">Lighting</span>
                            <span className="font-mono text-[9px] text-gray-400">{lighting.name}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {selectedColors.length < 4 && (
                  <div className="card-content p-4 flex items-center justify-center aspect-square border-2 border-dashed border-divider">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400">SELECT COLOR</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-content p-8">
                <div className="flex gap-1 h-32">
                  {selectedColors.map((hex) => (
                    <motion.div
                      key={hex}
                      layout
                      className="flex-1 transition-colors duration-500"
                      style={{ backgroundColor: adjustColorForLighting(hex, lighting.temp) }}
                    />
                  ))}
                </div>
                <div className="flex gap-1 mt-2">
                  {selectedColors.map((hex) => {
                    const color = RESIN_COLORS.find((c) => c.hex === hex);
                    return (
                      <div key={hex} className="flex-1 text-center">
                        <span className="text-[10px] font-bold">{color?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Color Palette */}
          <section className="mb-16">
            <h2 className="section-label mb-4">AVAILABLE COLORS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RESIN_COLORS.map((color) => {
                const isSelected = selectedColors.includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    onClick={() => toggleColor(color.hex)}
                    className={cn(
                      "flex items-center gap-3 p-3 border transition-all text-left",
                      isSelected ? "border-gold bg-gold/5" : "border-divider hover:border-gray-400"
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-divider shrink-0 transition-colors duration-500"
                      style={{ backgroundColor: adjustColorForLighting(color.hex, lighting.temp) }}
                    />
                    <div>
                      <span className="block text-[11px] font-bold">{color.name}</span>
                      <span className="block font-mono text-[9px] text-gray-400">{color.hex}</span>
                      <span className="block font-mono text-[9px] text-gray-500">{color.undertone}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Color Details */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-label">COLOR DETAILS</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                {showDetails ? "HIDE" : "SHOW"}
              </button>
            </div>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {RESIN_COLORS.filter((c) => selectedColors.includes(c.hex)).map((color) => (
                    <div key={color.hex} className="card-content p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full border border-divider" style={{ backgroundColor: color.hex }} />
                        <div>
                          <span className="block text-[11px] font-bold">{color.name}</span>
                          <span className="block font-mono text-[9px] text-gray-400">{color.hex}</span>
                        </div>
                      </div>
                      <p className="font-serif text-sm text-gray-500 leading-relaxed">{color.description}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <span className="section-label block mb-1">Undertone</span>
                          <span className="font-serif text-sm">{color.undertone}</span>
                        </div>
                        <div>
                          <span className="section-label block mb-1">Hex</span>
                          <span className="font-mono text-sm">{color.hex}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Tips */}
          <section className="mb-16">
            <div className="card-content p-8">
              <h3 className="section-title text-2xl mb-4">Photography Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="section-label mb-2">Natural Light</h4>
                  <p className="font-serif text-sm text-gray-500 leading-relaxed">
                    The best BJD photographs are taken in natural light. Position your doll near a window with indirect sunlight for the most accurate color representation.
                  </p>
                </div>
                <div>
                  <h4 className="section-label mb-2">Golden Hour</h4>
                  <p className="font-serif text-sm text-gray-500 leading-relaxed">
                    The warm tones of golden hour make resin glow. This is the best time to capture the translucency of French resin.
                  </p>
                </div>
                <div>
                  <h4 className="section-label mb-2">Avoid Flash</h4>
                  <p className="font-serif text-sm text-gray-500 leading-relaxed">
                    Flash flattens the resin and kills the glow. Use natural light or continuous studio lighting for the best results.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
