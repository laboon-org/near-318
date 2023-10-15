/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false,
  redirects: async () => {
    return [];
  },
  rewrites: async () => [],
};

module.exports = nextConfig
