import Vue from 'vue'
import App from './App.vue'
import { routes } from 'router'
import VueRouter from 'vue-router'
import { name } from '../package.json'
import elementUI from 'element-ui'
import EtmPcComponentLib from 'etm-pc-component-lib'
import { setEnvOfDev } from './dev'
import { setEnvOfNonDev } from '@/nonDev'
import './styles/index.scss'

Vue.use(elementUI, { size: 'small', zIndex: 2000 })
Vue.use(EtmPcComponentLib, { size: 'small', zIndex: 2000 })
Vue.config.productionTip = false

let router = null
let instance = null

function render (data = { isDev: false }, props = {}) {
  let result
  try {
    const routeGroup = JSON.parse(localStorage.getItem('routeGroup'))
    result = routeGroup[name].map(item => {
      item.config = JSON.parse(item.config)
      const find = routes.find(route => route.name === item.config.name)
      if (find.component) {
        item.component = find.component
        return item
      }
    })
  } catch (e) {
    result = routes
    console.error('error in src/main.js:22 function:render() ', e)
  }

  console.log('result: ', result)

  const { container } = props
  Vue.use(VueRouter)
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? `/${name}/` : '/',
    mode: 'history',
    routes: result
  })

  instance = new Vue({
    isDev: data.isDev,
    router,
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
  console.log('bootstrap', props)
}

export async function mount (props) {
  console.log('mount', props)
  render()
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
