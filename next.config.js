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
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // For client-side, exclude canvas (react-pdf doesn't need it)
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'canvas': false,
      };
      
      // Use NormalModuleReplacementPlugin to replace canvas imports with empty module
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^canvas$/,
          require.resolve('./lib/canvas-empty.js')
        )
      );
    }
    
    return config;
  },
}

module.exports = nextConfig

