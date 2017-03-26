import axios from 'axios'
import { hostname, apiKey } from './config'

const fetch = (model, filters, sort, page) => (
  axios.post(hostname + '/api/models/' + model + '/query/list/', {
    filters: filters,
    sort: sort,
    page: page
  }, {
    headers: {
      Authorization: apiKey
    }
  })
)

export {
  fetch
}

export default {
  fetch
}
