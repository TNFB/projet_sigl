/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  images: {
    unoptimized: process.env.NEXT_PUBLIC_UNOPTIMIZED_IMAGES === 'true',
    domains: ['assets.aceternity.com'],
  },
}

export default nextConfig
