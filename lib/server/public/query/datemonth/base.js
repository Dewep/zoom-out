const QueryBase = require('../base')

class QueryDatedayBase extends QueryBase {
  _dateToDatemonth (date) {
    return date.year * 100 + date.month
  }

  _datemonthToISO (datemonth) {
    const year = Math.floor(datemonth / 100)
    const month = datemonth % 100
    return `${year}-${month < 10 ? '0' : ''}${month}`
  }
}

module.exports = QueryDatedayBase
