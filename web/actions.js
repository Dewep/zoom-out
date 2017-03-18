const axios = require('axios')

export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const SET_FILTER = 'SET_FILTER'
export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_MODEL = 'UPDATE_MODEL'
export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'
export const RECEIVE_FACETS = 'RECEIVE_FACETS'

export function toggleFilter(field, value) {
  return {
    type: TOGGLE_FILTER,
    field: field,
    value: value
  }
}

export function setFilter(field, value) {
  return {
    type: SET_FILTER,
    field: field,
    value: value
  }
}

export function updateView(view) {
  return {
    type: UPDATE_VIEW,
    view: view
  }
}


export function updateModel(model) {
  return {
    type: UPDATE_MODEL,
    model: model
  }
}

export function updateFilters(filters) {
  return {
    type: UPDATE_FILTERS,
    filters: filters
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
  let state = store.getState()
  axios.get(state.project.hostname + '/api/models/', {
    headers: {
      Authorization: state.project.apiKey
    }
  }).then(response => {
    store.dispatch(receiveProject(response.data.project, response.data.models))
  }).catch(console.error)
}

export function updateFacets(store) {
  let state = store.getState()
  axios.post(state.project.hostname + '/api/models/' + state.project.currentModel + '/query/facets/', {
    filters: state.filters
  }, {
    headers: {
      Authorization: state.project.apiKey
    }
  }).then(response => {
    store.dispatch(receiveFacets(response.data.total, response.data.buckets))
  }).catch(console.error)
}
