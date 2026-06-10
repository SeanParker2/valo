import type { Metadata } from "next";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "My Collection",
  description: "Track your BJD collection, manage your wishlist, and catalog your dolls.",
};

export default function CollectionPage() {
  return <CollectionClient />;
}
