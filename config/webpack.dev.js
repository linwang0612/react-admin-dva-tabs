const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
    port: '8088',
    historyApiFallback: { index: '/' },
    open: true,
    compress: true,
    proxy: {
      '/**': {
        target: 'http://10.99.44.190:8080',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html'
          }
        }
      },
    }
  },
  performance: {
    hints: false,
  },
  watchOptions: {
    //不监听的node_modules目录下的文件,
    ignored: /node_modules/,
  },
})

