import {
  LIST_REQUEST,
  LIST_SUCCESS,
  LIST_FAILURE
} from '../reducers/list'

import listApi from '../../api/list'


const listRequest = () => ({
  type: LIST_REQUEST
})

const listSuccess = (page, data, total) => ({
  type: LIST_SUCCESS,
  page,
  data,
  total
})

const listFailure = (error) => ({
  type: LIST_FAILURE,
  error
})


const fetchAndLoad = (model, filters, sort) => (dispatch) => {
  dispatch(listRequest())
  return listApi.fetch(model, filters, sort, 1)
    .then((response) => dispatch(listSuccess(1, response.data.data, response.data.total)))
    .catch((error) => dispatch(listFailure(error)))
}

const fetchAndLoadMore = (model, filters, sort, page) => (dispatch) => {
  dispatch(listRequest())
  return listApi.fetch(model, filters, sort, page)
    .then((response) => dispatch(listSuccess(page, response.data.data, response.data.total)))
    .catch((error) => dispatch(listFailure(error)))
}


export {
  fetchAndLoad,
  fetchAndLoadMore
}

export default {
  fetchAndLoad,
  fetchAndLoadMore
}
