const basePath = ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig