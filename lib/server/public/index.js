const queryLoader = require('./query')
const QuerySearch = require('./query/search')

class PublicCtrl {
  async general (req) {
  }

  async query (req) {
    const querySearch = new QuerySearch(req, req.params.report, req.params.query)

    return queryLoader.query(querySearch)
  }
}

module.exports = new PublicCtrl()
