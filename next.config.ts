import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS hostnames
      },
    ],
  },
  async redirects() {
    return [{ source: "/og", destination: "/api/og", permanent: false }];
  },
};

export default nextConfig;
