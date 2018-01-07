import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

export function buildDateRanges(period, tick) {
  let unit = 'day'
  _.some(tick, (value, key) => {
    unit = key
    return true
  })

  let iterPeriod = moment().startOf(unit).subtract(period)
  let end = moment()
  let ranges = []

  while (end.diff(iterPeriod) > 0) {
    let range = {}
    range.from = iterPeriod.toISOString()
    iterPeriod.add(tick)
    range.to = iterPeriod.toISOString()
    ranges.push(range)
  }

  return ranges
}

export function getCategories(type) {
  if (type === 'hours') {
    return _.map(_.range(24), item => item.toString())
  }
  if (type === 'weekdays') {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
  if (type === 'months') {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
  return type
}

const _formatNumber = function (value, decimal) {
  const regex = '(\\d)(?=(\\d{3})+' + (decimal > 0 ? '\\.' : '$') + ')'
  return value.toFixed(decimal || 0).replace(new RegExp(regex, 'g'), '$1 ')
}

export function formatNumber(value, decimal) {
  return _formatNumber(value, decimal)
}

export function formatSize(value, decimal) {
  let unit = 'Go'
  let modifier = 1000000000
  if (value < 1000) {
    unit = 'o'
    modifier = 1
  } else if (value < 1000000) {
    unit = 'ko'
    modifier = 1000
  } else if (value < 1000000000) {
    unit = 'Mo'
    modifier = 1000000
  }
  return _formatNumber(value / modifier, decimal === 0 ? 0 : decimal || 2) + ' ' + unit
}
