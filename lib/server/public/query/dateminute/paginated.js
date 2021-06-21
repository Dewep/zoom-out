// const { DateTime } = require('luxon')
const QueryDateminuteBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedayPaginated extends QueryDateminuteBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)
    delete querySearch.filters.date

    const filters = {
      dateminute: {
        $gte: this._dateToDateminute(from),
        $lte: this._dateToDateminute(to)
      },
      ...querySearch.filters
    }

    const results = await mongo.pagination(querySearch.model.collection, filters)

    return {
      from: from.toISO(),
      to: to.toISO(),
      ...results
    }
  }
}

module.exports = new QueryDatedayPaginated()
