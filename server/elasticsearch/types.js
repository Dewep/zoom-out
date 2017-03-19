const _ = require('lodash')
const assert = require('assert')
const common = require('../../common')

let types = ['boolean', 'date', 'ip', 'keyword', 'byte', 'short', 'integer', 'long', 'double', 'object']
let numbers = ['short', 'integer', 'long', 'double']

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

let getBody = (config, body, fullBody) => {
  let data = {}

  if (!fullBody) {
    fullBody = body
  }

  _.forEach(config, (property, propertyName) => {
    if (property.type === 'object') {
      data[propertyName] = getBody(property.properties, body[propertyName] || {}, fullBody)
    } else if (body[propertyName] !== undefined && body[propertyName] !== null) {
      data[propertyName] = body[propertyName]
    } else if (_.isFunction(property.default)) {
      try {
        data[propertyName] = property.default(fullBody)
      } catch (e) {
        data[propertyName] = null
      }
    } else {
      data[propertyName] = property.default || null
    }

    if (data[propertyName] === undefined) {
      data[propertyName] = null
    }

    if (data[propertyName] !== null && property.type === 'boolean') {
      data[propertyName] = !!data[propertyName]
    } else if (data[propertyName] !== null && _.includes(numbers, property.type)) {
      data[propertyName] = +data[propertyName]
    }
  })

  return data
}

module.exports = {
  types: types,
  getField: common.model.getField,
  createMapping: createMapping,
  getBody: getBody
}
