const express = require('express')
const _ = require('lodash')
const config = require('../config')
const es = require('../elasticsearch')

let modelQueryRouter = () => {
  let router = express.Router()

  router.get('/facets/', (req, res, next) => {
    let filters = {
      'device.os': ['android']
    }

    let facets = {}
    _.forEach(req.model.facets, facet => {
      let field = es.types.getField(req.model.definition, facet)

      if (field && (field.type === 'keyword' || field.type === 'boolean')) {
        facets[facet] = {
          filter: es.query.filter(req.model.definition, filters, facet),
          aggregations: {
            values: {
              terms: {
                field: facet
              }
            }
          }
        }
      }
    })

    let body = {
      size: 0,
      aggregations: {
        facets: {
          global: {},
          aggregations: facets
        }
      }
    }

    es.client.search({
      index: `${config.project}-${req.modelId}`,
      body: body
    }).then(results => {
      let facetsBuckets = []
      _.forEach(req.model.facets, facet => {
        if (results.aggregations.facets[facet]) {
          facetsBuckets.push({
            key: facet,
            total: results.aggregations.facets[facet].doc_count,
            buckets: _.map(results.aggregations.facets[facet].values.buckets, b => {
              return {
                key: b.key,
                total: b.doc_count
              }
            })
          })
        }
      })
      res.json({
        total: results.aggregations.facets.doc_count,
        buckets: facetsBuckets
      })
    }).catch(next)
  })

  return router
}

module.exports.router = modelQueryRouter
