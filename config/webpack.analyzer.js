const merge = require('webpack-merge')
const common = require('./webpack.prod.js')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;   // 分析工具

module.exports = merge(common, {
    plugins: [
        new BundleAnalyzerPlugin()
    ],
})
