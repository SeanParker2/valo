import type { Metadata } from "next";
import JournalDetail from "./JournalDetail";
import { getJournalArticleBySlug } from "@/lib/data/journal";
import { articleJsonLd } from "@/lib/utils/jsonld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default async function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getJournalArticleBySlug(slug) ?? null;

  return (
    <>
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
        />
      )}
      <JournalDetail article={article} />
    </>
  );
}
