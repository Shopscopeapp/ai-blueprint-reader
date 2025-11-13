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
    if (isServer) {
      // Disable pdfjs-dist worker for server-side
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist/build/pdf.worker.js': false,
      };
    } else {
      // For client-side, replace canvas with an empty stub module
      // react-pdf uses pdfjs-dist but doesn't need canvas on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': require.resolve('./lib/canvas-stub.js'),
      };
      
      // Use fallback to ignore canvas completely on client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'canvas': false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

