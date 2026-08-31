import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ['@workspace/ui', '@workspace/tiptap'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.motakaro.com'
      },
      {
        protocol: 'https',
        hostname: '*.convex.cloud'
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com'
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      }
    ]
  }
};

export default withSentryConfig(nextConfig, {
  org: 'motakaro',
  project: 'motakaro-clients',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true
    }
  }
});
