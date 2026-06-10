export interface CommunityAuthor {
  name: string;
  avatar: string;
  location?: string;
}

export interface CommunityPost {
  id: string;
  image: string;
  alt: string;
  author: CommunityAuthor;
  likes: number;
  quote?: string;
  tags?: string[];
  dollName?: string;
  dollSeries?: string;
  type: "photo" | "quote" | "discussion";
  badge?: "Editor's Choice" | "Trending";
}

export type CollectiveFilter = "TRENDING" | "LATEST" | "EDITOR'S PICK";
