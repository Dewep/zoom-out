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

    for (const key of Object.keys(model.definition)) {
      const options = model.definition[key]

      if (event[key] === undefined) {
        throw new Error(`${key}: Must be defined`)
      }

      if (options.array) {
        if (!Array.isArray(event[key])) {
          throw new Error(`${key}: Must be an array`)
        }
        document[key] = []
        for (const item of event[key]) {
          document[key].push(await this._field(options, item, key))
        }
      } else {
        document[key] = await this._field(options, event[key], key)
      }
    }

    return { collection: model.collection, model, document }
  }

  async _field (options, value, key) {
    if (value === null && options.nullable === true) {
      return null
    }
    if (options.type === 'date') {
      return this._date(value, key)
    }
    if (options.type === 'string') {
      return this._string(value, key)
    }
    if (options.type === 'boolean') {
      return this._boolean(value, key)
    }
    if (options.type === 'integer') {
      return this._integer(value, key)
    }
    throw new Error(`${key}: Unknown definition type "${options.type}"`)
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
    if (value !== Math.round(+value)) {
      throw new Error(`${key}: Bad integer format`)
    }
    return value
  }
}

module.exports = new Models()
