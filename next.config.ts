import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://72.155.73.159/files'}/:path*`,
      },
    ]
  },
};

export default nextConfig;
