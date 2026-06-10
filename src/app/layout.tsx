import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { organizationJsonLd } from "@/lib/utils/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL("https://valo-atelier.jp"),
  title: {
    template: "%s | VALO Atelier",
    default: "VALO | The Atelier",
  },
  description:
    "The Soul in Resin. VALO is a high-end BJD atelier crafting artisan ball-jointed dolls with French resin, precision engineering, and obsessive attention to light.",
  keywords: ["BJD", "ball-jointed doll", "artisan doll", "French resin", "luxury doll", "VALO", "atelier", "collector", "handmade"],
  authors: [{ name: "VALO Atelier" }],
  creator: "VALO Atelier",
  openGraph: {
    title: "VALO | The Atelier",
    description: "The Soul in Resin. Artisan BJD dolls crafted with French resin and precision engineering.",
    url: "https://valo-atelier.jp",
    siteName: "VALO Atelier",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VALO | The Atelier",
    description: "The Soul in Resin. Artisan BJD dolls crafted with French resin and precision engineering.",
  },
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="antialiased bg-paper selection:bg-gold/30 selection:text-white">
        <a href="#main-content" className="skip-nav">Skip to content</a>
        <ScrollProgress />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
