import type { CommunityPost } from "@/types";

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    image: "https://images.unsplash.com/photo-1544413660-299165566b1d?w=1200&h=1600&fit=crop&crop=faces",
    alt: "Noa bathed in golden morning light",
    author: {
      name: "Luna.Stargazer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
      location: "London, UK",
    },
    likes: 2400,
    dollName: "Noa",
    dollSeries: "Series 01",
    type: "photo",
    tags: ["Portrait", "Natural Light"],
  },
  {
    id: "post-2",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop",
    alt: "Resin catching morning light",
    author: {
      name: "K.Wong",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces",
    },
    likes: 1850,
    quote: "The way the resin catches the morning light is just breathtaking.",
    type: "photo",
    badge: "Editor's Choice",
    tags: ["Lighting", "Resin"],
  },
  {
    id: "post-3",
    image: "",
    alt: "",
    author: { name: "Community", avatar: "" },
    likes: 0,
    quote: "BJD is not just a hobby, it is the projection of self.",
    type: "discussion",
  },
  {
    id: "post-4",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&h=1400&fit=crop",
    alt: "Vintage Victorian outfit on display",
    author: {
      name: "Sarah.Crafts",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
    },
    likes: 856,
    type: "photo",
    tags: ["Outfit", "Victorian"],
  },
  {
    id: "post-5",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    alt: "Monochrome sculpt study",
    author: { name: "Anonymous", avatar: "" },
    likes: 432,
    tags: ["Monochrome", "Sculpt"],
    type: "photo",
  },
  {
    id: "post-6",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=1600&fit=crop&crop=faces",
    alt: "Golden hour Eos portrait",
    author: {
      name: "Mika.Light",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=faces",
      location: "Tokyo, Japan",
    },
    likes: 1200,
    dollName: "Eos",
    dollSeries: "Series 01",
    type: "photo",
    badge: "Editor's Choice",
    tags: ["Portrait", "Golden Hour"],
  },
  {
    id: "post-7",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=1600&fit=crop&crop=faces",
    alt: "Iris collection display",
    author: {
      name: "ResinDreams",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
      location: "Seoul, Korea",
    },
    likes: 678,
    tags: ["Collection", "Display"],
    type: "photo",
  },
  {
    id: "post-8",
    image: "https://images.unsplash.com/photo-1544413660-299165566b1d?w=1200&h=1600&fit=crop",
    alt: "Kaia in natural daylight",
    author: {
      name: "DollPhotographer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces",
      location: "Berlin, Germany",
    },
    likes: 945,
    dollName: "Kaia",
    dollSeries: "Series 02",
    type: "photo",
    tags: ["Natural Light", "Eco-Resin"],
  },
];

export function getCommunityPosts(): CommunityPost[] {
  return COMMUNITY_POSTS;
}
