import type { Metadata } from "next";
import ArchiveDetail from "./ArchiveDetail";
import { getArchiveItemById } from "@/lib/data";
import { productJsonLd } from "@/lib/utils/jsonld";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getArchiveItemById(id);
  if (!item) return { title: "Not Found" };
  return {
    title: `${item.name} — ${item.series}`,
    description: item.narrative,
    openGraph: {
      title: `VALO ${item.name}`,
      description: item.narrative,
      type: "website",
    },
  };
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getArchiveItemById(id) ?? null;

  return (
    <>
      {item && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(item)) }}
        />
      )}
      <ArchiveDetail item={item} />
    </>
  );
}
