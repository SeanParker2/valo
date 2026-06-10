import type { Metadata } from "next";
import ResinLabClient from "./ResinLabClient";

export const metadata: Metadata = {
  title: "Resin Color Lab",
  description: "Interactive resin color comparison tool. Compare how different resin colors look under various lighting conditions.",
};

export default function ResinLabPage() {
  return <ResinLabClient />;
}
