// import globalFilters from '@/store/modules/reports/global-filters'

// initial state
const state = {
}

// getters
const getters = {
}

// actions
const actions = {
  async reportsQuery (store, { report, query, filters }) {
    const rawResponse = await fetch(`/api/public/query/${report}/${query}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filters })
    })

    return await rawResponse.json()
  }
}

// mutations
const mutations = {
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
