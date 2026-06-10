import type { MetadataRoute } from "next";
import { ARCHIVE_ITEMS } from "@/lib/data";
import { JOURNAL_ARTICLES } from "@/lib/data/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://valo-atelier.jp";

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${base}/archive`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/collection`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/tools/resin-lab`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/tools/joints`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/collective`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/story`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const archivePages = ARCHIVE_ITEMS.map((item) => ({
    url: `${base}/archive/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const journalPages = JOURNAL_ARTICLES.map((article) => ({
    url: `${base}/journal/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...archivePages, ...journalPages];
}
