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
      archivers[modelName] = new winston.Logger({
        transports: [
          new winston.transports.DailyRotateFile({
            filename: path.join(config.archiver, `${modelName}.log`),
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

let modelPushRouter = () => {
  let router = express.Router()

  router.post('/', (req, res, next) => {
    let data = es.types.getBody(req.model.definition, req.body)

    if (!_.size(data)) {
      return next(new Error('Empty body'))
    }

    archive(req.modelId, req.body)

    es.client.index({
      index: `${config.project}-${req.modelId}`,
      type: req.modelId,
      body: data
    }).then(doc => {
      res.json({id: doc._id})
    }).catch(next)
  })

  return router
}

module.exports.router = modelPushRouter
