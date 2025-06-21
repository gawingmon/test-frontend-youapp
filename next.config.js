/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['techtest.youapp.ai'],
  },
};

module.exports = nextConfig; 