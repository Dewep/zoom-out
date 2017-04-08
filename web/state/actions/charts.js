import {
  CHARTS_REQUEST,
  CHARTS_SUCCESS,
  CHARTS_FAILURE
} from '../reducers/charts'

import aggregationsApi from '../../api/aggregations'


const chartsRequest = (chartId) => ({
  type: CHARTS_REQUEST,
  chartId
})

const chartsSuccess = (chartId, data) => ({
  type: CHARTS_SUCCESS,
  chartId,
  data
})

const chartsFailure = (chartId, error) => ({
  type: CHARTS_FAILURE,
  chartId,
  error
})


const query = (chartId, model, filters, aggregations, filterExclude) => (dispatch) => {
  dispatch(chartsRequest(chartId))
  return aggregationsApi.query(model, filters, aggregations, filterExclude)
    .then((response) => dispatch(chartsSuccess(chartId, response.data)))
    .catch((error) => dispatch(chartsFailure(chartId, error)))
}


export {
  query
}

export default {
  query
}
