import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'
import './config/rem'
import './assets/style/main.scss'
import 'amfe-flexible/index.js'
import VueWechatTitle from 'vue-wechat-title' // 引入标题组件
import vueHashCalendar from 'vue-hash-calendar' // 引入日历表
import 'vue-hash-calendar/lib/vue-hash-calendar.css' // 引入组件CSS样式
// 引入echarts
import echarts from 'echarts'
// 引入wxSDK
const wx = require('weixin-js-sdk')
Vue.prototype.$wx = wx
// 全局引入vant组件

import { ActionSheet, Area, Button, Cell, CellGroup, Checkbox, CheckboxGroup, Circle, Col, Collapse, CollapseItem, DatetimePicker, Dialog, DropdownItem, DropdownMenu, Field, Form, Icon, Image, Lazyload, List, Loading, NavBar, Notify, Overlay, Picker, Popup, Radio, RadioGroup, Row, Search, Step, Steps, Swipe, SwipeItem, Switch, Tab, Tabbar, TabbarItem, Tabs, Tag, Toast, Uploader } from 'vant'

Vue.prototype.$echarts = echarts

Vue.use(VueWechatTitle)
Vue.use(vueHashCalendar)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(ActionSheet)
Vue.use(Field)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Uploader)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(List)
Vue.use(Search)
Vue.use(Button)
Vue.use(Image)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(Tag)
Vue.use(Overlay)
Vue.use(Icon)
Vue.use(Area)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Picker)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Loading)
Vue.use(Notify)
Vue.use(Circle)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(NavBar)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Switch)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Lazyload)
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title*/
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

Toast.setDefaultOptions({ forbidClick: true })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
