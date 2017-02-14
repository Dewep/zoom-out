const express = require('express')
const projectDatabase = require('./project_database')
const projectPush = require('./project_push')

let projectRouter = () => {
  let router = express.Router()

  router.use((req, res, next) => {
    if (req.project && req.project !== req.params.project) {
      return next()
    }

    let err = new Error('Forbidden')
    err.status = 403
    next(err)
  })

  router.use('/database', projectDatabase.router())

  router.use('/push', projectPush.router())

  return router
}

module.exports.router = projectRouter
