const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    'main': path.resolve(__dirname, './src/index.ts')
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
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, './public/index.html'), to: path.resolve(__dirname, './build/index.html') },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}