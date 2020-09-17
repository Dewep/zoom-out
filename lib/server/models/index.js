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

  async get (modelSlug) {
    const model = models.find(model => model.collection === modelSlug)

    if (!model) {
      throw new Error('Model not found')
    }

    return model
  }

  async validate (event) {
    const model = await this.get(event._model)

    const document = {
      date: await this._date(event._date, '_date')
    }

    for (const key of Object.keys(model.definition)) {
      const options = model.definition[key]

      if (event[key] === undefined) {
        throw new Error(`${key}: Must be defined`)
      }

      if (event[key] === null && options.nullable === true) {
        document[key] = null
      } else if (options.type === 'date') {
        document[key] = await this._date(event[key], key)
      } else if (options.type === 'string') {
        document[key] = await this._string(event[key], key)
      } else if (options.type === 'boolean') {
        document[key] = await this._boolean(event[key], key)
      } else if (options.type === 'integer') {
        document[key] = await this._integer(event[key], key)
      } else {
        throw new Error(`${key}: Unknown definition type "${options.type}"`)
      }
    }

    return { collection: model.collection, model, document }
  }

  async _date (value, key) {
    const date = DateTime.fromISO(value)
    if (!value || !date.isValid) {
      throw new Error(`${key}: Bad date format`)
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
    if (value !== Math.round(+value)) {
      throw new Error(`${key}: Bad integer format`)
    }
    return value
  }
}

module.exports = new Models()
