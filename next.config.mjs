/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_NEON_AUTH_URL: process.env.NEON_AUTH_BASE_URL || process.env.VITE_NEON_AUTH_URL,
  },
}

export default nextConfig
