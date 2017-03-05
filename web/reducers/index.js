import { combineReducers } from 'redux'
import filters from './filters'
import project from './project'
import facets from './facets'

const reducers = combineReducers({
  filters,
  project,
  facets
})

export default reducers
