import Vue from 'vue'
import App from './App.vue'
import { routes } from 'router'
import staticRoutes from 'router/staticRoutes'
import VueRouter from 'vue-router'
import { name } from '../package.json'
import elementUI from 'element-ui'
import EtmPcComponentLib from 'etm-pc-component-lib'
import { setEnvOfDev } from './dev'
import { setEnvOfNonDev } from '@/nonDev'
import './styles/index.scss'
import Vuex from 'vuex'
// 引入echarts
import echarts from 'echarts'
import './utils/fixTableHeader'
import './utils/directive'
import './utils/filter'
import * as filters from './utils/filters'
// 引入剪贴板
import clipboard from 'clipboard'
import i18n from '@/i18n'
import { saveStaticRoutes, registerRoutes } from 'router/microStaticRoutes'

Vue.use(Vuex)
Vue.use(elementUI, { size: 'small', zIndex: 2000 })
Vue.use(EtmPcComponentLib, { size: 'small', zIndex: 2000 })
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$clipboard = clipboard
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

let router = null
let instance = null

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
    i18n,
    store: getGlobalState.store,
    render: h => h(App)
  }).$mount(container ? container.querySelector(`#${name}`) : `#${name}`)
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
