import type { Metadata } from "next";
import ArchiveClient from "./ArchiveClient";
import { getArchiveItems } from "@/lib/data";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Archive",
  description: "Explore the VALO doll archive — a curated collection of artisan ball-jointed dolls.",
};

export default function ArchivePage() {
  const items = getArchiveItems();
  return (
    <PageTransition>
      <ArchiveClient initialItems={items} />
    </PageTransition>
  );
}
