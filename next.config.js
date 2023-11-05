/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer.push(new TerserPlugin());
    }

    config.optimization.minimizer.push(new CssMinimizerPlugin());

    return config;
  },
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
