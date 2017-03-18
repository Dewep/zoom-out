import { SET_FILTER, TOGGLE_FILTER, UPDATE_MODEL, UPDATE_FILTERS } from '../actions'

const filters = (state = {}, action) => {
  if (action.type === UPDATE_FILTERS || action.type === UPDATE_MODEL) {
    state = action.filters || {}
  } else if (action.type === SET_FILTER) {
    if (action.value === null) {
      if (state[action.field]) {
        delete state[action.field]
      }
    } else {
      state[action.field] = action.value
    }
  } else if (action.type === TOGGLE_FILTER) {
    if (state[action.field] && state[action.field].indexOf(action.value) !== -1) {
      if (state[action.field].length === 1) {
        delete state[action.field]
      } else {
        state[action.field].splice(state[action.field].indexOf(action.value), 1)
      }
    } else {
      if (!state[action.field]) {
        state[action.field] = []
      }
      state[action.field].push(action.value)
    }
  }

  return state
}

export default filters
