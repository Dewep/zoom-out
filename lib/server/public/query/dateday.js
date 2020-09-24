// const { DateTime } = require('luxon')
const mongo = require('../../mongo')

class PublicQueryDatedayCtrl {
  get base () {
    if (!this._baseCache) {
      this._baseCache = require('..')
    }
    return this._baseCache
  }

  async querySeries ({ collection, datedaySeries }, { body, user }) {
    const { from, to } = this.base.getDateFilter(body.filters)

    const pipeline = [
      { $match: { dateday: { $gte: this._dateToDateday(from), $lte: this._dateToDateday(to) } } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      { $group: { _id: '$dateday', ...datedaySeries } }
    ]

    const results = await mongo.aggregate(collection, pipeline)

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

  async queryPreviousPeriod ({ collection, datedayPreviousPeriod }, { body, user }) {
    const { previousPeriodFrom, from, to } = this.base.getDateFilter(body.filters)

    const pipeline = [
      { $match: { dateday: { $gte: this._dateToDateday(previousPeriodFrom), $lte: this._dateToDateday(to) } } },
      // { $match: { team: { $in: ['root', 'icl'] } } },
      { $project: { ...datedayPreviousPeriod.project, period: { $cond: [{ $gte: ['$dateday', this._dateToDateday(from)] }, 'current', 'previous'] } } },
      { $group: { _id: '$period', ...datedayPreviousPeriod.group } }
    ]

    const results = await mongo.aggregate(collection, pipeline)

    return {
      previousPeriodFrom: previousPeriodFrom.toISO(),
      from: from.toISO(),
      to: to.toISO(),
      current: results.find(item => item._id === 'current'),
      previous: results.find(item => item._id === 'previous')
    }
  }

  _dateToDateday (date) {
    return date.year * 10000 + date.month * 100 + date.day
  }

  _datedayToISO (dateday) {
    const year = Math.floor(dateday / 10000)
    const month = Math.floor(dateday / 100) % 100
    const day = dateday % 100
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
  }
}

module.exports = new PublicQueryDatedayCtrl()
