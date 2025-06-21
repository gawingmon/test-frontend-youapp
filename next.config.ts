import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['techtest.youapp.ai'],
  },
};

export default nextConfig;
