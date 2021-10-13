const models = require('./models')
const web = require('./web')
const task = require('./task')

class Server {
  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()

    await task.run()
    await web.run()
  }

  static async run () {
    const instance = new this()

    return instance.run()
  }
}

module.exports = Server
