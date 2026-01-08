/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow importing from src via absolute imports in webpack resolver
  webpack: (config) => {
    config.resolve.modules = [__dirname, 'node_modules', ...(config.resolve.modules || [])];
    return config;
  },
};

module.exports = nextConfig;
