import requestJson from '@/utils/request-json'

// initial state
const state = {
  token: null
}

// getters
const getters = {
  reportsAuthToken: state => state.token
}

// actions
const actions = {
  async reportsQuery ({ commit }, { report, query, filters }) {
    try {
      return requestJson.post(`/api/public/query/${report}/${query}/`, { filters }, { authorization: state.token })
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
  REPORTS_AUTH_SET (state, { token }) {
    state.token = token
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
