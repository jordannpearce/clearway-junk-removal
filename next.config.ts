import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  serverExternalPackages: ["pg"],
};

export default nextConfig;
