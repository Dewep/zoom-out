const models = require('./models')
const Web = require('./web')
const task = require('./task')

class Server {
  constructor (services) {
    services.task = task
    services.httpServer = services.httpServer || new Web()

    this.services = Object.values(services)
  }

  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()

    for (const service of this.services) {
      await service.run()
    }
  }

  static async run () {
    const instance = new this()

    return instance.run()
  }
}

module.exports = Server
