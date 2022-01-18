// const { DateTime } = require('luxon')
const QueryDateminuteBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedayPaginated extends QueryDateminuteBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)
    delete querySearch.filters.date

    const filters = {
      ...querySearch.filters,
      ...querySearch.getUserFilters(),
      dateminute: {
        $gte: this._dateToDateminute(from),
        $lte: this._dateToDateminute(to)
      }
    }

    const page = querySearch.page || 1

    const sort = { dateminute: -1, date: -1 }
    const results = await mongo.pagination(querySearch.model.collection, filters, { page, sort })

    return {
      from: from.toISO(),
      to: to.toISO(),
      ...results
    }
  }
}

module.exports = new QueryDatedayPaginated()
