import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mohammad Affan Shofi - Portfolio",
  description: "Personal Portfolio Website",
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
