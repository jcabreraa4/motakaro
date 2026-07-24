import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ['@workspace/ui', '@workspace/tiptap'],
  turbopack: {
    resolveAlias: {
      'prosemirror-model': require.resolve('prosemirror-model'),
      'prosemirror-state': require.resolve('prosemirror-state'),
      'prosemirror-view': require.resolve('prosemirror-view'),
      'prosemirror-transform': require.resolve('prosemirror-transform')
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
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
