const express = require('express')
const _ = require('lodash')
const path = require('path')
const winston = require('winston')
const config = require('../config')
const es = require('../elasticsearch')

require('winston-daily-rotate-file')

let archivers = {}

let archive = (modelName, event) => {
  if (config.archiver) {
    if (!archivers[modelName]) {
      archivesDir = config.archiver
      if (config.archiver[0] !== '/') {
        archivesDir = path.join(__dirname, '..', '..', archivesDir)
      }

      archivers[modelName] = new winston.Logger({
        transports: [
          new winston.transports.DailyRotateFile({
            filename: path.join(archivesDir, `${modelName}.log`),
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            zippedArchive: true,
            level: 'info',
            timestamp: false,
            json: false,
            formatter: opts => opts.message
          })
        ]
      })
    }
    archivers[modelName].info(new Buffer(JSON.stringify(event)).toString('base64'))
  }
}

let indexEvent = (modelId, modelDefinition, event) => {
  let data = es.types.getBody(modelDefinition, event)

  if (!_.size(data)) {
    return Promise.reject(new Error('Empty body'))
  }

  return es.client.index({
    index: `${config.project}-${modelId}`,
    type: modelId,
    body: data
  })
}

let modelPushRouter = () => {
  let router = express.Router()

  router.post('/', (req, res, next) => {
    if (req.query.archive !== '0') {
      archive(req.modelId, req.body)
    }

    if (!_.isArray(req.body)) {
      req.body = [req.body]
    }

    let data = {
      success: [],
      error: []
    }

    Promise.all(_.map(req.body, event => {
      return indexEvent(req.modelId, req.model.definition, event)
        .catch((err) => {
          if (err.displayName === 'RequestTimeout') {
            return indexEvent(req.modelId, req.model.definition, event)
          }
          return Promise.reject(err)
        })
        .then(doc => data.success.push(doc._id))
        .catch(err => {
          console.error('Failed to index:', err, event)
          data.error.push(err)
        })
    })).then(() => {
      if (data.error.length) {
        res.status(400)
      }

      res.json(data)
    })
  })

  router.post('/migrate', (req, res, next) => {

    if (!_.isArray(req.body)) {
      req.body = [req.body]
    }

    let data = []

    _.forEach(req.body, event => {
      if (event.application) {
        if (!event.application.platform && event.application.is_mobile !== undefined) {
          event.application.platform = event.application.is_mobile ? 'mobile' : 'web'
          delete event.application.is_mobile
        }
      }

      if (event.chan_id !== undefined) {
        event.chan = event.chan_id
        delete event.chan_id
      }

      if (event.user_id !== undefined) {
        event.user = event.user_id
        delete event.user_id
      }

      data.push(event)
    })

    if (data.length) {
      archive(req.modelId, data)
    }

    res.json({})
  })

  return router
}

module.exports.router = modelPushRouter
