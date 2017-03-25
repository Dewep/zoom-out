import {
  FACETS_REQUEST,
  FACETS_SUCCESS,
  FACETS_FAILURE
} from '../reducers/facets'

import facetsApi from '../../api/facets'


const facetsRequest = () => ({
  type: FACETS_REQUEST
})

const facetsSuccess = (total, buckets) => ({
  type: FACETS_SUCCESS,
  total,
  buckets
})

const facetsFailure = (error) => ({
  type: FACETS_FAILURE,
  error
})


const fetchAndLoad = (model, filters) => (dispatch) => {
  dispatch(facetsRequest())
  return facetsApi.fetch(model, filters)
    .then((response) => dispatch(facetsSuccess(response.data.total, response.data.buckets)))
    .catch((error) => dispatch(facetsFailure(error)))
}


export {
  fetchAndLoad
}

export default {
  fetchAndLoad
}
