import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE,
  UPDATE_VIEW,
  UPDATE_MODEL,
  TOGGLE_SIDEBAR
} from '../reducers/project'

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

const updateModel = (model) => ({
  type: UPDATE_MODEL,
  model
})

const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
})


const fetchAndLoad = () => (dispatch) => {
  dispatch(projectRequest())
  return projectApi.fetch()
    .then((response) => dispatch(projectSuccess(response.data.project, response.data.models)))
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
