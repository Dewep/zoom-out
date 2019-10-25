import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import createStore from './state/store'

import App from './components/app'


let store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>
  , document.getElementById('app')
)
