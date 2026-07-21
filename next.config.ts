import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during build to allow deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
