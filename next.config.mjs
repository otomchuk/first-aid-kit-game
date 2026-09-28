/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/first-aid-kit-game',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig