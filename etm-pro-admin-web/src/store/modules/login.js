const state = {
  loading: false,
  redirect: undefined,
  loginType: 'account',
  password: {},
  firstLogin: false, // 短信登陆时，是否是第一次登录
  hasRoutes: false
}

const mutations = {
  SET_LOADING: (state, status) => {
    state.loading = status
  },
  SET_REDIRECT: (state, redirect) => {
    state.redirect = redirect
  },
  SET_TYPE: (state, type) => {
    state.loginType = type
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_FIRSTLOGIN: (state, firstLogin) => {
    state.firstLogin = firstLogin
  },
  SET_HASROUTES: (state, hasRoutes) => {
    state.hasRoutes = hasRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
