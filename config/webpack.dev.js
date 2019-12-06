const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  performance: {
    hints: false,
  },
  watchOptions: {
    //不监听的node_modules目录下的文件,
    ignored: /node_modules/,
  },
  devServer: {
    host: 'localhost',
    port: '8088',
    open: true,
    compress: true,
    proxy: {
      '/**': {
        target: 'http://10.99.44.180:8044',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html'
          }
        },
        onProxyReq: function (proxyReq, req, res) {
          proxyReq.setHeader('tokenId', 'c45772ed9c122af22c92f837ff89443f')
          proxyReq.setHeader('cookie', '1B9CE1A45478173DD0B9C729D5F6AE0C')
        },
      },
    }
  },
})

