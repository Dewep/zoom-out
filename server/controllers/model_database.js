const express = require('express')
const config = require('../config')
const es = require('../elasticsearch')

let modelDatabaseRouter = () => {
  let router = express.Router()

  router.post('/', (req, res, next) => {
    es.client.indices.create({
      index: `${config.project}-${req.modelId}`,
      body: es.types.createMapping(req.modelId, req.model.definition)
    }).then(mapping => {
      res.json(mapping)
    }).catch(next)
  })

  router.delete('/', (req, res, next) => {
    es.client.indices.delete({
      index: `${config.project}-${req.modelId}`,
    }).then(mapping => {
      res.json(mapping)
    }).catch(next)
  })

  return router
}

module.exports.router = modelDatabaseRouter
