const express = require('express')
const config = require('../config')
const modelDatabase = require('./model_database')
const modelPush = require('./model_push')
const modelQuery = require('./model_query')

let modelRouter = () => {
  let router = express.Router()

  router.param('model', (req, res, next, model) => {
    if (config.models && config.models[model]) {
      req.model = config.models[model]
      req.modelId = model
      return next()
    }

    let err = new Error('Model not found')
    err.status = 404
    next(err)
  })

  router.get('/', (req, res, next) => {
    res.json({
      project: config.project,
      models: config.models
    })
  })

  router.use('/:model/database', modelDatabase.router())

  router.use('/:model/push', modelPush.router())

  router.use('/:model/query', modelQuery.router())

  return router
}

module.exports.router = modelRouter
