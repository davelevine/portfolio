import pkg from 'next-compose-plugins';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

// Webpack configuration
const configureWebpack = (config, { isServer }) => {
  if (!isServer && isProduction) {
    config.optimization.minimizer.push(new TerserPlugin());
  }
  if (isProduction) {
    config.optimization.minimizer.push(new CssMinimizerPlugin());

    // Configure Gzip compression for assets
    config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|css|html|svg|woff|woff2|ttf|otf|jpeg|jpg|ico|png|webp|gif)$/,
        filename: '[path][base].gz',
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  }

  return config;
};

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: configureWebpack,
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
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: '/rss.xml',
      },
    ];
  },
};

export default pkg([], nextConfig);
