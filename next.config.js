/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Add custom webpack rules
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader'
    })

    // Return the modified config
    return config
  },
  async rewrites() {
    return [
      {
        source: '/share/[shareKey]',
        destination: '/share/[shareKey]'
      }
    ]
  }
}

module.exports = nextConfig
