const express = require('express')
const config = require('../config')
const es = require('../elasticsearch')
const project = require('./project')

let projectDatabaseRouter = () => {
  let router = express.Router()

  router.param('model', project.projectModelParam)

  router.post('/:model/', (req, res, next) => {
    es.client.indices.create({
      index: req.modelId,
      body: es.types.createMapping(req.model)
    }).then(mapping => {
      res.json(mapping)
    }).catch(next)
  })

  router.delete('/:model/', (req, res, next) => {
    es.client.indices.delete({
      index: req.modelId
    }).then(mapping => {
      res.json(mapping)
    }).catch(next)
  })

  return router
}

module.exports.router = projectDatabaseRouter
