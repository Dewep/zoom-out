import axios from 'axios'
import _ from 'lodash'

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
