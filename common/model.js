const _ = require('lodash')

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
  getField: getField
}
