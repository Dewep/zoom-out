import { RECEIVE_PROJECT } from '../actions'

const project = (state = {
    name: null,
    models: {}
  }, action) => {
  if (action.type === RECEIVE_PROJECT) {
    state.name = action.name
    state.models = action.models
  }

  return state
}

export default project
