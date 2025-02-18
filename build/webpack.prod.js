/**
 * @file prod 配置
 * @author atom-yang
 */

/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {OUTPUT_PATH} = require('./util');
const nodeModule = (...segments) => path.join(__dirname, '../', 'node_modules', ...segments);

const prodConfig = {
  mode: 'production',
  resolve: {
    alias: {
      'react': nodeModule('react', 'umd', 'react.production.min.js'),
      'react-dom': nodeModule('react-dom', 'umd', 'react-dom.production.min.js')
    }
  },
  output: {
    path: OUTPUT_PATH,
    filename: '[name].[chunkhash:5].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css'
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    removeEmptyChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          autoprefixer: {
            disable: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial'
        },
        default: false
      }
    },
    runtimeChunk: {
      name: entryPoint => `runtime.${entryPoint.name}`
    }
  }
};


module.exports = merge(baseConfig, prodConfig);
