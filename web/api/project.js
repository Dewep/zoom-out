import axios from 'axios'
import { hostname, apiKey } from './config'

const fetch = () => (
  axios.get(hostname + '/api/models/', {
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
