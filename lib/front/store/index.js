import Vue from 'vue'
import Vuex from 'vuex'

import modules from '@/store/modules'
import plugins from '@/store/plugins'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins,
  strict: true
})
