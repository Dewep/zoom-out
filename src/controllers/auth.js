const express = require('express')
const config = require('../config')

let authRouter = () => {
  let router = express.Router()

  return router
}

let authorizationCheck = (req, res, next) => {
  if (req.headers.authorization && config.apiKeys[req.headers.authorization]) {
    req.project = config.apiKeys[req.headers.authorization]
    return next()
  }

  let err = new Error('Unauthorized')
  err.status = 401
  next(err)
}

module.exports.routes = authRouter
module.exports.authorizationCheck = authorizationCheck
