// const { DateTime } = require('luxon')
const QueryDatedayBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedayTopHits extends QueryDatedayBase {
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
      { $group: { ...querySearch.query.options.group } },
      { $sort: { ...querySearch.query.options.sort } },
      { $limit: querySearch.query.options.limit }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    return {
      from: from.toISO(),
      to: to.toISO(),
      hits: results
    }
  }
}

module.exports = new QueryDatedayTopHits()
