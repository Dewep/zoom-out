const express = require('express')
const _ = require('lodash')
const config = require('../config')
const es = require('../elasticsearch')
const project = require('./project')

let projectPushRouter = () => {
  let router = express.Router()

  router.param('model', project.projectModelParam)

  router.post('/:model/', (req, res, next) => {
    let data = es.types.getBody(req.body, req.model)

    if (!_.size(data)) {
      console.log(req.body, data)
      return next(new Error('Empty body'))
    }

    es.client.index({
      index: `${req.projectId}-${req.modelId}`,
      type: req.modelId,
      body: data
    }).then(doc => {
      res.json({id: doc._id})
    }).catch(next)
  })

  return router
}

module.exports.router = projectPushRouter
