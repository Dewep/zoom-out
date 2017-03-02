const express = require('express')
const _ = require('lodash')
const config = require('../config')
const es = require('../elasticsearch')

let modelPushRouter = () => {
  let router = express.Router()

  router.post('/', (req, res, next) => {
    let data = es.types.getBody(req.model.definition, req.body)

    if (!_.size(data)) {
      return next(new Error('Empty body'))
    }

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
