const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin')
const path = require('path')

module.exports = {
  productionSourceMap: false,

  configureWebpack: config => {
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.plugins) {
      config.resolve.plugins = []
    }
    if (config.resolve.alias && config.resolve.alias['@']) {
      delete config.resolve.alias['@']
    }
    config.resolve.plugins.push(
      new AliasPlugin(
        'described-resolve',
        [
          {
            name: '@',
            alias: [
              path.resolve(__dirname),
              path.resolve(__dirname, 'lib', 'front')
            ]
          }
        ],
        'resolve'
      )
    )
  }
}
