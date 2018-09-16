import moment from 'moment'

import { UPDATE_MODEL, PROJECT_SUCCESS } from './project'

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

const updateModel = (state, action) => {
  if (action.filters) {
    return action.filters
  }
  if (action.dateFilterField) {
    return {
      [action.dateFilterField]: [moment().startOf('day').subtract({ months: 1, days: 15 }).format(), null]
    }
  }
  return {}
}


export default (state = defaultState, action, rootState) => {
  switch (action.type) {
    case UPDATE_FILTERS:
    case UPDATE_MODEL:
      return updateModel(state, action)
    case SET_FILTER:
      return setFilter(state, action)
    case TOGGLE_FILTER:
      return toggleFilter(state, action)
    default:
      return state
  }
}
