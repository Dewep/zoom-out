const reports = require.main.require('./reports')
const models = require('../../models')

class QuerySearch {
  constructor ({ body, user }, reportSlug, querySlug) {
    this.body = body || {}
    this.filters = this.body.filters || {}
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
}

module.exports = QuerySearch
