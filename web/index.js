import Inferno from 'inferno'
import { createStore } from 'redux'
import reducer from './reducers'
import { App } from './components'

const store = createStore(reducer)

store.subscribe(() =>
  console.log('store-updated', store.getState())
)

if (window) {
  window.store = store
}

Inferno.render(<App store={ store } />, document.getElementById('app'))
