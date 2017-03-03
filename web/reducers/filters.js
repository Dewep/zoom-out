import { TOGGLE_FILTER } from '../actions'

const filters = (state = {}, action) => {
  if (action.type === TOGGLE_FILTER) {
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
