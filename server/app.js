const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const controllers = require('./controllers')

let app = express()

app.use(bodyParser.json({ limit: '10mb' }))

app.use((req, res, next) => {
  console.info(`[web.component] ${req.method} ${req.originalUrl} from ${req.ip}`)
  next()
})

// const https = require('https')
// app.all('/api/*', (req, res) => {
//   let body = undefined
//   const options = {
//     host: 'zoom-out.pandalab.fr',
//     path: req.url,
//     method: req.method,
//     headers: {
//       'Cache-Control': 'no-cache',
//       Authorization: 'API_KEY'
//     },
//     rejectUnauthorized: false
//   }
//   if (req.method === 'POST') {
//     body = JSON.stringify(req.body)
//     options.headers['Content-Type'] = 'application/json'
//     options.headers['Content-Length'] = body.length
//   }
//   const creq = https.request(options, function (cres) {
//     res.writeHead(cres.statusCode)
//     cres.setEncoding('utf8')
//     cres.on('data', function (chunk) {
//       res.write(chunk)
//     })
//     cres.on('close', function () {
//       res.end()
//     })
//     cres.on('end', function () {
//       res.end()
//     })
//   }).on('error', function (e) {
//     console.error(e.message)
//     res.writeHead(500)
//     res.end()
//   })
//   creq.end(body)
// })

app.use('/api/auth', controllers.auth.router())

app.use('/api', controllers.auth.authorizationCheck)

app.use('/api/models', controllers.model.router())

app.use(express.static(path.join(__dirname, '..', 'web', 'public')))

app.use((err, req, res, next) => {
  res.status(err.status || 400)
  res.json({ error: err.message })
  console.error(err.stack)
})

app.listen(3000, () => {
  console.info('[web-component] server running on port', 3000)
})
