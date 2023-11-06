import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
const isProduction = process.env.NODE_ENV === 'production';

import pkg from 'next-compose-plugins'; // Import as a CommonJS module
const { withPlugins } = pkg;
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

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

export default withPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching
})(
  withPlugins(
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
