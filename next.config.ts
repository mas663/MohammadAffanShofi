import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/og", destination: "/api/og", permanent: false }];
  },
};

export default nextConfig;
