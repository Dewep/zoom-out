const models = require.main.require('./models')
const { DateTime } = require('luxon')
const mongo = require('../mongo')

class Models {
  async createIndexes () {
    for (const model of models) {
      for (const index of model.indexes) {
        await mongo.createIndex(model.collection, index)
      }
    }
  }

  get (modelSlug) {
    const model = models.find(model => model.collection === modelSlug)
    if (!model) {
      throw new Error('Model not found')
    }

    return model
  }

  async validate (event) {
    const model = this.get(event._model)

    const date = await this._date(event._date, '_date', false)
    const document = {
      date: date.toJSDate()
    }

    if (model.date && model.date.month) {
      document.datemonth = date.year * 100 + date.month
    }
    if (model.date && model.date.day) {
      document.dateday = date.year * 10000 + date.month * 100 + date.day
    }
    if (model.date && model.date.minute) {
      document.dateminute = date.year * 100000000 + date.month * 1000000 + date.day * 10000 + date.hour * 100 + date.minute
    }
    if (model.date && model.date.millisecond) {
      document.datemillisecond = date.year * 10000000000000 + date.month * 100000000000 + date.day * 1000000000 + date.hour * 10000000 + date.minute * 100000 + date.second * 1000 + date.millisecond
    }

    const fields = model.definition
    await this._validate(event, document, fields)

    return { collection: model.collection, model, document }
  }

  async _validate (value, document, fields) {
    for (const key of Object.keys(fields)) {
      const options = fields[key]

      if (value[key] === undefined) {
        if (options.nullable === true) {
          document[key] = null
        } else if (options.default !== undefined) {
          document[key] = options.default === 'function' ? options.default() : options.default
        } else {
          throw new Error(`${key}: Must be defined`)
        }

        continue
      }

      if (options.array) {
        if (!Array.isArray(value[key])) {
          throw new Error(`${key}: Must be an array`)
        }
        document[key] = []
        for (const item of value[key]) {
          document[key].push(await this._field(options, item, key))
        }
      } else {
        document[key] = await this._field(options, value[key], key)
      }
    }
  }

  async _field (options, value, key) {
    if (value === null && options.nullable === true) {
      if (options.default) {
        return typeof options.default === 'function' ? options.default() : options.default
      } else if (options.nullable) {
        return null
      }
    }
    switch (options.type) {
      case 'date': return this._date(value, key)
      case 'string': return this._string(value, key)
      case 'boolean': return this._boolean(value, key)
      case 'integer': return this._integer(value, key)
      case 'object': return this._object(value, key, options)
      default:
        throw new Error(`${key}: Unknown definition type "${options.type}"`)
    }
  }

  async _date (value, key, toJSDate = true) {
    const date = DateTime.fromISO(value)
    if (!value || !date.isValid) {
      throw new Error(`${key}: Bad date format`)
    }
    if (!toJSDate) {
      return date
    }
    return date.toJSDate()
  }

  async _string (value, key) {
    if (typeof value !== 'string') {
      throw new Error(`${key}: Bad string format`)
    }
    return value
  }

  async _boolean (value, key) {
    if (value !== true && value !== false) {
      throw new Error(`${key}: Bad boolean format`)
    }
    return value
  }

  async _integer (value, key) {
    value = Math.round(+value)
    if (isNaN(value)) {
      throw new Error(`${key}: Bad integer format`)
    }
    return value
  }

  async _object (value, key, options) {
    if (typeof value !== 'object') {
      throw new Error(`${key}: Bad objet format`)
    }
    if (!options || typeof options.fields !== 'object') {
      throw new Error(`${key}: 'fields' key must be present on object's type definition`)
    }
    const document = {}
    await this._validate(value, document, options.fields)
    return document
  }
}

module.exports = new Models()
