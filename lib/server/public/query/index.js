class QueryLoader {
  constructor () {
    this._queryTypes = {}
    this._queryTypesKeys = []

    this._loadQueryTypes()
  }

  _loadQueryTypes () {
    this._queryTypes = {
      datedaySeries: require('./dateday/series'),
      datedayPreviousPeriod: require('./dateday/previous-period'),
      datedayTopHits: require('./dateday/top-hits'),
      dateminuteSeries: require('./dateminute/series'),
      dateminutePaginated: require('./dateminute/paginated'),
      datemillisecondPaginated: require('./datemillisecond/paginated')
    }

    try {
      const projectDefinitions = require.main.require('./server/query')
      this._queryTypes = { ...this._queryTypes, ...projectDefinitions }
    } catch (err) {
      console.warn('[query-loader-project]', err.message)
    }

    this._queryTypesKeys = Object.keys(this._queryTypes)
  }

  async query (querySearch) {
    for (const queryTypesKey of this._queryTypesKeys) {
      if (querySearch.query.type === queryTypesKey) {
        return this._queryTypes[queryTypesKey].query(querySearch)
      }
    }

    throw new Error('Query report not found')
  }
}

module.exports = new QueryLoader()
