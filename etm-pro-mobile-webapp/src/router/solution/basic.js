import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const homePage = r => require.ensure([], () => r(require('@/views/base/homePage/index')), 'homePage')
const editQuick = r => require.ensure([], () => r(require('@/views/base/homePage/editQuick/index')), 'editQuick')
const editData = r => require.ensure([], () => r(require('@/views/base/homePage/editData/index')), 'editData')
const toDoList = r => require.ensure([], () => r(require('@/views/base/homePage/toDoList/index')), 'toDoList')
const headline = r => require.ensure([], () => r(require('@/views/base/homePage/headline/index')), 'headline')

const basicBusiness = {
  homepage: [
    // 首页
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage,
      meta: {
        showTab: true,
        title: '首页',
        fActive: 0
      }
    },
    // 快捷应用
    {
      path: '/editQuick',
      name: 'editQuick',
      component: editQuick,
      meta: {
        title: '首页'
      }
    },
    // 数据卡片
    {
      path: '/editData',
      name: 'editData',
      component: editData,
      meta: {
        title: '首页'
      }
    },
    // 待办提醒
    {
      path: '/toDoList',
      name: 'toDoList',
      component: toDoList,
      meta: {
        title: '首页'
      }
    },
    // 行业头条
    {
      path: '/headline',
      name: 'headline',
      component: headline,
      meta: {
        title: '首页'
      }
    }
  ]
}

export default basicBusiness
