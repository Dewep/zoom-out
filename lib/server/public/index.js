const reports = require.main.require('./reports')
const { DateTime } = require('luxon')
const queryDateday = require('./query/dateday')

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
      return queryDateday.querySeries(query, req)
    }

    if (query.datedayPreviousPeriod) {
      return queryDateday.queryPreviousPeriod(query, req)
    }

    throw new Error('Query report not valid')
  }

  getDateFilter ({ date } = {}) {
    const dateType = (date && Array.isArray(date) && date.length && typeof date[0] === 'string' && date[0]) || 'last-30-days'
    const now = DateTime.local()

    if (dateType === 'custom' && date.length > 2 && typeof date[1] === 'string' && typeof date[2] === 'string') {
      const from = DateTime.local(date[1])
      const to = DateTime.local(date[2])
      if (from.isValid && to.isValid) {
        const previousPeriodFrom = from.minus(to.diff(from))
        return { previousPeriodFrom, from, to }
      }
    }

    if (dateType === 'current-month') {
      const from = now.startOf('month')
      const previousPeriodFrom = now.minus({ month: 1 }).startOf('month')
      return { previousPeriodFrom, from, to: now }
    }

    if (dateType === 'last-month') {
      const from = now.minus({ month: 1 }).startOf('month')
      const to = now.minus({ month: 1 }).endOf('month')
      const previousPeriodFrom = now.minus({ month: 2 }).startOf('month')
      return { previousPeriodFrom, from, to }
    }

    if (date[0] === 'last-90-days') {
      const from = now.minus({ days: 90 })
      const previousPeriodFrom = now.minus({ days: 180 })
      return { previousPeriodFrom, from, to: now }
    }

    // last-30-days or default
    const from = now.minus({ days: 30 })
    const previousPeriodFrom = now.minus({ days: 60 })
    return { previousPeriodFrom, from, to: now }
  }
}

module.exports = new PublicCtrl()
