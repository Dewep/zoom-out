const _ = require('lodash')
const assert = require('assert')

let types = ['boolean', 'date', 'ip', 'keyword', 'byte', 'short', 'integer', 'long', 'double', 'object']

let createMapping = (config, name) => {
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
    })

    return generatedProperties
  }

  return {
    mappings: {
      [name]: {
        properties: generateProperties(config)
      }
    }
  }
}

let getBody = (config, body) => {
  let data = {}

  _.forEach(config, (property, propertyName) => {
    if (body[propertyName] !== undefined) {
      if (property.type === 'object') {
        data[propertyName] = getBody(property.properties, body[propertyName])
      } else {
        data[propertyName] = body[propertyName]
      }
    }
  })

  return data
}

let getField = (config, fieldName) => {
  let field = null
  let fieldNames = fieldName.split('.')

  _.some(config, (property, propertyName) => {
    if (fieldNames.length && fieldNames[0] === propertyName) {
      if (property.type === 'object' && fieldNames.length > 1) {
        field = getField(property.properties, fieldNames.slice(1).join('.'))
        return true
      } else if (fieldNames.length === 1) {
        field = property
        return true
      }
    }
    return false
  })

  return field
}

module.exports = {
  types: types,
  getField: getField,
  createMapping: createMapping,
  getBody: getBody
}
