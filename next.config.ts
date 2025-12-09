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
};

export default nextConfig;
