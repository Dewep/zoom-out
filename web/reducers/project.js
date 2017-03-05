import { RECEIVE_PROJECT } from '../actions'

const project = (state = {
    apiKey: 'drpanda-key',
    name: null,
    models: {},
    currentModel: null,
    currentView: 'list'
  }, action) => {
  if (action.type === RECEIVE_PROJECT) {
    state.name = action.name
    state.models = action.models

    let currentModelFound = _.some(action.models, (modelConfig, modelName) => {
      if (state.currentModel === modelName) {
        return true
      }

      return false
    })

    state.currentModel = null

    if (!currentModelFound) {
      _.some(action.models, (modelConfig, modelName) => {
        state.currentModel = modelName
        return true
      })
    }
  }

  return state
}

export default project
