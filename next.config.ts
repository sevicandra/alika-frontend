import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.kemenkeu.go.id",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
