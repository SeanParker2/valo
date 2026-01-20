import { Metadata } from "next";
import ArchiveClient from "./ArchiveClient";

export const metadata: Metadata = {
  title: "VALO | Archive",
  description: "A curated registry of all VALO creations. From prototypes to final releases.",
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
