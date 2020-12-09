import requestJson from '@/utils/request-json'

// initial state
const state = {
  token: null,
  filterReports: null
}

// getters
const getters = {
  reportsAuthToken: state => state.token,
  reportsAuthFilters: state => state.filterReports
}

// actions
const actions = {
  async reportsQuery ({ commit }, { report, query, filters }) {
    try {
      return await requestJson.post(`/api/public/query/${report}/${query}/`, { filters }, { authorization: state.token })
    } catch (err) {
      if (err.status === 401) {
        commit('REPORTS_AUTH_SET', { token: null })
      }
      throw err
    }
  }
}

// mutations
const mutations = {
  REPORTS_AUTH_SET (state, { token, filterReports = null }) {
    state.token = token
    state.filterReports = filterReports
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    // globalFilters
  }
}
