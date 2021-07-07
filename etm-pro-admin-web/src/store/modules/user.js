import { login, logout, messageLogin, queryUserInfoOfEnterprise, setPassword } from '@/api/user'
import {
  getAccount,
  getToken,
  removeAllInfo,
  removeToken,
  setAccount,
  setCurrentOrganizationId,
  setFirstLogin,
  setOrganization,
  setPhone,
  setToken
} from '@/utils/auth'
import router from '@/router'
import { queryCurrentUserInfo } from '@/api/base/userInfo'

const state = {
  token: getToken(),
  name: '',
  avatar: getAccount() && getAccount().avatar,
  // routed: [],
  firstLogin: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_FIRSTLOGIN: (state, login) => {
    state.firstLogin = login
  }
}

const actions = {
  getEmployeeEnterprise({ commit }, data) {
    return new Promise((resolve, reject) => {
      queryUserInfoOfEnterprise().then(userRes => {
        const userData = userRes.data
        console.log(`userData: `, userData)
        setOrganization(userData.employeeList.map(item => {
          item.organizationId = item.enterpriseId
          item.organizationName = item.enterpriseName
          item.organizationLogo = item.enterpriseLogo
          return item
        }))

        setCurrentOrganizationId(userData.employeeList.find(value => value.employeeId === userData.currentEmployeeId).enterpriseId)
        router.push({ path: '/' })
        resolve()
      })
    })
  },
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      const { type, code, telephone, password, smsCaptcha } = userInfo
      login({ type, code, telephone, password, smsCaptcha }).then(response => {
        console.log(`response: `, response)
        const data = response.data
        setToken(data.token)
        commit('SET_TOKEN', data.token)
        setFirstLogin(!data.hasPassword)
        queryCurrentUserInfo().then(user => {
          commit('SET_AVATAR', user.data.avatar)
          setAccount({
            id: user.data.telephone,
            name: user.data.accountName,
            avatar: user.data.avatar
          })
          setPhone(user.data.telephone)
          resolve(data)
        })

        // const { data } = response
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 设置密码
  setPassword({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      setPassword(userInfo.phone, userInfo.password).then(response => {
        const { data } = response
        console.log(data)
        setFirstLogin(false)
        resolve()
      }).catch(error => {
        reject(error.response.data)
      })
    })
  },

  // 短信登录
  messageLogin({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      messageLogin({ telephone: userInfo.telephone, smsCaptcha: userInfo.smsCaptcha }).then(response => {
        const data = response.data
        setToken(data.token)
        commit('SET_TOKEN', data.token)
        setFirstLogin(!data.hasPassword)
        queryCurrentUserInfo().then(user => {
          commit('SET_AVATAR', user.data.avatar)
          setAccount({
            id: user.data.telephone,
            name: user.data.accountName,
            avatar: user.data.avatar
          })
          setPhone(user.data.telephone)
          resolve(data)
        })
      }).catch(error => {
        reject(error.response.data)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(response => {
        // commit('SET_TOKEN', '')
        // commit('DEL_NAME', name)
        // removeToken()
        removeAllInfo()
        // resetRouter()
        // removePhone()
        // removefirstLogin()
        // sessionStorage.clear()
        // store.dispatch('tagsView/delAllVisitedViews')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  SET_AVATAR({ commit }, data) {
    commit('SET_AVATAR', data)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

