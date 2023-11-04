/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
};

module.exports = withPlugins(
  [
    {
      // Add Brotli compression
      compress: true,
      poweredByHeader: false,
    },
  ],
  nextConfig
);
