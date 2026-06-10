import type { Metadata } from "next";
import ScaleClient from "./ScaleClient";

export const metadata: Metadata = {
  title: "Scale Guide",
  description: "Visual comparison of BJD scales — 1/3, 1/4, 1/6, and Yo-SD. Find the right size for your collection.",
};

export default function ScalePage() {
  return <ScaleClient />;
}
