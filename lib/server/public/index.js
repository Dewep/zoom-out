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

  _datedayToDate (dateday) {
    const year = Math.floor(dateday / 10000)
    const month = Math.floor(dateday / 100) % 100
    const day = dateday % 100
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
  }

  async _datedaySeries ({ collection, datedaySeries }, { body, user }) {
    const pipeline = [
      { $match: { dateday: { $gte: 20200901 } } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      { $group: { _id: '$dateday', ...datedaySeries } }
    ]

    const results = await mongo.aggregate(collection, pipeline)

    results.sort((a, b) => a._id - b._id)
    const series = results.map(item => {
      const serie = { ...item }
      serie.date = this._datedayToDate(item._id)
      delete serie._id
      return serie
    })

    return { series }
  }

  async _previousPeriod ({ collection, previousPeriod }, { body, user }) {
    const pipeline = [
      { $match: { dateday: { $gte: 20200701, $lte: 20200901 } } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      { $project: { ...previousPeriod.project, period: { $cond: [{ $gte: ['$dateday', 20200801] }, 'current', 'previous'] } } },
      { $group: { _id: '$period', ...previousPeriod.group } }
    ]

    const results = await mongo.aggregate(collection, pipeline)

    return {
      current: results.find(item => item._id === 'current'),
      previous: results.find(item => item._id === 'previous')
    }
  }
}

module.exports = new PublicCtrl()
