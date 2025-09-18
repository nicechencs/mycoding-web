/** @type {import('next').NextConfig} */
const nextConfig = {
  // 暂时禁用实验性类型路由以修复导航问题
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/avataaars/**',
      },
      {
        protocol: 'https',
        hostname: 'nextjs.org',
        port: '',
        pathname: '/static/images/**',
      },
      {
        protocol: 'https',
        hostname: 'react.dev',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Optimize bundle size
  swcMinify: true,

  // Custom headers for security
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Do not block production builds on ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
