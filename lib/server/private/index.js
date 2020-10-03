const models = require('../models')
const mongo = require('../mongo')

class PrivateCtrl {
  async publish (body) {
    for (const event of body.events) {
      await this._publishOne(event)
    }

    return { count: body.events.length }
  }

  async _publishOne (event) {
    const { collection, document } = await models.validate(event)

    await mongo.insertOne(collection, document)

    return document
  }
}

module.exports = new PrivateCtrl()
