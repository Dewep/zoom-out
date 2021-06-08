// const models = require.main.require('./models')
const reports = require.main.require('./reports')

class User {
  constructor (auth) {
    this._auth = auth || {}

    this._reports = this._auth.reports || reports.map(r => r.slug)
    // this._models = this._auth.models || null

    // if (!this._models) {
    //   for (const model of models) {
    //     this._models[model.collection] = {}
    //   }
    // }

    // this._models = Object.keys(this._models)
  }

  reportAccess (reportSlug) {
    // if (!this._reports.includes(reportSlug)) {
    if (!Object.keys(this._reports).includes(reportSlug)) {
      throw new Error('Report access forbidden')
    }
  }

  modelAccess (modelSlug) {
    // if (!this._models.includes(modelSlug)) {
    //   throw new Error('Model access forbidden')
    // }
  }

  getModelFilters (reportSlug, modelSlug) {
    return (this._reports[reportSlug] && this._reports[reportSlug][modelSlug]) || null
  }
}

module.exports = User
