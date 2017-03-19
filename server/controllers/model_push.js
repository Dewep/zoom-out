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
    if (req.param('archive', '1') !== '0') {
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
        .then(doc => data.success.push(doc._id))
        .catch(err => data.error.push(err))
    })).then(() => {
      if (data.error.length) {
        res.status(400)
      }

      res.json(data)
    })
  })

  return router
}

module.exports.router = modelPushRouter
