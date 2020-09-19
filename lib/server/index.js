const express = require('express')
const config = require.main.require('./config')
// const path = require('path')
// const mongo = require('./mongo')
const jwt = require('./jwt')
const privateCtrl = require('./private')
const publicCtrl = require('./public')
const models = require('./models')
// const { Settings } = require('luxon')

class Server {
  async run () {
    // Settings.defaultZoneName = 'utc'
    await models.createIndexes()
    await this._server()
  }

  async _server () {
    const app = express()

    app.use(express.json())

    app.use(function (req, res, next) {
      console.info(`[web.component] ${req.method} ${req.originalUrl} from ${req.ip}`)
      next()
    })

    app.use('/api/private', this._auth('private'))
    app.post('/api/private/publish/', this._async(req => privateCtrl.publish(req)))

    app.use('/api/public', this._auth('public'))
    app.get('/api/public/general/', this._async(req => publicCtrl.general(req)))
    app.post('/api/public/query/:report/:query/', this._async(req => publicCtrl.query(req)))

    // app.use(express.static(path.join(__dirname, '..', 'web', 'public')))

    app.use((err, req, res, next) => {
      res.status(err.status || 400)
      res.json({ error: err.message })
      console.error(err.stack)
    })

    app.listen(2003, () => {
      console.info('[web-component] server running on port', 2003)
    })
  }

  _auth (type) {
    return this._async(async function (req) {
      if (type === 'private' && req.headers.authorization && config.apiKeys.indexOf(req.headers.authorization) !== -1) {
        return
      }

      if (type === 'public' && !config.jwtFront) {
        req.user = {}
        return
      }
      if (type === 'public' && req.headers.authorization) {
        req.user = await jwt.verify(req.headers.authorization)
        return
      }

      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    }, true)
  }

  _async (handler, middleware = false) {
    return async function (req, res, next) {
      try {
        const result = await handler(req, res)
        if (!middleware) {
          res.json(result)
        } else {
          next()
        }
      } catch (err) {
        next(err)
      }
    }
  }
}

module.exports = new Server()
