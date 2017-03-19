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

let getValueLabel = (field, value) => {
  if (field && field.values && field.values[value] !== undefined) {
    return field.values[value]
  }

  return value
}

let getFieldValueLabel = (config, fieldName, value) => {
  let field = getField(config, fieldName)

  return getValueLabel(field, value)
}

module.exports = {
  getField: getField,
  getValueLabel: getValueLabel,
  getFieldValueLabel: getFieldValueLabel
}
