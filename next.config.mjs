/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use Turbopack (Next.js 16 default) - handles minification and optimization automatically
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.levine.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
