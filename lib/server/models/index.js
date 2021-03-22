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
