import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI, { Loading } from 'element-ui-etm'
import 'element-ui-etm/lib/theme-chalk/index.css'
import EtmPcComponentLib from 'etm-pc-component-lib'
import 'etm-pc-component-lib/lib/styles/etm-purple/index.css'
import 'etm-pc-component-lib/lib/styles/etm-yellow/index.css'
import 'etm-pc-component-lib/lib/styles/etm-green/index.css'
import 'etm-pc-component-lib/lib/styles/etm-blue/index.css'
import 'etm-pc-component-lib/lib/styles/etm-brown/index.css'
import 'etm-pc-component-lib/lib/styles/etm-pink/index.css'
import 'etm-pc-component-lib/lib/styles/etm-girlPink/index.css'
import 'etm-pc-component-lib/lib/styles/etm-lavenderPurple/index.css'
import 'etm-pc-component-lib/lib/styles/etm-rainBlue/index.css'
import 'etm-pc-component-lib/lib/styles/etm-warmOrange/index.css'
import 'etm-pc-component-lib/lib/styles/etm-blackGold/index.css'

import { registerMicroApps, start } from 'qiankun'
import { apps } from './micro/index'
// collapse 展开折叠
import 'element-ui-etm/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui-etm/lib/transitions/collapse-transition'

import '@/styles/global.scss'
import '@/styles/popover.scss'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import './utils/directive'
import './utils/fixTableHeader'
// import etmQuick from './layout/main/EtmTip/src/etmQuick'
import etmQuick from 'etm-pc-component-lib/lib/js/etm-pc-component-lib.umd.min'
// 上传头像
// import client from './utils/oss'
// 引入echarts
import echarts from 'echarts'
// 引入剪贴板
import clipboard from 'clipboard'
// 注入过滤器
import * as filters from './utils/filters'
import i18n from '@/i18n'
import './utils/filter'

let service = null

function close() {
  setTimeout(() => {
    service.close()
  }, 1000)
}

registerMicroApps(apps, {
  beforeLoad: app => {
    console.log('before load app.name====>>>>>', app.name)
    service = Loading.service({
      fullscreen: true,
      lock: true,
      customClass: 'etm-loading',
      background: 'rgba(0,0,0,.1)'
    })
  },
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    app => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
      close()
    }
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
})

Vue.use(EtmPcComponentLib)

Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(etmQuick)

// Vue.prototype.client = client // 设置全局client
Vue.prototype.$echarts = echarts

// 注册到vue原型上
Vue.prototype.$clipboard = clipboard

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { size: 'small', zIndex: 2000 })
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
start({
  excludeAssetFilter: url => {
    return url.includes('//api.map.baidu.com/api')
  }
})
