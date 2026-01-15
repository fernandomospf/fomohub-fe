/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep an (empty) turbopack config to avoid Turbopack vs webpack auto-detection error
  turbopack: {},
  // Development proxy to backend to avoid CORS while developing the frontend.
  // Requests to `/api/*` will be forwarded to the backend (default http://localhost:8080).
  // If you set NEXT_PUBLIC_IRONHUB_API_URL to a full URL (not a relative path), it will be used instead.
  async rewrites() {
    const raw = process.env.NEXT_PUBLIC_IRONHUB_API_URL;
    const defaultTarget = 'http://localhost:8080';
    const target = raw && !raw.startsWith('/') && !raw.includes('localhost:3000') ? raw : defaultTarget;

    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
