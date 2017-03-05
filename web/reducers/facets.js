import { RECEIVE_FACETS } from '../actions'

const facets = (state = {
    initialized: false,
    total: 0,
    buckets: {}
  }, action) => {
  if (action.type === RECEIVE_FACETS) {
    state.initialized = true
    state.total = action.total
    state.buckets = action.buckets
  }

  return state
}

export default facets
