// const config = require.main.require('./config')
const reports = require.main.require('./reports')
const mongo = require('../mongo')

class PublicCtrl {
  async general (req) {
  }

  async query (req) {
    const report = reports.find(report => report.slug === req.params.report)
    if (!report) {
      throw new Error('Report not found')
    }

    const queries = require.main.require(`./reports/${report.slug}/queries`)
    const query = queries[req.params.query]
    if (!query) {
      throw new Error('Query report not found')
    }

    if (query.datedaySeries) {
      return this._datedaySeries(query, req)
    }

    if (query.previousPeriod) {
      return this._previousPeriod(query, req)
    }

    throw new Error('Query report not valid')
  }

  async _datedaySeries ({ collection, datedaySeries }, { body, user }) {
    const pipeline = [
      { $match: { dateday: { $gte: 20200901 } } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      { $group: { _id: '$dateday', ...datedaySeries } }
    ]

    const results = await mongo.aggregate(collection, pipeline)

    return { results }
  }

  async _previousPeriod ({ collection, previousPeriod }, { body, user }) {
    return {}
  }
}

module.exports = new PublicCtrl()
