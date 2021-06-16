import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EtmComponentLib from '../packages'
import '../lib/styles/etm-blue/index.css'
import '../lib/styles/etm-blackGold/index.css'
import '../lib/styles/etm-green/index.css'
import '../lib/styles/etm-brown/index.css'
import '../lib/styles/etm-pink/index.css'
import '../lib/styles/etm-yellow/index.css'
import '../lib/styles/etm-purple/index.css'
import '../lib/styles/etm-warmOrange/index.css'
import '../lib/styles/etm-rainBlue/index.css'
import '../lib/styles/etm-girlPink/index.css'
import '../lib/styles/etm-lavenderPurple/index.css'
import '../lib/styles/etm-warmOrange/index.css'
import '../packages/styles/src/index.scss'

Vue.use(ElementUI, { size: 'small' })
Vue.use(EtmComponentLib, { size: 'small' })
Vue.config.productionTip = false
// Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
