import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { createStore } from 'redux'
import reducer from './reducers'
import { updateModel, updateView, updateFilters } from './actions'
import { getInitialFilters, getInitialModel, getInitialView, watchStoreForLocation } from './location'
import { App } from './components'

const store = createStore(reducer, {
  filters: getInitialFilters()
})

store.dispatch(updateModel(getInitialModel()))
store.dispatch(updateView(getInitialView()))
store.dispatch(updateFilters(getInitialFilters()))

watchStoreForLocation(store)

/* store.subscribe(() =>
  console.log('store-updated', store.getState())
) */

if (window) {
  window.store = store
}


injectTapEventPlugin()

ReactDOM.render(<App store={ store } />, document.getElementById('app'))
