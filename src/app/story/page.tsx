import type { Metadata } from "next";
import StoryClient from "./StoryClient";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story of VALO Atelier — where light, shadow, and resin converge to create vessels for the soul.",
};

export default function StoryPage() {
  return (
    <PageTransition>
      <StoryClient />
    </PageTransition>
  );
}
