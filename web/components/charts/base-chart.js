import React from 'react'
import moment from 'moment'
import { model } from '../../../common'

class BaseChart extends React.Component {
  _jsonProps (props) {
    return JSON.stringify({
      filters: props.filters || {},
      state: props.state || {}
    })
  }

  isJsonPropsDiffer (props) {
    if (!this._jsonPropsValue) {
      return true
    }

    return this._jsonProps(props) !== this._jsonPropsValue
  }

  setJsonProps (props) {
    this._jsonPropsValue = this._jsonProps(props)
  }

  // .field, .period, .tick
  buildDateRanges (config, props = null) {
    let unit = 'day'
    _.some(config.tick, (value, key) => {
      unit = key
      return true
    })

    const filter = (props || this.props).filters[config.field] || [null, null]
    let iterPeriod = filter[0] ? moment(filter[0]) : moment().startOf(unit).subtract(config.period)
    let end = filter[1] ? moment(filter[1]) : moment()
    let ranges = []

    while (end.diff(iterPeriod) > 0) {
      let range = {}
      range.from = iterPeriod.toISOString()
      iterPeriod.add(config.tick)
      range.to = iterPeriod.toISOString()
      ranges.push(range)
    }

    return ranges
  }
}

export default BaseChart
