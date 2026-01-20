import { Metadata } from "next";
import LabClient from "./LabClient";

export const metadata: Metadata = {
  title: "VALO | Light Lab",
  description: "Advanced BJD Lighting & Material Simulator. Experience your creation under 4,000 lighting conditions.",
};

export default function LabPage() {
  return <LabClient />;
}
