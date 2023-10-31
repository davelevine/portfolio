/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
};

module.exports = withPlugins(
  [
    withImages, // Enable the next-images plugin if not already enabled
    {
      // Add Brotli compression to Next.js
      compress: true,
      poweredByHeader: false,
    },
  ],
  nextConfig
);
