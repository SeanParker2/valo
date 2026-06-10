import type { Metadata } from "next";
import ResinClient from "./ResinClient";

export const metadata: Metadata = {
  title: "Resin Colors",
  description: "Visual guide to VALO resin colors — from White Skin to Fantasy tones. See how each color looks under different lighting.",
};

export default function ResinPage() {
  return <ResinClient />;
}
