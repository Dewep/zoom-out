import { UPDATE_FILTERS, SET_FILTER, TOGGLE_FILTER } from './filters'
import { UPDATE_MODEL } from './project'

export const LIST_REQUEST = 'LIST_REQUEST'
export const LIST_SUCCESS = 'LIST_SUCCESS'
export const LIST_FAILURE = 'LIST_FAILURE'


const defaultState = {
  loading: null,
  error: null,
  page: 0,
  hasMore: false,
  total: 0,
  data: []
}


const listReducer = (state, action) => {
  let data = (action.page === 1 ? action.data : [...state.data, ...action.data])

  return {
    ...state,
    loading: false,
    page: action.page,
    total: action.total,
    hasMore: (data.length < action.total),
    data: data
  }
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_FILTERS:
    case SET_FILTER:
    case TOGGLE_FILTER:
    case UPDATE_MODEL:
      return { ...defaultState }
    case LIST_REQUEST:
      return { ...state, loading: true, error: null, hasMore: false }
    case LIST_SUCCESS:
      return listReducer(state, action)
    case LIST_FAILURE:
      console.warn('LIST_FAILURE', action.error)
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}
