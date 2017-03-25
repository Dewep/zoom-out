import axios from 'axios'
import { hostname, apiKey } from './config'

const fetch = (model, filters) => (
  axios.post(hostname + '/api/models/' + model + '/query/facets/', {
    filters: filters
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
