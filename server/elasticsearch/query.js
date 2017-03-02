const _ = require('lodash')
const getField = require('./types').getField

let types = ['boolean', 'date', 'ip', 'keyword', 'byte', 'short', 'integer', 'long', 'double', 'object']

let filter = (config, filters, exclude) => {
  let and = []

  _.forEach(filters, (values, key) => {
    if (key !== exclude && values.length) {
      let field = getField(config, key)

      if (field && ['boolean', 'ip', 'keyword'].indexOf(field.type) !== -1) {
        and.push({
          terms: {
            [key]: values
          }
        })
      } else if (field && ['date', 'byte', 'short', 'integer', 'long', 'double'].indexOf(field.type) !== -1) {
        if (values.length === 1) {
          and.push({
            terms: {
              [key]: values
            }
          })
        } else if (values.length === 2 && (values[0] || values[1])) {
          let range = {}
          if (values[0]) {
            range.gte = values[0]
          }
          if (values[1]) {
            range.lt = values[1]
          }
          and.push({
            range: {
              [key]: range
            }
          })
        }
      }
    }
  })

  return {
    bool: {
      filter: and
    }
  }
}

module.exports = {
  filter: filter
}
