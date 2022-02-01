const QueryBase = require('../base')
// const { DateTime } = require('luxon')

class QueryDatemillisecondBase extends QueryBase {
  _dateToDatemillisecond (date) {
    return date.year * 10000000000000 + date.month * 100000000000 + date.day * 1000000000 + date.hour * 10000000 + date.minute * 100000 + date.second * 1000 + date.millisecond
  }
}

module.exports = QueryDatemillisecondBase
