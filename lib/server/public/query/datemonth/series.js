// const { DateTime } = require('luxon')
const QueryDatedayBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedaySeries extends QueryDatedayBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)

    const matches = this._generateMatches(querySearch, {
      datemonth: {
        $gte: this._dateToDatemonth(from),
        $lte: this._dateToDatemonth(to)
      }
    })

    const pipeline = [
      ...matches,
      { $group: { _id: '$datemonth', ...querySearch.query.options.group } }
    ]

    console.log(pipeline)
    const results = await mongo.aggregate(querySearch.model.collection, pipeline)
    console.log(results)

    let series = []
    let atLeastOneSerieFound = false
    let date = from
    while (date <= to) {
      const dateday = this._dateToDatemonth(date)

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
