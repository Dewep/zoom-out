const elasticsearch = require('elasticsearch')
const config = require('../config')

let client = new elasticsearch.Client(config.elasticsearch)

module.exports = client
