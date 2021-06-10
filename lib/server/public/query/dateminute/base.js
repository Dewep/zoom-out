const QueryBase = require('../base')
// const { DateTime } = require('luxon')

class QueryDateminuteBase extends QueryBase {
  _dateToDateminute (date) {
    return date.year * 100000000 + date.month * 1000000 + date.day * 10000 + date.hour * 100 + date.minute
  }
}

module.exports = QueryDateminuteBase
