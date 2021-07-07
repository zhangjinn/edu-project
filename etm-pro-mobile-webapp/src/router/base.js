import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 登录
const captchaLogin = r => require.ensure([], () => r(require('@/views/base/login/captchaLogin/index')), 'captchaLogin')
const passwordLogin = r => require.ensure([], () => r(require('@/views/base/login/passwordLogin/index')), 'passwordLogin')
const wechatLogin = r => require.ensure([], () => r(require('@/views/base/login/wechatLogin/index')), 'wechatLogin')
const setPassword = r => require.ensure([], () => r(require('@/views/base/login/setPassword/index')), 'setPassword')
// 首页
const index = r => require.ensure([], () => r(require('@/views/base/index/index')), 'index')
// 通讯录
const contactList = r => require.ensure([], () => r(require('@/views/base/contact/contactList/index')), 'contactList')
const contact = r => require.ensure([], () => r(require('@/views/base/contact/contact/index')), 'contact')
const colleaguesDetails = r => require.ensure([], () => r(require('@/views/base/contact/colleaguesDetails/index')), 'colleaguesDetails')
// 我的
const mine = r => require.ensure([], () => r(require('@/views/base/mine/mine/index')), 'mine')
const personInfo = r => require.ensure([], () => r(require('@/views/base/mine/personInfo/index')), 'personInfo')
const changeUserName = r => require.ensure([], () => r(require('@/views/base/mine/changeUserName/index')), 'changeUserName')
const changePassword = r => require.ensure([], () => r(require('@/views/base/mine/changePassword/index')), 'changePassword')
const switchOrganization = r => require.ensure([], () => r(require('@/views/base/mine/switchOrganization/index')), 'switchOrganization')
const about = r => require.ensure([], () => r(require('@/views/base/mine/about/index')), 'about')
const customerService = r => require.ensure([], () => r(require('@/views/base/mine/customerService/index')), 'customerService')
// 错误页面
const error = r => require.ensure([], () => r(require('@/views/base/error/index')), 'error')
// 工作台
const workBench = r => require.ensure([], () => r(require('@/views/base/workBench/index')), 'workBench')
// 搜索页面
const search = r => require.ensure([], () => r(require('@/views/base/search/search/index')), 'search')
const searchResult = r => require.ensure([], () => r(require('@/views/base/search/searchResult/index')), 'searchResult')
// 待办事项列表
const taskList = r => require.ensure([], () => r(require('@/views/base/taskList/index')), 'taskList')
// 后续删除
// const test = r => require.ensure([], () => r(require('@/views/daycare/test')), 'test')
const digitalCard = r => require.ensure([], () => r(require('@/views/daycare/digitalCard/index')), 'digitalCard')
const digitalCardEdit = r => require.ensure([], () => r(require('@/views/daycare/digitalCard/edit')), 'digitalCardEdit')

const base = [
  // 默认路径
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '*',
    redirect: '/'
  },
  /* -------------登录验证-------------*/
  // 密码登录
  {
    path: '/passwordLogin',
    name: 'passwordLogin',
    component: passwordLogin,
    meta: {
      title: '密码登录'
    }
  },
  // 验证码登录
  {
    path: '/captchaLogin',
    name: 'captchaLogin',
    component: captchaLogin,
    meta: {
      title: '验证码登录'
    }
  },
  // 微信登录
  {
    path: '/wechatLogin',
    name: 'wechatLogin',
    component: wechatLogin,
    meta: {
      title: '微信登录'
    }
  },
  //  首次登陆设置密码
  {
    path: '/setPassword',
    name: 'setPassword',
    component: setPassword,
    meta: {
      title: '设置密码'
    }
  },

  /* -------------菜单栏-------------*/
  // 首页
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: {
      showTab: true,
      title: '首页',
      fActive: 0
    }
  },
  // 工作台
  {
    path: '/workBench',
    name: 'workBench',
    component: workBench,
    meta: {
      showTab: true,
      title: '工作台',
      fActive: 1
    }
  },
  // 我的
  {
    path: '/mine',
    name: 'mine',
    component: mine,
    meta: {
      showTab: true,
      title: '我的',
      fActive: 2
    }
  },

  /* -------------页面-------------*/
  // 全局搜索
  {
    path: '/search',
    name: 'search',
    component: search,
    meta: {
      showTab: true,
      title: '搜索'
    }
  },
  // 搜索结果
  {
    path: '/searchResult',
    name: 'searchResult',
    component: searchResult,
    meta: {
      showTab: true,
      title: '搜索结果'
    }
  },
  // 事务列表
  {
    path: '/taskList',
    name: 'taskList',
    component: taskList,
    meta: {
      showTab: true,
      title: '事务列表'
    }
  },
  // 网络错误页面
  {
    path: '/error',
    name: 'error',
    component: error,
    meta: {
      title: '网络错误'
    }
  },

  /* -------------通讯录详细-------------*/
  // 通讯录
  {
    path: '/contactList',
    name: 'contactList',
    component: contactList,
    meta: {
      title: '通讯录'
    }
  },
  // 公司部门
  {
    path: '/contact',
    name: 'contact',
    component: contact,
    meta: {
      showTab: true,
      title: '公司部门',
      fActive: 2
    }
  },
  // 同事详情
  {
    path: '/colleaguesDetails',
    name: 'colleaguesDetails',
    component: colleaguesDetails,
    meta: {
      showTab: true,
      title: '同事详情',
      fActive: 2
    }
  },

  /* -------------我的详细-------------*/
  // 个人信息
  {
    path: '/personInfo',
    name: 'personInfo',
    component: personInfo,
    meta: {
      title: '我的'
    }
  },
  // 修改姓名
  {
    path: '/changeUserName',
    name: 'changeUserName',
    component: changeUserName,
    meta: {
      title: '我的'
    }
  },
  // 修改密码
  {
    path: '/changePassword',
    name: 'changePassword',
    component: changePassword,
    meta: {
      title: '我的'
    }
  },
  // 切换组织
  {
    path: '/switchOrganization',
    name: 'switchOrganization',
    component: switchOrganization,
    meta: {
      title: '我的'
    }
  },
  // 关于
  {
    path: '/about',
    name: 'about',
    component: about,
    meta: {
      title: '我的'
    }
  },
  // 我的客服
  {
    path: '/customerService',
    name: 'customerService',
    component: customerService,
    meta: {
      title: '我的'
    }
  },
  // 后续删除
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: test,
  //   meta: {
  //     showTab: true,
  //     title: '抽离动态列表'
  //     // fActive: 3
  //   }
  // },
  {
    path: '/digitalCard',
    name: 'digitalCard',
    component: digitalCard,
    meta: {
      // showTab: true,
      title: '数字名片'
    }
  },
  {
    path: '/digitalCardEdit',
    name: 'digitalCardEdit',
    component: digitalCardEdit,
    meta: {
      // showTab: true,
      title: '数字名片'
    }
  }
]

export default base
