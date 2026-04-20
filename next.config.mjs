/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static site - all content sourced from markdown at build time.
  // Emits HTML+assets to out/, deploys directly to Cloudflare Pages with no runtime.
  output: 'export',
  turbopack: {},
  // react-syntax-highlighter ships CJS with dynamic requires into refractor/lowlight;
  // Turbopack's external-module cache fails these at SSG time with
  // "request for './lib/util/merge.js' is not in cache". Transpiling it bundles those
  // paths through Turbopack's own resolver. See react-syntax-highlighter#600, vercel/next.js#86431.
  transpilePackages: ['react-syntax-highlighter'],
  images: {
    // Next's image optimizer requires a server; with static export, images are served as-is.
    // Originals already live on cdn.levine.io, so no optimization is lost.
    unoptimized: true,
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
