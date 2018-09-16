export const PROJECT_REQUEST = 'PROJECT_REQUEST'
export const PROJECT_SUCCESS = 'PROJECT_SUCCESS'
export const PROJECT_FAILURE = 'PROJECT_FAILURE'
export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_MODEL = 'UPDATE_MODEL'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'


const defaultState = {
  loading: null,
  error: null,
  name: null,
  models: {},
  currentModel: null,
  currentView: 'list',
  sidebar: false
}


const projectReducer = (state, action) => {
  return {
    ...state,
    loading: false,
    name: action.name,
    models: action.models
  }
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, sidebar: !state.sidebar }
    case PROJECT_REQUEST:
      return { ...state, loading: true, error: null }
    case PROJECT_SUCCESS:
      return projectReducer(state, action)
    case PROJECT_FAILURE:
      console.warn('PROJECT_FAILURE', action.error)
      return { ...state, loading: false, error: action.error }
    case UPDATE_VIEW:
      return { ...state, currentView: action.view }
    case UPDATE_MODEL:
      return { ...state, currentModel: action.model }
    default:
      return state
  }
}
