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
