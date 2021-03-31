const path = require('path')
const http = require('http')
const express = require('express')
const config = require.main.require('./config')
const jwt = require('../jwt')
const privateCtrl = require('../private')
const publicCtrl = require('../public')
const User = require('../user')
const ws = require('ws')

class Web {
  async run () {
    this.app = await this._app()

    this.server = http.createServer(this.app)

    this.ws = await this._ws()

    this.server.listen(2003, () => {
      console.info('[web] server running on port', 2003)
    })
  }

  async _app () {
    const app = express()

    app.use(express.json())

    app.use(function (req, res, next) {
      console.info(`[web.http] ${req.method} ${req.originalUrl} from ${req.ip}`)
      next()
    })

    app.use('/api/private', this._auth('private'))
    app.post('/api/private/publish/', this._async(req => privateCtrl.publish(req.body)))

    app.use('/api/public', this._auth('public'))
    app.get('/api/public/general/', this._async(req => publicCtrl.general(req)))
    app.post('/api/public/query/:report/:query/', this._async(req => publicCtrl.query(req)))

    app.use(express.static(path.join(__dirname, '..', '..', '..', '..', '..', 'dist')))
    app.use(express.static(path.join(__dirname, '..', '..', '..', 'dist')))

    app.use(function (req, res, next) {
      res.sendFile(path.join(__dirname, '..', '..', '..', '..', '..', 'dist', 'index.html'), {}, function (err) {
        if (err) {
          res.sendFile(path.join(__dirname, '..', '..', '..', 'dist', 'index.html'), {}, function (err2) {
            if (err2) {
              next(err2)
            }
          })
        }
      })
    })

    app.use((err, req, res, next) => {
      res.status(err.status || 400)
      res.json({ error: err.message })
      console.error(err.stack)
    })

    return app
  }

  _ws () {
    const wsServer = new ws.Server({
      server: this.server,
      path: '/events/'
    })

    wsServer.on('connection', (wsConnection, req) => {
      console.info('[web.ws] From', req.headers['x-forwarded-for'] || req.connection.remoteAddress)

      wsConnection.auth = { private: null, public: null }
      wsConnection.on('message', async (message) => {
        try {
          const { type, data } = JSON.parse(message)
          if (type === 'ping') {
            return wsConnection.send(JSON.stringify({ type: 'pong', data: {} }))
          }
          if (type === 'pong') {
            return wsConnection.send(JSON.stringify({ type: 'ping', data: {} }))
          }
          if (type === 'authPrivate') {
            if (config.apiKeys.includes(data.apiKey)) {
              wsConnection.auth.private = true
              return wsConnection.send(JSON.stringify({ type: 'auth', data: {} }))
            } else {
              throw new Error('Bad apiKey')
            }
          }
          if (!wsConnection.auth.private) {
            throw new Error('Not connected')
          }
          if (type === 'publish') {
            const response = await privateCtrl.publish(data)
            return wsConnection.send(JSON.stringify({ type: 'published', data: response }))
          }
          throw new Error('Bad type')
        } catch (err) {
          console.warn('[WS.error]', err)
          try {
            wsConnection.send(JSON.stringify({ type: 'error', data: { message: err.message } }))
          } catch (e) {}
          wsConnection.close()
        }
      })
    })

    return wsServer
  }

  _auth (type) {
    return this._async(async function (req) {
      req.user = null

      const authorization = req.headers.authorization || (req.body && req.body.authorization) || null

      if (type === 'private' && authorization && config.apiKeys.includes(authorization)) {
        return
      }

      if (type === 'public' && !config.jwtFront) {
        req.user = new User({})
        return
      }
      if (type === 'public' && authorization) {
        try {
          req.user = new User(await jwt.verify(authorization))
          return
        } catch (err) {}
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

module.exports = new Web()
