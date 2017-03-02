const express = require('express')
const bodyParser = require('body-parser')

const controllers = require('./controllers')

let app = express()

app.use(bodyParser.json({ limit: '10mb' }))

app.use((req, res, next) => {
  console.info(`[web.component] ${req.method} ${req.originalUrl} from ${req.ip}`)
  next()
})

app.use('/api/auth', controllers.auth.router())

app.use('/api', controllers.auth.authorizationCheck)

app.use('/api/models', controllers.model.router())

app.use(express.static('web/public'))

app.use((err, req, res, next) => {
  res.status(err.status || 400)
  res.json({ error: err.message })
  console.error(err.stack)
})

app.listen(3000, '127.0.0.1', () => {
  console.info('[web-component] server running on port', 3000)
})
