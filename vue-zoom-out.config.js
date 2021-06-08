const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin')
const path = require('path')

const zoomOutRootPathDefault = path.resolve(__dirname, 'lib', 'front')

module.exports = function ({
  projectRootPath = null,
  zoomOutRootPath = zoomOutRootPathDefault,
  chainWebpackExtra = null,
  configureWebpackExtra = null,
  devServer = null
}) {
  const vueConfig = {}

  vueConfig.productionSourceMap = false

  if (devServer) {
    vueConfig.devServer = devServer
  }

  vueConfig.css = {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            path.join(zoomOutRootPath, 'styles')
          ]
        }
      }
    }
  }
  if (projectRootPath) {
    vueConfig.css.loaderOptions.sass.sassOptions.includePaths.unshift(path.join(projectRootPath, 'styles'))
  }

  vueConfig.chainWebpack = function (config) {
    config.entry('app').clear()
    config.entry('app').add(path.join(zoomOutRootPath, 'main.js'))

    if (chainWebpackExtra) {
      chainWebpackExtra(config)
    }
  }

  vueConfig.configureWebpack = function (config) {
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.plugins) {
      config.resolve.plugins = []
    }
    if (config.resolve.alias && config.resolve.alias['@']) {
      delete config.resolve.alias['@']
    }
    const alias = [zoomOutRootPath]
    if (projectRootPath) {
      alias.unshift(projectRootPath)
    }
    const aliasPlugin = new AliasPlugin('described-resolve', [{ name: '@', alias }], 'resolve')
    config.resolve.plugins.push(aliasPlugin)

    if (configureWebpackExtra) {
      configureWebpackExtra(config)
    }
  }

  return vueConfig
}
