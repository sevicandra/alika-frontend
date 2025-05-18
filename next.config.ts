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
    webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
