import {
  TOGGLE_FILTER,
  SET_FILTER,
  UPDATE_FILTERS
} from '../reducers/filters'


const toggleFilter = (field, value) => ({
  type: TOGGLE_FILTER,
  field: field,
  value: value
})

const setFilter = (field, value) => ({
  type: SET_FILTER,
  field: field,
  value: value
})

const updateFilters = (filters) => ({
  type: UPDATE_FILTERS,
  filters: filters
})


export {
  toggleFilter,
  setFilter,
  updateFilters
}

export default {
  toggleFilter,
  setFilter,
  updateFilters
}
