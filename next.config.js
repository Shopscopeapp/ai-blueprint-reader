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
      // For client-side, exclude canvas from bundling (it's a native Node.js module)
      // react-pdf uses pdfjs-dist but doesn't need canvas on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': false,
      };
      
      // Use fallback to ignore canvas completely on client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'canvas': false,
      };
      
      // Use NormalModuleReplacementPlugin to replace canvas with empty module
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^canvas$/, (resource) => {
          resource.request = false;
        })
      );
    }
    
    return config;
  },
}

module.exports = nextConfig

