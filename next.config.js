/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — deploys to Cloudflare as plain assets.
  // Data is fetched client-side from the Worker API (NEXT_PUBLIC_API_BASE).
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}

module.exports = nextConfig
