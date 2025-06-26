/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["blob.v0.dev"],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
