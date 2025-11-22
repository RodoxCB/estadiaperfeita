/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Disable font optimization to avoid network issues
  optimizeFonts: false,
}

module.exports = nextConfig
