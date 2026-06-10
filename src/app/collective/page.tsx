import type { Metadata } from "next";
import CollectiveClient from "./CollectiveClient";
import { getCommunityPosts } from "@/lib/data/collective";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "The Collective",
  description: "Curated moments from VALO owners worldwide. A community gallery of artisan doll photography.",
};

export default function CollectivePage() {
  const posts = getCommunityPosts();
  return (
    <PageTransition>
      <CollectiveClient initialPosts={posts} />
    </PageTransition>
  );
}
