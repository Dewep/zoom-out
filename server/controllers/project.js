const express = require('express')
const projectDatabase = require('./project_database')
const projectPush = require('./project_push')

let projectRouter = () => {
  let router = express.Router()

  router.param('project', (req, res, next, project) => {
    if (req.project && req.projectId === project) {
      return next()
    }

    let err = new Error('Forbidden')
    err.status = 403
    next(err)
  })

  router.use('/:project/models', projectDatabase.router())

  router.use('/:project/push', projectPush.router())

  return router
}

let projectModelParam = (req, res, next, model) => {
  if (req.project && req.project.models && model && req.project.models[model]) {
    req.model = req.project.models[model]
    req.modelId = model
    return next()
  }

  let err = new Error('Model not found')
  err.status = 404
  next(err)
}

module.exports.router = projectRouter
module.exports.projectModelParam = projectModelParam
