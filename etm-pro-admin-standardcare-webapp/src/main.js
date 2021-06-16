import Vue from 'vue'
import App from './App.vue'
import { routes, staticRoutes } from 'router'
import VueRouter from 'vue-router'
import { name } from '../package.json'
import elementUI from 'element-ui'
import EtmPcComponentLib from 'etm-pc-component-lib'
import { setEnvOfDev } from './dev'
import { setEnvOfNonDev } from '@/nonDev'
import './styles/index.scss'
import './utils/directive'
import './utils/fixTableHeader'
import { saveStaticRoutes, registerRoutes } from 'router/microStaticRoutes'
import Vuex from 'vuex'
Vue.use(elementUI, { size: 'small', zIndex: 2000 })
Vue.use(EtmPcComponentLib, { size: 'small', zIndex: 2000 })
Vue.config.productionTip = false

let router = null
let instance = null
Vue.config.productionTip = false
Vue.use(Vuex)

function render (data = { isDev: false }, props = {}) {
  const { container, getGlobalState } = props
  Vue.use(VueRouter)
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? `/${name}/` : '/',
    mode: 'history',
    routes: [...routes, ...staticRoutes]
  })

  instance = new Vue({
    isDev: data.isDev,
    router,
    store: getGlobalState.store,
    render: h => h(App)
  }).$mount(container ? container.querySelector(`#${name}`) : `#${name}`)
  Vue.prototype.$appRouter = props.appRouter
  console.log('instance: ', instance)
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({ isDev: true })
  setEnvOfDev()
} else {
  setEnvOfNonDev()
  // eslint-disable-next-line
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

export async function bootstrap (props) {
  saveStaticRoutes(name, staticRoutes)
  registerRoutes(name, staticRoutes, props)
  console.log('bootstrap', props)
}

export async function mount (props) {
  console.log('mount', props)
  render({}, props)
}

export async function unmount (props) {
  console.log('unmount', props)
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}

export async function update (props) {
  console.log('update', props)
}
