import Vue from 'vue'
import App from '@/app.vue'
import router from '@/router'
import store from '@/store'
import '@/app.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
