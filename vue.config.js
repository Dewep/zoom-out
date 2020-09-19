const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin')
const path = require('path')

module.exports = {
  productionSourceMap: false,

  css: {
    loaderOptions: {
      sass: {
        // prependData: @import '@/assets/sass/_theme.scss';,
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'styles'),
            path.resolve(__dirname, 'lib', 'front', 'styles')
          ]
        }
      }
    }
  },

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
