import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import projectReducers from './reducers/project'
import filtersReducers from './reducers/filters'
import facetsReducers from './reducers/facets'
import listReducers from './reducers/list'
import chartsReducers from './reducers/charts'

import { updateModel, updateView } from './actions/project'
import { updateFilters } from './actions/filters'

import { getInitialFilters, getInitialModel, getInitialView, watchStoreForLocation } from './location'

export default () => {
  const reducers = combineReducers({
    filters: filtersReducers,
    facets: facetsReducers,
    project: projectReducers,
    list: listReducers,
    charts: chartsReducers
  })

  const store = createStore(reducers, {
    filters: getInitialFilters()
  }, applyMiddleware(
    thunkMiddleware,
    logger
  ))

  store.dispatch(updateModel(getInitialModel()))
  store.dispatch(updateView(getInitialView()))
  store.dispatch(updateFilters(getInitialFilters()))

  watchStoreForLocation(store)

  if (window) {
    window.store = store
  }

  return store
}
