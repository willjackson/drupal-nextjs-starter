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
  images: {
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
