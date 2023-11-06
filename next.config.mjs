// Import necessary packages
import withPWA from 'next-pwa';
import CompressionPlugin from 'compression-webpack-plugin';
import pkg from 'next-compose-plugins';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

// Define runtime caching strategies here
const runtimeCaching = [
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

export default pkg(
  [
    withPWA({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: !isProduction,
      runtimeCaching, // Use the runtimeCaching configuration defined above
      scope: '/', // Customize PWA scope if needed
      dynamicStartUrl: true, // If your start URL varies based on user state
      reloadOnOnline: false, // Decide how the app refreshes when online
      // Add other options as needed
    }),
    {
      // Add Brotli compression
      compress: true,
      poweredByHeader: false,
    },
  ],
  nextConfig
);
