// const { DateTime } = require('luxon')
const QueryDatedayBase = require('./base')
const mongo = require('../../../mongo')

class QueryDateminuteSeries extends QueryDatedayBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)

    const matches = this._generateMatches(querySearch, {
      dateminute: {
        $gte: this._dateToDateminute(from),
        $lte: this._dateToDateminute(to)
      }
    })

    const pipeline = [
      ...matches,
      { $group: { _id: '$dateminute', ...querySearch.query.options.group } }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    let series = []
    let atLeastOneSerieFound = false
    let date = from
    while (date <= to) {
      const dateminute = this._dateToDateminute(date)

      let serie = results.find(result => result._id === dateminute)

      if (serie && !atLeastOneSerieFound) {
        atLeastOneSerieFound = true
      }

      if (!serie && querySearch.query.options.fillEmptyWith) {
        serie = { ...querySearch.query.options.fillEmptyWith }
      }

      if (serie) {
        serie.dateminute = dateminute
        delete serie._id
        series.push(serie)
      }

      date = date.plus({ minute: 1 })
    }

    if (!atLeastOneSerieFound) {
      series = []
    }

    return {
      from: from.toISO(),
      to: to.toISO(),
      series
    }
  }
}

module.exports = new QueryDateminuteSeries()
