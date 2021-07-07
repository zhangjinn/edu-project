import router from './router'
import store from './store'
import { Message } from 'element-ui-etm'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getFirstLogin, getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
import { apps } from './micro/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

function hasNavigateToMicro(path) {
  return apps.some(item => item.activeRule.includes(path))
}

const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress
  NProgress.start()

  // set page title
  // document.title = getConfig().title || '' // getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) { // hasToken
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      store.commit('login/SET_FIRSTLOGIN', false)
      next({ path: '/' })
      NProgress.done()
    } else {
      if (JSON.parse(getFirstLogin())) {
        // 如果是第一次登录，弹出设置密码的框
        store.commit('login/SET_FIRSTLOGIN', true)
      }
      if (store.state.login.hasRoutes) {
        if (to.name) {
          next()
        } else if (hasNavigateToMicro(to.path)) {
          next()
        }
        NProgress.done()
      } else {
        try {
          await store.dispatch('permission/generateRoutes')
          store.commit('login/SET_HASROUTES', true)
          next({ ...to, replace: true })
          // next({ path: '/', replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

