/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  turbopack: {},
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      const raw = process.env.NEXT_PUBLIC_IRONHUB_API_URL;
      const defaultTarget = 'http://localhost:8080';
      const target =
        raw && !raw.startsWith('/') && !raw.includes('localhost:3000')
          ? raw
          : defaultTarget;

      return [
        {
          source: '/api/:path*',
          destination: `${target}/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
