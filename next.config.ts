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
    formats: ["image/avif", "image/webp"], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.node": {
        loaders: ["node-loader"],
      },
    },
  },
  reactStrictMode: true,
  experimental: {
    proxyClientMaxBodySize: "120mb",
  },
};

export default nextConfig;
