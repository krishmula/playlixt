import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "*.scdn.co", // This will match any subdomain of scdn.co
      },
    ],
  },
};

export default nextConfig;
