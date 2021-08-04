// const { DateTime } = require('luxon')
const QueryDateminuteBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedayPaginated extends QueryDateminuteBase {
  async query ({ body, filters, model }) {
    const { from, to } = this._getDateFilter(filters)
    delete filters.date

    filters = {
      dateminute: {
        $gte: this._dateToDateminute(from),
        $lte: this._dateToDateminute(to)
      },
      ...filters
    }

    const sort = { dateminute: -1 }
    const results = await mongo.pagination(model.collection, filters, { page: body.page, sort })

    return {
      from: from.toISO(),
      to: to.toISO(),
      ...results
    }
  }
}

module.exports = new QueryDatedayPaginated()
