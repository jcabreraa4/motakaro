import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.motakaro.com'
      },
      {
        protocol: 'https',
        hostname: '*.convex.cloud'
      }
    ]
  }
};

export default nextConfig;
