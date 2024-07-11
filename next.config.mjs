// Import necessary packages
import pkg from 'next-compose-plugins';
import withPWA from 'next-pwa';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

// Refactored runtime caching strategies into a separate function for better readability and maintainability
const getRuntimeCaching = () => [
  {
    // Cache JavaScript files
    urlPattern: /\.(js)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'js-cache',
    },
  },
  {
    // Cache CSS files
    urlPattern: /\.(css)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'css-cache',
    },
  },
  {
    // Cache image files (JPEG, PNG, WebP, GIF, SVG)
    urlPattern: /\.(jpeg|jpg|ico|png|webp|gif|svg)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'image-cache',
    },
  },
  {
    // Cache fonts
    urlPattern: /\.(woff|woff2|ttf|otf)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'font-cache',
    },
  },
  {
    // Cache HTML documents
    urlPattern: /\.(html)$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'html-cache',
    },
  },
  {
    urlPattern: /^http.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'http-cache',
    },
  },
];

// Webpack configuration
const configureWebpack = (config, { isServer }) => {
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
};

// PWA configuration
const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProduction,
  runtimeCaching: getRuntimeCaching(), // Refactored to use the new function
  buildExcludes: [/middleware-manifest.\json$/],
  scope: '/',
  dynamicStartUrl: true,
  reloadOnOnline: false,
  // Add other options as needed
};

// Brotli compression configuration
const brotliOptions = {
  compress: true,
  poweredByHeader: false,
};

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: configureWebpack,
};

export default pkg([withPWA(pwaOptions), brotliOptions], nextConfig);
