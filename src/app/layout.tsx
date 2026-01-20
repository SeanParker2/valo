import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: {
    template: "%s | VALO Atelier",
    default: "VALO | The Atelier",
  },
  description: "High-end BJD Integrated Platform. Explore the archive, simulate light in the lab, and join the collective.",
  openGraph: {
    title: "VALO | The Atelier",
    description: "High-end BJD Integrated Platform.",
    url: "https://valo.atelier",
    siteName: "VALO",
    images: [
      {
        url: "/images/texture-01.svg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-atelier-bg selection:bg-valo-gold/30 selection:text-white">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
