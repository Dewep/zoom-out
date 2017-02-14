const _ = require('lodash')

let defaultConfig = require('./config.default') || {}
let localConfig = {}

try {
  localConfig = require('./config.local')
} catch (e) {
  if (e.message !== `Cannot find module './config.local'`) {
    throw e
  }
}

function customizerMerge (objValue, srcValue) {
  if (_.isArray(objValue)) {
    return srcValue
  }
}

module.exports = _.mergeWith(defaultConfig, localConfig, customizerMerge)
