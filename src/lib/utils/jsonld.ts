import type { Doll } from "@/types";
import type { JournalArticle } from "@/types/journal";

export function productJsonLd(doll: Doll) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VALO ${doll.name}`,
    description: doll.narrative,
    image: doll.gallery[0] ?? doll.image,
    brand: {
      "@type": "Brand",
      name: "VALO Atelier",
    },
    offers: {
      "@type": "Offer",
      availability: doll.type === "Sold Out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Inquire for pricing",
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Material", value: doll.spec.material },
      { "@type": "PropertyValue", name: "Height", value: doll.spec.height },
      { "@type": "PropertyValue", name: "Joints", value: `${doll.spec.joints} points` },
      { "@type": "PropertyValue", name: "Series", value: doll.series },
      { "@type": "PropertyValue", name: "Year", value: doll.year },
    ],
  };
}

export function articleJsonLd(article: JournalArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "VALO Atelier",
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://valo-atelier.jp/journal/${article.slug}`,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VALO Atelier",
    url: "https://valo-atelier.jp",
    logo: "https://valo-atelier.jp/logo/logo.png",
    description: "High-end BJD atelier crafting artisan ball-jointed dolls with French resin.",
    sameAs: ["https://instagram.com", "https://weibo.com"],
  };
}
