const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const config = require('./config')
const splitChunks = require('./config/splitChunksPlugin')

module.exports = {
  entry: path.resolve(config.APP_PATH, 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(config.ROOT_PATH, 'dist')
  },
  optimization: {
    usedExports: true,  // Tree Shaking // import { } from '...' 清除未使用的模块
    splitChunks: Object.assign({}, splitChunks)
  },
  devServer: {
		contentBase: './dist', // 配置开发服务运行时的文件根目录
    open: false, // 自动打开浏览器
    compress: true, // 开发服务器是否启动gzip等压缩
    port: 9999,
    proxy: { //配置跨域，访问的域名会被代理到本地的3000端口
      '/api': 'http://localhost:3000'
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              outputPath: 'images/',
              name: '[name]_[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', //打包后的图片名字，后缀和打包的之前的图片一样
              outputPath: 'images/' //图片打包后的地址
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(config.APP_PATH, 'components'),
      static: path.resolve(config.STATIC_PATH),
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/template.html", // 在打包之后，以.html为模板，把打包生成的js自动引入到这个html文件中
      filename: "./index.html"
    }),
    new CleanWebpackPlugin({
      dir: true
    }) // 在打包之前，可以删除dist文件夹下的所有内容
  ],
};

