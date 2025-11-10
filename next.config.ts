import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable standalone build for Vercel compatibility
  output: 'standalone',
  // Disable custom server features that aren't compatible with Vercel
  reactStrictMode: false,
  eslint: {
    // Build时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;