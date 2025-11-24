/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'picsum.photos'
    ],
  },
  // Disable font optimization to avoid network issues
  optimizeFonts: false,
  // Force localhost binding to avoid permission issues
  serverRuntimeConfig: {
    hostname: 'localhost'
  }
}

module.exports = nextConfig
