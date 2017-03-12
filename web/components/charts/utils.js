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

export function queryAggregations(storeState, filters, aggregations, filterExclude) {
  return axios.post(storeState.project.hostname + '/api/models/' + storeState.project.currentModel + '/query/aggregations/', {
    filters: filters,
    filterExclude: filterExclude,
    aggregations: aggregations
  }, {
    headers: {
      Authorization: storeState.project.apiKey
    }
  })
}
