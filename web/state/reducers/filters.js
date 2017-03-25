import { UPDATE_MODEL } from './project'

export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const SET_FILTER = 'SET_FILTER'
export const TOGGLE_FILTER = 'TOGGLE_FILTER'


const defaultState = {}


const setFilter = (state, action) => {
  if (action.value === null || action.value === undefined) {
    if (state[action.field]) {
      let newState = {...state}
      delete newState[action.field]
      return newState
    }
  } else {
    return {
      ...state,
      [action.field]: action.value
    }
  }

  return state
}

const toggleFilter = (state, action) => {
  let index = state[action.field] ? state[action.field].indexOf(action.value) : -1

  if (index !== -1) {
    if (state[action.field].length === 1) {
      let newState = {...state}
      delete newState[action.field]
      return newState
    }

    return {
      ...state,
      [action.field]: [
        ...state[action.field].slice(0, index),
        ...state[action.field].slice(index + 1)
      ]
    }
  }

  if (!state[action.field]) {
    return { ...state, [action.field]: [action.value] }
  }

  return { ...state, [action.field]: [...state[action.field], action.value] }
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_FILTERS:
    case UPDATE_MODEL:
      return action.filters || {}
    case SET_FILTER:
      return setFilter(state, action)
    case TOGGLE_FILTER:
      return toggleFilter(state, action)
    default:
      return state
  }
}
