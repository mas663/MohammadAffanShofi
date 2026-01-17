import "./globals.css";
import type { Metadata } from "next";

const baseUrl = "https://mohammad-affan-shofi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Mohammad Affan Shofi — Portfolio",
  description: "Personal Portfolio Website",
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Mohammad Affan Shofi — Portfolio",
    description:
      "A 7th-semester ITS student focusing on Frontend, DevOps, and Mobile. Explore projects, skills, and experiences.",
    siteName: "Mohammad Affan Shofi - Portfolio",
    images: [
      { url: "/api/og", width: 1200, height: 630, alt: "Affan's Portfolio" },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Affan Shofi — Portfolio",
    description:
      "A 7th-semester ITS student focusing on Frontend, DevOps, and Mobile.",
    images: ["/api/og"],
  },
  icons: { icon: { url: "/favicon.png", type: "image/png" } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen scroll-smooth">{children}</body>
    </html>
  );
}
