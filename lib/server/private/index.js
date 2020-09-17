const config = require.main.require('./config')
const models = require('../models')
const mongo = require('../mongo')

class PrivateCtrl {
  async publish (req) {
    for (const event of req.body.events) {
      await this._publishOne(event)
    }

    return {}
  }

  async _publishOne (event) {
    const { collection, document } = await models.validate(event)

    await mongo.insertOne(collection, document)

    return document
  }
}

module.exports = new PrivateCtrl()
