import type { Metadata } from "next";
import JournalClient from "./JournalClient";
import { getJournalArticles } from "@/lib/data/journal";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories from the VALO atelier — craft process, materials research, and studio life.",
};

export default function JournalPage() {
  const articles = getJournalArticles();
  return (
    <PageTransition>
      <JournalClient articles={articles} />
    </PageTransition>
  );
}
