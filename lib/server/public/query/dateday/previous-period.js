// const { DateTime } = require('luxon')
const QueryDatedayBase = require('./base')
const mongo = require('../../../mongo')

class QueryDatedayPreviousPeriod extends QueryDatedayBase {
  async query (querySearch) {
    const { previousPeriodFrom, from, to } = this._getDateFilter(querySearch.filters)

    const matches = this._generateMatches(querySearch, {
      dateday: {
        $gte: this._dateToDateday(previousPeriodFrom),
        $lte: this._dateToDateday(to)
      }
    })

    const pipeline = [
      ...matches,
      // { $match: {  } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      {
        $project: {
          ...querySearch.query.options.project,
          period: {
            $cond: [
              { $gte: ['$dateday', this._dateToDateday(from)] },
              'current',
              'previous'
            ]
          }
        }
      },
      { $group: { _id: '$period', ...querySearch.query.options.group } }
    ]

    const results = await mongo.aggregate(querySearch.model.collection, pipeline)

    return {
      previousPeriodFrom: previousPeriodFrom.toISO(),
      from: from.toISO(),
      to: to.toISO(),
      current: results.find(item => item._id === 'current') || null,
      previous: results.find(item => item._id === 'previous') || null
    }
  }
}

module.exports = new QueryDatedayPreviousPeriod()
