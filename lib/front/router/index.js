import Vue from 'vue'
import VueRouter from 'vue-router'
import generateReportsRouter from '@/router/reports'

Vue.use(VueRouter)

const routes = [
  ...generateReportsRouter('/reports'),
  {
    path: '*',
    redirect: '/reports'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active'
})

export default router
