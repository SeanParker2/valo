import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VALO | The Soul in Resin",
  description: "High-end Ball-Jointed Doll (BJD) Atelier. Orchestrating light, shadow, and resin.",
  openGraph: {
    title: "VALO | The Soul in Resin",
    description: "High-end Ball-Jointed Doll (BJD) Atelier. Orchestrating light, shadow, and resin.",
    url: "https://valo-atelier.com",
    siteName: "VALO",
    images: [
      {
        url: "/images/texture-06.svg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}
