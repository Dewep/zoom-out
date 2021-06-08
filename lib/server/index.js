const models = require('./models')
const web = require('./web')

class Server {
  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()

    await web.run()
  }

  static async run () {
    const instance = new this()

    return instance.run()
  }
}

module.exports = Server
