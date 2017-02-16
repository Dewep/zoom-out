const _ = require('lodash')
const assert = require('assert')

let types = ['boolean', 'date', 'ip', 'keyword', 'byte', 'short', 'integer', 'long', 'double']

let createMapping = (name, config) => {
  let generateProperties = (properties) => {
    let generatedProperties = {}

    _.forEach(properties, (property, propertyName) => {
      assert(types.indexOf(property.type) !== -1, `Unknow model type '${property.type}'`)

      generatedProperties[propertyName] = {
        type: property.type
      }

      if (property.type === 'object') {
        assert(property.properties !== undefined, `Properties not found for object '${propertyName}'`)
        generatedProperties[propertyName].properties = generateProperties(property.properties)
      }

      return generatedProperties
    })
  }

  return {
    mappings: {
      [name]: {
        properties: generateProperties(config)
      }
    }
  }
}

module.exports = {
  types: types,
  createMapping: createMapping
}
