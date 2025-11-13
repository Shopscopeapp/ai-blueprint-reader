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
      // For client-side, exclude canvas (react-pdf doesn't need it)
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'canvas': false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

