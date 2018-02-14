const express = require('express')
const _ = require('lodash')
const config = require('../config')
const es = require('../elasticsearch')

let modelQueryRouter = () => {
  let router = express.Router()

  router.post('/facets/', (req, res, next) => {
    let filters = req.body.filters || {}

    let facets = {}
    _.forEach(req.model.facets, facet => {
      let field = es.types.getField(req.model.definition, facet)

      if (field && (field.type === 'keyword' || field.type === 'boolean')) {
        facets[facet] = {
          filter: es.query.filter(req.model.definition, filters, facet),
          aggregations: {
            missings: {
              missing: {
                field: facet
              }
            },
            values: {
              terms: {
                field: facet,
                size: 50
              }
            }
          }
        }
      }
    })

    let body = {
      size: 0,
      query: es.query.filter(req.model.definition, filters),
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
      let facetsBuckets = {}
      _.forEach(req.model.facets, facet => {
        if (results.aggregations.facets[facet]) {
          facetsBuckets[facet] = {
            total: results.aggregations.facets[facet].doc_count,
            missings: results.aggregations.facets[facet].missings.doc_count,
            error_rate: results.aggregations.facets[facet].values.doc_count_error_upper_bound,
            others: results.aggregations.facets[facet].values.sum_other_doc_count,
            buckets: _.map(results.aggregations.facets[facet].values.buckets, b => {
              return {
                key: b.key,
                total: b.doc_count
              }
            })
          }
        }
      })
      res.json({
        total: results.hits.total,
        buckets: facetsBuckets
      })
    }).catch(next)
  })

  router.post('/list/', (req, res, next) => {
    let filters = req.body.filters || {}
    let page = req.body.page || 1

    let body = {
      size: 25,
      from: 25 * (page - 1),
      query: es.query.filter(req.model.definition, filters)
    }

    if (req.body.sort) {
      body.sort = req.body.sort
    }

    es.client.search({
      index: `${config.project}-${req.modelId}`,
      body: body
    }).then(results => {
      res.json({
        total: results.hits.total,
        data: _.map(results.hits.hits, hit => {
          let item = hit._source
          item._id = hit._id
          return item
        })
      })
    }).catch(next)
  })

  router.post('/aggregations/', (req, res, next) => {
    let filters = req.body.filters || {}
    let filterExclude = req.body.filterExclude || null
    let aggregations = req.body.aggregations || {}

    let query = {
      size: 0,
      query: es.query.filter(req.model.definition, filters, filterExclude),
      aggregations: aggregations
    }

    es.client.search({
      index: `${config.project}-${req.modelId}`,
      body: query
    }).then(results => {
      res.json(results)
    }).catch(next)
  })

  return router
}

module.exports.router = modelQueryRouter
