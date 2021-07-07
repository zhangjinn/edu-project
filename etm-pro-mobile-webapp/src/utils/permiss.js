import { getSolution, setSolutionRouter } from '../js/localStore'
import router, { resetRouter } from '../router'
import solution from '../router/solution'
import store from '../store'
import { getCodeByPath } from '../auth'

export const setAsyncRouter = function() {
  const asyncRoute = []
  const solutionData = getSolution()
  const solutionList = []
  const unRepeatData = []
  if (solutionData) {
    solutionData.forEach(list => {
      if (list.type === 'BUSINESS' && list.resourceList.length) {
        list.resourceList.forEach(item => {
          if (item.type === 'MENU' && !unRepeatData.includes(item.url)) {
            unRepeatData.push(item.url)
            solutionList.push(item)
          }
        })
      }
    })
  }
  const routeFlag = store.state.route.router
  if (solutionList.length && !routeFlag) {
    solutionList.forEach(list => {
      for (const i in solution) {
        if (list.url === i) {
          solution[i].forEach(item => {
            asyncRoute.push(item)
          })
        }
      }
    })
    store.commit('route/SET_ROUTER', true)
    resetRouter()
    router.addRoutes(asyncRoute)
    setSolutionRouter(asyncRoute)
  }
}

export const judgeAuth = function(authId) {
  const BUTTON = JSON.parse(localStorage.getItem('BUTTON'))
  let code = ''
  const result = BUTTON.find(item => {
    if (item.identify) {
      try {
        item.identify = JSON.parse(item.identify)
      } catch (e) {
        // console.log('序列化资源标识失败, 请确认标识是否为JSON格式', item)
      }
    }

    try {
      code = getCodeByPath(authId)
    } catch (e) {
      console.error(`请检查权限值是否正确`)
    }
    return item.identify.authId === code
  })
  if (result) {
    return true
  } else {
    return false
  }
}
