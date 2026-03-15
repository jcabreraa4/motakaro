/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        protocol: 'https',
        hostname: '*.convex.cloud'
      }
    ]
  }
};

export default nextConfig;
