import Vue from 'vue'
import Router from 'vue-router'
import { baseUrl, routerMode } from '../config/env'
import base from './base'

Vue.use(Router)

const createRouter = () => new Router({
  mode: routerMode,
  base: baseUrl,
  routes: [
    ...base
  ]
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router
