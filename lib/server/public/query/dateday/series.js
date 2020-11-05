// const { DateTime } = require('luxon')
const QueryDatedayBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedaySeries extends QueryDatedayBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)

    const matches = this._generateMatches(querySearch, {
      dateday: {
        $gte: this._dateToDateday(from),
        $lte: this._dateToDateday(to)
      }
    })

    const pipeline = [
      ...matches,
      { $group: { _id: '$dateday', ...querySearch.query.options.group } }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    let series = []
    let atLeastOneSerieFound = false
    let date = from
    while (date <= to) {
      const dateday = this._dateToDateday(date)

      let serie = results.find(result => result._id === dateday)

      if (serie && !atLeastOneSerieFound) {
        atLeastOneSerieFound = true
      }

      if (!serie && querySearch.query.options.fillEmptyWith) {
        serie = { ...querySearch.query.options.fillEmptyWith }
      }

      if (serie) {
        serie.date = dateday
        delete serie._id
        series.push(serie)
      }

      date = date.plus({ day: 1 })
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

module.exports = new QueryDatedaySeries()
