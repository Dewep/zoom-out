import axios from 'axios'
import { hostname, apiKey } from './config'

const query = (model, filters, aggregations, filterExclude) => (
  axios.post(hostname + '/api/models/' + model + '/query/aggregations/', {
    filters: filters,
    filterExclude: filterExclude,
    aggregations: aggregations
  }, {
    headers: {
      Authorization: apiKey
    }
  })
)

export {
  query
}

export default {
  query
}
