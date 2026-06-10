"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/organisms/TopBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight, Check, Clock, AlertCircle, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InfoHover from "@/components/molecules/InfoHover";
import { InquiryModal } from "@/components/molecules/InquiryModal";
import { StockNotification } from "@/components/molecules/StockNotification";
import { ShareButton } from "@/components/ui/ShareButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useStockAlerts } from "@/hooks/useStockAlerts";
import { getRelatedItems } from "@/lib/data";
import { BLUR_PLACEHOLDER } from "@/lib/utils/blur";
import { cn } from "@/lib/utils";
import type { Doll } from "@/types";

interface ArchiveDetailProps {
  item: Doll | null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: typeof Check }> = {
    available: { bg: "bg-green-50", text: "text-green-700", icon: Check },
    preorder: { bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
    waitlist: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
    sold_out: { bg: "bg-gray-100", text: "text-gray-500", icon: AlertCircle },
    concept: { bg: "bg-purple-50", text: "text-purple-700", icon: AlertCircle },
  };
  const s = styles[status] ?? styles.available;
  const Icon = s.icon;
  const labels: Record<string, string> = { available: "In Stock", preorder: "Pre-Order", waitlist: "Waitlist", sold_out: "Sold Out", concept: "Concept" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase", s.bg, s.text)}>
      <Icon className="w-3 h-3" /> {labels[status] ?? status}
    </span>
  );
}

export default function ArchiveDetail({ item }: ArchiveDetailProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [stockNotifyOpen, setStockNotifyOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { hasAlert, addAlert, removeAlert } = useStockAlerts();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!item) {
    return (
      <div className="flex min-h-screen bg-paper text-black items-center justify-center">
        <TopBar />
        <div className="hidden lg:block"><Sidebar variant="archive" /></div>
        <div className="text-center pt-14">
          <p className="font-serif text-3xl text-gray-400 mb-6">Doll not found</p>
          <Link href="/archive" className="btn-ghost">BACK TO ARCHIVE</Link>
        </div>
      </div>
    );
  }

  const relatedItems = getRelatedItems(item);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block"><Sidebar variant="archive" /></div>

      <main className="pt-14 lg:pl-32 flex-1 w-full flex flex-col lg:flex-row lg:h-[calc(100vh-56px)] lg:overflow-hidden">
        {/* Left: Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 h-[60vh] lg:h-full relative bg-cream p-6 md:p-12 lg:p-20 flex flex-col items-center justify-center shrink-0"
        >
          <div className="relative w-full flex-1 min-h-0" data-cursor="view">
            <AnimatePresence mode="wait">
              <motion.div key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                <Image src={item.gallery[activeImage] || item.image} alt={`${item.name} - View ${activeImage + 1}`} fill className="object-contain" priority sizes="(max-width: 1024px) 100vw, 50vw" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton
                isFavorite={isFavorite(item.id)}
                onToggle={() => toggleFavorite(item.id)}
                size="lg"
              />
            </div>
          </div>

          {item.gallery.length > 1 && (
            <div className="flex items-center gap-3 mt-4 shrink-0">
              <button onClick={() => setActiveImage((i) => (i - 1 + item.gallery.length) % item.gallery.length)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors" aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {item.gallery.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={cn("w-2 h-2 rounded-full transition-all", i === activeImage ? "bg-black scale-125" : "bg-gray-400 hover:bg-gray-600")} aria-label={`View ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => setActiveImage((i) => (i + 1) % item.gallery.length)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors" aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link href="/archive" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </motion.div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto custom-scrollbar bg-paper relative">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="p-8 md:p-16 lg:p-20 space-y-10">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 border border-black rounded-full text-[10px] font-bold tracking-widest uppercase">{item.type}</span>
                <StatusBadge status={item.pricing.status} />
                <span className="font-mono text-[10px] text-gray-400">REF: VALO-{item.series.replace(" ", "-").toUpperCase()}-{item.id}</span>
              </div>
              <h1 className="section-title text-6xl md:text-8xl text-black mb-2">{item.name}</h1>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">{item.series} Collection &bull; {item.year}</p>
            </div>

            {item.pricing.basePrice > 0 && (
              <div className="flex items-baseline gap-3">
                <span className="price">${item.pricing.basePrice}</span>
                <span className="price-currency">{item.pricing.currency}</span>
                {item.pricing.layaway && <span className="price-layaway">or {item.pricing.layawayMonths}x layaway</span>}
              </div>
            )}

            <div className="h-px bg-divider" />

            <div>
              <p className="font-serif text-xl leading-relaxed text-gray-700 drop-cap">
                A study in <InfoHover term="equilibrium" definition="The state of physical balance; specifically referring to the doll's ability to stand unaided." variant="light" />. {item.narrative}
              </p>
            </div>

            {item.features.length > 0 && (
              <div>
                <h2 className="section-label mb-4">KEY FEATURES</h2>
                <ul className="space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="font-serif text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="h-px bg-divider" />

            <div>
              <h2 className="section-label mb-4">SPECIFICATIONS</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {[
                  { label: "Material", value: item.spec.material },
                  { label: "Height", value: item.spec.height },
                  { label: "Weight", value: item.spec.weight },
                  { label: "Joints", value: `${item.spec.joints} points` },
                  { label: "Wig Size", value: item.spec.wigSize },
                  { label: "Eyes", value: item.spec.eyeSize },
                ].map((spec) => (
                  <div key={spec.label}>
                    <h3 className="section-label mb-1">{spec.label}</h3>
                    <p className="font-serif text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-divider" />

            {/* Resin Colors */}
            <div>
              <h2 className="section-label mb-4">RESIN COLORS</h2>
              <div className="grid grid-cols-2 gap-3">
                {item.resinColors.map((color) => (
                  <div key={color.name} className={cn("flex items-center gap-3 p-3 border transition-colors", color.available ? "border-divider hover:border-gold" : "border-divider opacity-50")}>
                    <div className="w-8 h-8 rounded-full border border-divider shrink-0" style={{ backgroundColor: color.hex }} />
                    <div>
                      <span className="block text-[11px] font-bold">{color.name}</span>
                      <span className="block text-[10px] text-gray-400">{color.available ? "Available" : "Unavailable"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-divider" />

            {/* Pose Capabilities */}
            <div>
              <h2 className="section-label mb-4">POSE CAPABILITIES</h2>
              <div className="space-y-2">
                {item.poseCapabilities.map((pose) => (
                  <div key={pose.name} className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", pose.achievable ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400")}>
                      {pose.achievable ? <Check className="w-3 h-3" /> : <span className="text-[10px]">&mdash;</span>}
                    </div>
                    <div>
                      <span className={cn("text-[11px] font-bold", !pose.achievable && "text-gray-400")}>{pose.name}</span>
                      <span className="block text-[10px] text-gray-400">{pose.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-divider" />

            {/* Compatibility */}
            <div>
              <h2 className="section-label mb-4">COMPATIBILITY</h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                {[
                  { label: "Wig", value: item.compatibility.wigSize },
                  { label: "Eyes", value: item.compatibility.eyeSize },
                  { label: "Clothing", value: item.compatibility.clothingScale },
                  { label: "Shoes", value: item.compatibility.shoeSize },
                ].map((c) => (
                  <div key={c.label}>
                    <h3 className="section-label mb-1">{c.label}</h3>
                    <p className="font-serif text-sm">{c.value}</p>
                  </div>
                ))}
              </div>
              {item.compatibility.compatibleBrands && item.compatibility.compatibleBrands.length > 0 && (
                <div className="mt-4">
                  <h3 className="section-label mb-2">COMPATIBLE BRANDS</h3>
                  <div className="flex gap-2 flex-wrap">
                    {item.compatibility.compatibleBrands.map((b) => (
                      <span key={b} className="px-3 py-1 bg-cream text-[10px] font-bold tracking-widest">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-divider" />

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-4">
                <button onClick={() => setInquiryOpen(true)} className="btn-primary flex-1">
                  <ShoppingBag className="w-4 h-4" />
                  {item.pricing.status === "available" ? "INQUIRE TO ORDER" : item.pricing.status === "preorder" ? "JOIN PRE-ORDER" : item.pricing.status === "waitlist" ? "JOIN WAITLIST" : "INQUIRE"}
                </button>
                <ShareButton title={`VALO ${item.name}`} text={item.narrative} />
              </div>
              {(item.pricing.status === "sold_out" || item.pricing.status === "waitlist") && (
                <button
                  onClick={() => setStockNotifyOpen(true)}
                  className="btn-ghost w-full"
                >
                  <Bell className="w-4 h-4" />
                  {hasAlert(item.id, "user") ? "NOTIFICATION SET" : "NOTIFY WHEN AVAILABLE"}
                </button>
              )}
            </div>

            {/* Related */}
            {relatedItems.length > 0 && (
              <>
                <div className="h-px bg-divider" />
                <div>
                  <h2 className="section-label mb-6">RELATED SCULPTS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {relatedItems.map((related) => (
                      <Link key={related.id} href={`/archive/${related.id}`} className="group block" data-cursor="view">
                        <div className="card-image aspect-[4/5]">
                          <Image src={related.image} alt={related.name} fill sizes="(max-width: 1024px) 50vw, 25vw" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="mt-3">
                          <span className="font-serif text-lg group-hover:text-gold transition-colors">{related.name}</span>
                          <span className="block section-label">{related.series}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} dollName={item.name} />
      <StockNotification
        isOpen={stockNotifyOpen}
        onClose={() => setStockNotifyOpen(false)}
        dollName={item.name}
        dollId={item.id}
        isSubscribed={hasAlert(item.id, "user")}
        onSubscribe={(email) => addAlert(item.id, email)}
        onUnsubscribe={() => removeAlert(item.id, "user")}
      />
    </div>
  );
}
