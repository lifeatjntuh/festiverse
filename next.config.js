const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack configuration
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        compression: false,
        buildDependencies: {
          config: [__filename],
        },
      }
    }
    return config
  },
}

module.exports = withPWA(nextConfig)