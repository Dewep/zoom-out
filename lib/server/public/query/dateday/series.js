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
      { $group: { _id: '$dateday', ...querySearch.query.options } }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    results.sort((a, b) => a._id - b._id)
    // @TODO: Fix days with count 0 (no data on these days)
    const series = results.map(item => {
      const serie = { ...item }
      serie.date = this._datedayToISO(item._id)
      delete serie._id
      return serie
    })

    return {
      from: from.toISO(),
      to: to.toISO(),
      series
    }
  }
}

module.exports = new QueryDatedaySeries()
