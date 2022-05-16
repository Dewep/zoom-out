const reports = require.main.require('./reports')
const models = require('../../models')
const pick = require('lodash/pick')

class QuerySearch {
  constructor ({ body, user }, reportSlug, querySlug) {
    this.body = body || {}
    this.filters = this.body.filters || {}
    this.page = this.body.page || 1
    this.user = user

    this.user.reportAccess(reportSlug)
    this.report = reports.find(report => report.slug === reportSlug)
    if (!this.report) {
      throw new Error('Report not found')
    }

    const queries = require.main.require(`./reports/${reportSlug}/queries`)
    this.query = queries[querySlug]
    if (!this.query) {
      throw new Error('Query report not found')
    }

    this.user.modelAccess(this.query.model)
    this.model = models.get(this.query.model)

    if (!this.model) {
      throw new Error('Model not found')
    }
  }

  getUserFilters () {
    return this.user.getModelFilters(this.report.slug, this.model.collection)
  }

  getRequestFilters () {
    const filters = {}

    for (const key of Object.keys(this.filters)) {
      if (key === 'date') {
        continue
      }

      if ((typeof this.filters[key] === 'string' && this.filters[key]) || typeof this.filters[key] === 'number') {
        filters[key] = this.filters[key]
      }

      if (typeof this.filters[key] === 'object') {
        filters[key] = pick(this.filters[key], ['$regex', '$gte', '$lte', '$in'])
        if (!Object.keys(filters[key]).length) {
          delete filters[key]
        }
      }
    }

    if (!Object.keys(filters).length) {
      return null
    }

    return filters
  }
}

module.exports = QuerySearch
