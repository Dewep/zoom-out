const models = require('./models')
const web = require('./web')

class Server {
  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()

    await web.run()
  }
}

module.exports = new Server()
