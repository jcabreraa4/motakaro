import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud'
      },
      {
        protocol: 'https',
        hostname: '*.motakaro.com'
      }
    ]
  }
};

export default nextConfig;
