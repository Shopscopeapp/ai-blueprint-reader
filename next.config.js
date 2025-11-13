/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace canvas with a stub module on client-side
      const path = require('path');
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': path.resolve(__dirname, 'lib/canvas-stub.js'),
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

