import { UPDATE_FILTERS, SET_FILTER, TOGGLE_FILTER } from './filters'
import { UPDATE_MODEL } from './project'

export const CHARTS_REQUEST = 'CHARTS_REQUEST'
export const CHARTS_SUCCESS = 'CHARTS_SUCCESS'
export const CHARTS_FAILURE = 'CHARTS_FAILURE'


const defaultState = {}


export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_FILTERS:
    case SET_FILTER:
    case TOGGLE_FILTER:
    case UPDATE_MODEL:
      return {}
    case CHARTS_REQUEST:
      return { ...state, [action.chartId]: { loading: true, error: null, data: null } }
    case CHARTS_SUCCESS:
      return { ...state, [action.chartId]: { loading: false, error: null, data: action.data } }
    case CHARTS_FAILURE:
      console.warn('CHARTS_FAILURE', action.error)
      return { ...state, [action.chartId]: { loading: false, error: action.error, data: null } }
    default:
      return state
  }
}
