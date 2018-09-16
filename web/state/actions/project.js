import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE,
  UPDATE_VIEW,
  UPDATE_MODEL,
  TOGGLE_SIDEBAR
} from '../reducers/project'
import { model } from '../../../common'
import projectApi from '../../api/project'


const projectRequest = () => ({
  type: PROJECT_REQUEST
})

const projectSuccess = (name, models) => ({
  type: PROJECT_SUCCESS,
  name,
  models
})

const projectFailure = (error) => ({
  type: PROJECT_FAILURE,
  error
})

const updateView = (view) => ({
  type: UPDATE_VIEW,
  view
})

const updateModel = (newModel) => (dispatch, getState) => {
  let dateFilterField = null
  const state = getState()
  if (state && state.project && state.project.models && state.project.models[newModel]) {
    const definition = state.project.models[newModel].definition || {}
    const facets = state.project.models[newModel].facets || []
    dateFilterField = facets.find(fieldName => {
      const field = model.getField(definition, fieldName)
      if (field && field.type === 'date') {
        return fieldName
      }
      return null
    })
  }
  return dispatch({
    type: UPDATE_MODEL,
    model: newModel,
    dateFilterField
  })
}

const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
})


const fetchAndLoad = () => (dispatch, getState) => {
  dispatch(projectRequest())
  return projectApi.fetch()
    .then((response) => {
      let currentModel = null
      try {
        currentModel = getState().project.currentModel || null
      } catch (e) {}
      let newModel = currentModel

      if (!currentModel || !response.data.models[currentModel]) {
        newModel = null

        _.some(response.data.models, (modelConfig, modelName) => {
          newModel = modelName
          return true
        })
      }

      const actions = []
      actions.push(dispatch(projectSuccess(response.data.project, response.data.models)))
      if (newModel !== currentModel) {
        actions.push(dispatch(updateModel(newModel)))
      }

      return Promise.all(actions)
    })
    .catch((error) => dispatch(projectFailure(error)))
}


export {
  fetchAndLoad,
  updateView,
  updateModel,
  toggleSidebar
}

export default {
  fetchAndLoad,
  updateView,
  updateModel,
  toggleSidebar
}
