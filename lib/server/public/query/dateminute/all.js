// const { DateTime } = require('luxon')
const QueryDateminuteBase = require('./base')
const mongo = require('../../../mongo')

class QueryDateminuteSeries extends QueryDateminuteBase {
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
      // { $group: { ...querySearch.query.options.group } },
      { $limit: querySearch.query.options.limit }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    return {
      from: from.toISO(),
      to: to.toISO(),
      results
    }
  }
}

module.exports = new QueryDateminuteSeries()
