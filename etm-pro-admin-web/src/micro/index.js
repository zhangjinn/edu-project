// const store = {
//   name: 'admin'
// }
import store from '@/store'
import router from '@/router'
import Layout from '@/layout'

export const apps = [
  {
    name: 'opc',
    activeRule: '/opc/',
    entry: process.env['VUE_APP_OPC_ENTRY']
  },
  {
    name: 'daycare',
    activeRule: '/daycare/',
    entry: process.env['VUE_APP_DAYCARE_ENTRY']
  },
  {
    name: 'guardcare',
    activeRule: '/guardcare/',
    entry: process.env['VUE_APP_GUARDCARE_ENTRY']
  },
  {
    name: 'newdaycare',
    activeRule: '/newdaycare/',
    entry: process.env['VUE_APP_NEWDAYCARE_ENTRY']
  },
  {
    name: 'standardcare',
    activeRule: '/standardcare/',
    entry: process.env['VUE_APP_STANDARDCARE_ENTRY']
  },
  {
    name: 'sacc',
    activeRule: '/sacc/',
    entry: process.env['VUE_APP_SACC_ENTRY']
  },
  {
    name: 'neuroo',
    activeRule: '/neuroo/',
    entry: process.env['VUE_APP_NEUROO_ENTRY']
  },
  {
    name: 'customer',
    activeRule: '/customer/',
    entry: process.env['VUE_APP_CUSTOMER_ENTRY']
  },
  {
    name: 'evaluation',
    activeRule: '/evaluation/',
    entry: process.env['VUE_APP_EVALUATION_ENTRY']
  }
].map(app => {
  app.container = '#appContainer'
  app.props = {
    appRouter: router,
    routerBase: app.activeRule, // 下发基础路由,
    Layout: Layout, // 下发layout给子应用反注册静态路由，因为微应用挂载在layout中
    getGlobalState: { store } // 下发getGlobalState方法
  }
  return app
})

