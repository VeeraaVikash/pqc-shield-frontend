/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const b = process.env.BACKEND_URL || 'http://localhost:8000';
    return [{ source: '/backend/:path*', destination: b + '/api/:path*' }];
  },
};
module.exports = nextConfig;
