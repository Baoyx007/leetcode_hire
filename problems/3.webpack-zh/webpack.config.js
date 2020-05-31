const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/index.js',

  mode: 'production',

  output: {
    filename: '[name].[chunkhash:8].js',
  },

  optimization: {
    runtimeChunk: true,
    namedChunks: true,
    namedModules: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
        },
        common: {
          test: /[\\/]src[\\/]common[\\/]/,
          enforce: true,
        },
        module1: {
          test: /[\\/]src[\\/]module-1[\\/]/,
          enforce: true,
        },
        module2: {
          test: /[\\/]src[\\/]module-2[\\/]/,
          enforce: true,
        },
      },
    },
  },

  plugins: [new CleanWebpackPlugin()],
};
