const express = require('express')
const config = require('../config')

let authRouter = () => {
  let router = express.Router()

  return router
}

let authorizationCheck = (req, res, next) => {
  if (req.headers.authorization) {
    req.projectId = config.apiKeys[req.headers.authorization]
    if (req.projectId && config.projects[req.projectId]) {
      req.project = config.projects[req.projectId]
      return next()
    }
  }

  let err = new Error('Unauthorized')
  err.status = 401
  next(err)
}

module.exports.router = authRouter
module.exports.authorizationCheck = authorizationCheck
