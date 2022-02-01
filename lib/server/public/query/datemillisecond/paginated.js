// const { DateTime } = require('luxon')
const QueryDatemillisecondBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatemillisecondPaginated extends QueryDatemillisecondBase {
  async query (querySearch) {
    const { from, to } = this._getDateFilter(querySearch.filters)
    delete querySearch.filters.date

    const filters = {
      ...querySearch.filters,
      ...querySearch.getUserFilters(),
      datemillisecond: {
        $gte: this._dateToDatemillisecond(from),
        $lte: this._dateToDatemillisecond(to)
      }
    }

    const page = querySearch.page || 1

    const sort = { datemillisecond: -1 }
    const results = await mongo.pagination(querySearch.model.collection, filters, { page, sort })

    return {
      from: from.toISO(),
      to: to.toISO(),
      ...results
    }
  }
}

module.exports = new QueryDatemillisecondPaginated()
