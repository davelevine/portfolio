/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use Turbopack (Next.js 16 default) - handles minification and optimization automatically
  turbopack: {},
  // react-syntax-highlighter ships CJS with dynamic requires into refractor/lowlight;
  // Turbopack's external-module cache fails these at SSG time with
  // "request for './lib/util/merge.js' is not in cache". Transpiling it bundles those
  // paths through Turbopack's own resolver. See react-syntax-highlighter#600, vercel/next.js#86431.
  transpilePackages: ['react-syntax-highlighter'],
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
