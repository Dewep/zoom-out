import { UPDATE_FILTERS, SET_FILTER, TOGGLE_FILTER } from './filters'
import { UPDATE_MODEL } from './project'

export const FACETS_REQUEST = 'FACETS_REQUEST'
export const FACETS_SUCCESS = 'FACETS_SUCCESS'
export const FACETS_FAILURE = 'FACETS_FAILURE'


const defaultState = {
  loading: null,
  error: null,
  total: 0,
  buckets: {}
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_FILTERS:
    case SET_FILTER:
    case TOGGLE_FILTER:
    case UPDATE_MODEL:
      return { ...state, loading: null }
    case FACETS_REQUEST:
      return { ...state, loading: true, error: null }
    case FACETS_SUCCESS:
      return { ...state, loading: false, total: action.total, buckets: action.buckets }
    case FACETS_FAILURE:
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}
