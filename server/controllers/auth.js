const express = require('express')
const config = require('../config')

let authRouter = () => {
  let router = express.Router()

  return router
}

let authorizationCheck = (req, res, next) => {
  if (req.headers.authorization && config.apiKeys.indexOf(req.headers.authorization) !== -1) {
    return next()
  }

  let err = new Error('Unauthorized')
  err.status = 401
  next(err)
}

module.exports.router = authRouter
module.exports.authorizationCheck = authorizationCheck
