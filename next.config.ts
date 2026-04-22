import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://72.155.73.159/:path*",
      },
    ];
  },
};

export default nextConfig;