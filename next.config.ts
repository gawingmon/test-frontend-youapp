import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['techtest.youapp.ai'],
  },
};

export default nextConfig;
