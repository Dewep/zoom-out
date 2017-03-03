import Inferno from 'inferno'
import { createStore } from 'redux'
import reducer from './reducers'
import App from './app'

const store = createStore(reducer, {
  apiKey: 'drpanda-key',
  filters: {},
  project: {
    name: null,
    models: {}
  },
  facets: {
    loaded: true,
    total: 0,
    buckets: []
  }
})

store.subscribe(() =>
  console.log('store-update', JSON.stringify(store.getState()))
)

Inferno.render(<App store={ store } />, document.getElementById('app'))
