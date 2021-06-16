import Vue from 'vue'
import App from './App.vue'
import { routes } from 'router'
import staticRouter from './router/staticRouters'
import VueRouter from 'vue-router'
import { name } from '../package.json'
import elementUI from 'element-ui'
import EtmPcComponentLib from 'etm-pc-component-lib'
import { setEnvOfDev } from './dev'
import { setEnvOfNonDev } from '@/nonDev'
import './styles/index.scss'
import echarts from 'echarts'
import './utils/fixTableHeader'
// 注入过滤器
import * as filters from './utils/filters'
import './utils/filter'
import Vuex from 'vuex'
import { saveStaticRoutes, registerRoutes } from 'router/microStaticRoutes'
Vue.use(Vuex)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(elementUI, { size: 'small', zIndex: 2000 })
Vue.use(EtmPcComponentLib, { size: 'small', zIndex: 2000 })
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
let router = null
let instance = null

function render (data = { isDev: false }, props = {}) {
  const { container, getGlobalState, appRouter } = props
  Vue.prototype.$appRouter = appRouter
  Vue.use(VueRouter)
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? `/${name}/` : '/',
    mode: 'history',
    routes: [...routes, ...staticRouter]
  })

  instance = new Vue({
    isDev: data.isDev,
    router,
    store: getGlobalState.store,
    render: h => h(App)
  }).$mount(container ? container.querySelector(`#${name}`) : `#${name}`)
  console.log('instance: ', instance)
  // 配合vue-devtools
  if (process.env.NODE_ENV === 'development') {
    const subDiv = document.createElement('div')
    subDiv.__vue__ = instance
    document.body.appendChild(subDiv)
  }
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
  saveStaticRoutes(name, staticRouter)
  registerRoutes(name, staticRouter, props)
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
