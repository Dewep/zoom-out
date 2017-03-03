import { combineReducers } from 'redux'
import filters from './filters'
import project from './project'

const reducers = combineReducers({
  filters,
  project
})

export default reducers
