import router, { asyncRouters, constantRoutes, refreshRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: [],
  routed: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTED: (state, routed) => {
    state.routed = routed
  }
}

const actions = {

  async generateRoutes({ commit }) {
    await refreshRoutes((defaultUrl) => {
      const routes = asyncRouters
      routes.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      try {
        router.addRoutes(routes)
      } catch (e) {
        console.error('路由配置出错了, 可能是资源缺少[path]字段或为["", null]')
        console.error('error in src/store/modules/permission.js:64 function:() ', e)
      }
      commit('SET_ROUTED', routes)
      commit('SET_ROUTES', routes)
    })
    // getAyncRoutes(routes, [])
    // return new Promise(resolve => {
    //   ownRouter(params).then(res => {
    //     const routes = []
    //     console.log('generateRoutes' + res.data)
    //
    //     commit('SET_ROUTED', res.data)
    //     getAyncRoutes(routes, res.data)
    //     commit('SET_ROUTES', routes)
    //     routes.push({
    //       path: '*',
    //       redirect: '/404',
    //       hidden: true
    //     })
    //     router.addRoutes(routes)
    //     resolve(routes)
    //   })
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
