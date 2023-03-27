const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    'main': path.resolve(__dirname, './src/index.js')
  },
  output: {
    path: path.resolve(__dirname, './build'),
      filename: '[name].bundle.js',
  },
  mode: 'development',
  devServer: {
    watchFiles: path.resolve(__dirname, './src/**/*'),
    open: true,
    compress: true,
    port: 3000,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/index.html'), to: path.resolve(__dirname, './build/index.html') },
        { from: path.resolve(__dirname, './src/style.css'), to: path.resolve(__dirname, './build/style.css') },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}