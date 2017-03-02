const express = require('express')
const config = require('../config')
const modelDatabase = require('./model_database')
const modelPush = require('./model_push')

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

  router.use('/:model/database', modelDatabase.router())

  router.use('/:model/push', modelPush.router())

  return router
}

module.exports.router = modelRouter
