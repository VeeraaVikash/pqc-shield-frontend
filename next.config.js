/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const b = process.env.BACKEND_URL || 'http://localhost:8000';
    return [
      // API rewrites
      { source: '/backend/:path*', destination: b + '/api/:path*' },
      // WebSocket rewrite — allows WS to go through Next.js proxy in production
      { source: '/ws/:path*', destination: b + '/api/ws/:path*' },
    ];
  },
};
module.exports = nextConfig;
