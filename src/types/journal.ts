export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: JournalBlock[];
  author: string;
  date: string;
  readTime: string;
  category: "Craft" | "Studio" | "Material" | "Community";
  coverImage: string;
  tags: string[];
}

export interface JournalBlock {
  type: "paragraph" | "heading" | "quote" | "image" | "divider";
  content?: string;
  attribution?: string;
  src?: string;
  alt?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  dollInterest?: string;
}
