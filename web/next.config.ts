import type { NextConfig } from "next";

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Next.js 16 blocks cross-origin requests to dev resources (HMR / Fast Refresh)
  // by default. The dev server runs on 0.0.0.0:3000 but the browser loads the site
  // through the DDEV/Docksal proxy host, so without this the page never hydrates
  // and nothing interactive (theme toggle, menu) works. Allow the proxy hosts.
  allowedDevOrigins: [
    'd11-nextjs-starter.ddev.site',
    '*.ddev.site',
    '*.docksal.site',
  ],
  images: {
    // Next.js 16 blocks the image optimizer from fetching upstreams that resolve
    // to private IPs (SSRF protection). In local dev the Drupal backend lives on
    // a private Docker network IP (DDEV/Docksal), so allow it in development only.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      // Drupal image domain - kanopi.site
      {
        protocol: 'http',
        hostname: 'drupal.d11-nextjs-starter.dev.kanopi.cloud',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drupal.d11-nextjs-starter.dev.kanopi.cloud',
        pathname: '/**',
      },
      // Drupal image domain from environment
      ...(process.env.NEXT_IMAGE_DOMAIN
        ? [
            {
              protocol: 'http',
              hostname: process.env.NEXT_IMAGE_DOMAIN,
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: process.env.NEXT_IMAGE_DOMAIN,
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
  // Add rewrites to proxy Drupal API requests
  // This helps when the server-side Node.js can't reach the external URL
  async rewrites() {
    return [
      {
        source: '/api/drupal/:path*',
        destination: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://drupal.d11-nextjs-starter.dev.kanopi.cloud'}/:path*`,
      },
    ];
  },
  // Disable strict mode to avoid double fetches in development
  reactStrictMode: false,
};

export default withMDX(nextConfig);
