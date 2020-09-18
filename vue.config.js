const path = require('path')

module.exports = {
  productionSourceMap: false,

  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname))
  }
}
