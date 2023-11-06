// Import necessary packages
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
import CompressionPlugin from 'compression-webpack-plugin'; // Added for Gzip compression
import pkg from 'next-compose-plugins';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

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

    // Configure Gzip compression for assets
    config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
      })
    );

    return config;
  },
};

export default withPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching
})(
  pkg(
    [
      {
        // Add Brotli compression
        compress: true,
        poweredByHeader: false,
      },
    ],
    nextConfig
  )
);
