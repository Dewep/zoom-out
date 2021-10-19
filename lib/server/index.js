const models = require('./models')
const Web = require('./web')
const task = require('./task')

class Server {
  constructor (webServer) {
    this.task = task
    this.webServer = webServer || new Web()
  }

  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()

    await this.task.run()
    await this.webServer.run()
  }

  static async run () {
    const instance = new this()

    return instance.run()
  }
}

module.exports = Server
