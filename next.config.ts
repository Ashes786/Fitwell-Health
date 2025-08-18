import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Don't ignore build errors in development
  },
  reactStrictMode: true, // Enable React strict mode for better development experience
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize webpack for development
      config.watchOptions = {
        ignored: ['node_modules/**/*'], // Only ignore node_modules
      };
      // Improve development performance
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: false, // Don't ignore ESLint errors
  },
  // Allow preview URLs for development
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://0.0.0.0:3000',
    'https://*.space.z.ai',
  ],
  // Configure compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
