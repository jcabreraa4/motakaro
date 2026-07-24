import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ['@workspace/ui', '@workspace/tiptap'],
  turbopack: {
    resolveAlias: {
      'prosemirror-model': 'prosemirror-model',
      'prosemirror-state': 'prosemirror-state',
      'prosemirror-view': 'prosemirror-view',
      'prosemirror-transform': 'prosemirror-transform',
      'prosemirror-collab': 'prosemirror-collab'
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
  project: 'motakaro-admins',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true
    }
  }
});
