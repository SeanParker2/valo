import type { Metadata } from "next";
import JointsClient from "./JointsClient";

export const metadata: Metadata = {
  title: "Joint Visualizer",
  description: "Interactive guide to BJD joint systems. Learn how ball-jointed dolls work and what to look for.",
};

export default function JointsPage() {
  return <JointsClient />;
}
