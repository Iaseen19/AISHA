/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude problematic dependencies from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        sharp: false,
      };
    }
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
  }
}

module.exports = nextConfig