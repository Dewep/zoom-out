function formatNumber (value, decimal) {
  const regex = '(\\d)(?=(\\d{3})+' + (decimal > 0 ? '\\.' : '$') + ')'
  return value.toFixed(decimal || 0).replace(new RegExp(regex, 'g'), '$1 ')
}

module.exports = {
  formatNumber,

  formatSize (value, decimal) {
    console.log(value, decimal)
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
    return formatNumber(value / modifier, decimal === 0 ? 0 : decimal || 2) + ' ' + unit
  }
}
