const axios = require('axios')

export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'
export const RECEIVE_FACETS = 'RECEIVE_FACETS'

export function toggleFilter(field, value) {
  return {
    type: TOGGLE_FILTER,
    field: field,
    value: value
  }
}

export function receiveProject(name, models) {
  return {
    type: RECEIVE_PROJECT,
    name: name,
    models: models
  }
}

export function receiveFacets(total, buckets) {
  return {
    type: RECEIVE_FACETS,
    total: total,
    buckets: buckets
  }
}

export function updateProject(store) {
  axios.get('/api/models/', {
    headers: {
      Authorization: store.getState().project.apiKey
    }
  }).then(response => {
    store.dispatch(receiveProject(response.data.project, response.data.models))
  }).catch(console.error)
}

export function updateFacets(store) {
  let state = store.getState()
  axios.post('/api/models/' + state.project.currentModel + '/query/facets/', {
    filters: state.filters
  }, {
    headers: {
      Authorization: state.project.apiKey
    }
  }).then(response => {
    store.dispatch(receiveFacets(response.data.total, response.data.buckets))
  }).catch(console.error)
}
