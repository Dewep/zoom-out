const models = require('../models')
const mongo = require('../mongo')
const events = require('./events')

class PrivateCtrl {
  async publish (body) {
    const errors = []

    for (const event of body.events) {
      try {
        await this._publishOne(event)
      } catch (err) {
        errors.push(err.message)
        console.warn('Publish event error', err.message)
      }
    }

    return { count: body.events.length, errors }
  }

  async _publishOne (event) {
    const { collection, document } = await models.validate(event)

    await mongo.insertOne(collection, document)
    events.emit(collection, document)
    return document
  }
}

module.exports = new PrivateCtrl()
