/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages
  output: 'standalone',
  
  // Disable image optimization (not supported on Cloudflare Pages)
  images: {
    unoptimized: true,
  },
  
  // Skip trailing slash redirects
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
