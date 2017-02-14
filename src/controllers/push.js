const express = require('express')

let pushRouter = () => {
  let router = express.Router()

  router.use((req, res, next) => {
    if (req.project && req.project !== req.params.project) {
      return next()
    }

    let err = new Error('Forbidden')
    err.status = 403
    next(err)
  })

  return router
}

module.exports.routes = pushRouter
