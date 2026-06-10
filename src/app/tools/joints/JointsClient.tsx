"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const JOINT_TYPES = [
  {
    id: "ball",
    name: "Ball Joint",
    description: "The classic BJD joint. A sphere sits in a socket, allowing 360° rotation. Used in shoulders, hips, and necks.",
    pros: ["Full range of motion", "Natural movement", "Can hold complex poses"],
    cons: ["Can gap when posed extreme", "Requires proper tension"],
    locations: ["Shoulders", "Hips", "Neck", "Wrists", "Ankles"],
  },
  {
    id: "single",
    name: "Single Joint",
    description: "A single pivot point for bending. Simple and reliable, but limited to about 90° bend before the joint gap becomes visible.",
    pros: ["Clean look when straight", "Simple mechanics", "Less gap"],
    cons: ["Limited bend range", "Can look unnatural at extreme angles"],
    locations: ["Knees", "Elbows"],
  },
  {
    id: "double",
    name: "Double Joint",
    description: "Two pivot points that work together, allowing bends beyond 120° while maintaining a natural look. The signature of premium BJDs.",
    pros: ["Natural-looking bend", "Over 120° range", "Mimics human anatomy"],
    cons: ["More complex", "Can be harder to tension"],
    locations: ["Knees", "Elbows"],
  },
  {
    id: "s-hook",
    name: "S-Hook System",
    description: "The elastic stringing system that connects all joints. S-hooks at key points allow easy re-stringing and tension adjustment.",
    pros: ["Easy to re-string", "Adjustable tension", "Standard system"],
    cons: ["Elastic wears over time", "Can be tricky for beginners"],
    locations: ["Internal (all joints)"],
  },
];

const POSE_TIPS = [
  {
    name: "Natural Stand",
    description: "Distribute weight evenly. Slight knee bend looks more natural than locked knees.",
    difficulty: "Easy",
  },
  {
    name: "Seated",
    description: "Bend knees to 90°. Arms can rest on thighs or reach forward.",
    difficulty: "Easy",
  },
  {
    name: "Dynamic Pose",
    description: "Use all joint points. Shift weight to one leg, extend arms, tilt head.",
    difficulty: "Medium",
  },
  {
    name: "Action Pose",
    description: "Requires double-jointed knees and elbows. Practice tension management.",
    difficulty: "Hard",
  },
];

export default function JointsClient() {
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar /></div>

      <main className="pt-14 lg:pl-32 w-full">
        <header className="px-8 md:px-16 pt-16 pb-8">
          <span className="section-label block mb-4">EDUCATION</span>
          <h1 className="section-title text-5xl md:text-7xl mb-6">Joint Visualizer</h1>
          <p className="font-serif text-xl text-gray-500 max-w-2xl leading-relaxed">
            Understand how BJD joints work, what to look for when buying, and how to get the best poses from your dolls.
          </p>
        </header>

        <div className="px-8 md:px-16 pb-24">
          {/* Joint Types */}
          <section className="mb-16">
            <h2 className="section-label mb-6">JOINT TYPES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {JOINT_TYPES.map((joint) => (
                <button
                  key={joint.id}
                  onClick={() => setSelectedJoint(selectedJoint === joint.id ? null : joint.id)}
                  className={cn(
                    "card-content p-6 text-left transition-all",
                    selectedJoint === joint.id ? "ring-2 ring-gold" : "hover:border-gray-400"
                  )}
                >
                  <h3 className="font-serif text-2xl mb-2">{joint.name}</h3>
                  <p className="font-serif text-sm text-gray-500 leading-relaxed mb-4">{joint.description}</p>

                  <AnimatePresence>
                    {selectedJoint === joint.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="section-label mb-2">PROS</h4>
                            <ul className="space-y-1">
                              {joint.pros.map((pro) => (
                                <li key={pro} className="flex items-start gap-1.5">
                                  <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                  <span className="font-serif text-xs text-gray-500">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="section-label mb-2">CONS</h4>
                            <ul className="space-y-1">
                              {joint.cons.map((con) => (
                                <li key={con} className="flex items-start gap-1.5">
                                  <X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                                  <span className="font-serif text-xs text-gray-500">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="section-label mb-2">LOCATIONS</h4>
                          <div className="flex gap-2 flex-wrap">
                            {joint.locations.map((loc) => (
                              <span key={loc} className="tag">{loc}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </section>

          {/* Pose Tips */}
          <section className="mb-16">
            <h2 className="section-label mb-6">POSING GUIDE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POSE_TIPS.map((tip) => (
                <div key={tip.name} className="card-content p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-xl">{tip.name}</h3>
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold tracking-widest",
                      tip.difficulty === "Easy" ? "text-green-600 bg-green-50" :
                      tip.difficulty === "Medium" ? "text-amber-600 bg-amber-50" :
                      "text-red-600 bg-red-50"
                    )}>
                      {tip.difficulty}
                    </span>
                  </div>
                  <p className="font-serif text-sm text-gray-500 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Joint Comparison */}
          <section className="mb-16">
            <h2 className="section-label mb-6">JOINT COMPARISON</h2>
            <div className="card-content p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-divider">
                    <th className="text-left py-3 section-label">Feature</th>
                    <th className="text-center py-3 section-label">Ball Joint</th>
                    <th className="text-center py-3 section-label">Single Joint</th>
                    <th className="text-center py-3 section-label">Double Joint</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Range of Motion", ball: "360°", single: "~90°", double: "~120°+" },
                    { feature: "Natural Look", ball: "Good", single: "Limited", double: "Excellent" },
                    { feature: "Gap Visibility", ball: "Moderate", single: "Low", double: "Low" },
                    { feature: "Complexity", ball: "Medium", single: "Simple", double: "High" },
                    { feature: "Best For", ball: "Main joints", single: "Simple bends", double: "Premium posing" },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-divider/50">
                      <td className="py-3 font-serif text-sm">{row.feature}</td>
                      <td className="py-3 text-center font-mono text-xs text-gray-500">{row.ball}</td>
                      <td className="py-3 text-center font-mono text-xs text-gray-500">{row.single}</td>
                      <td className="py-3 text-center font-mono text-xs text-gray-500">{row.double}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="section-title text-3xl mb-6">Ready to Choose?</h2>
            <p className="section-label mb-8 max-w-md mx-auto">
              Browse our archive to find dolls with the joint system that fits your posing style.
            </p>
            <Link href="/archive" className="btn-primary">
              BROWSE ARCHIVE
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
