const QueryBase = require('../base')
// const { DateTime } = require('luxon')

class QueryDatedayBase extends QueryBase {
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

module.exports = QueryDatedayBase
