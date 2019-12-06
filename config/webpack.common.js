const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css插件

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: './src/index.js',
    // login: './src/pages/Login/index.js'
  },
  output: {
    filename: 'scripts/[name].js?[hash]',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      base: path.resolve(__dirname, './src/base') // 配置别名
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/, // 排除不处理的目录
    }, {
      test: /\.(less)$/,
      include: [/[\\/]node_modules[\\/].*antd/],
      use: ['style-loader', 'css-loader', {
        loader: 'less-loader', // compiles Less to CSS
        options: {
          modifyVars: {
            'primary-color': '#05A9F4',
          },
          javascriptEnabled: true
        }
      }]
    }, {
      test: /\.(sa|sc|c)ss$/,
      use: [
        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({
                root: loader.resourcePath
              }),
              require('cssnano')()
            ]
          }
        },
        'sass-loader',
      ],
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'images/[name].[hash:7].[ext]'
      }
    },]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true // 是否打印控制台
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    })
  ]
};
