import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 托育方案-考勤
const attendance = r => require.ensure([], () => r(require('@/views/sacc/attendance/attendance/index')), 'attendance')
const signIn = r => require.ensure([], () => r(require('@/views/sacc/attendance/signIn/index')), 'signIn')
const signOut = r => require.ensure([], () => r(require('@/views/sacc/attendance/signOut/index')), 'signOut')
// 托育方案-晨午检
const checkHome = r => require.ensure([], () => r(require('@/views/sacc/bodyCheck/checkHome/index')), 'checkHome')
const morningCheck = r => require.ensure([], () => r(require('@/views/sacc/bodyCheck/morningCheck/index')), 'morningCheck')
const noonCheck = r => require.ensure([], () => r(require('@/views/sacc/bodyCheck/noonCheck/index')), 'noonCheck')
// 托育方案-成长记录相关-记睡眠
const sleepRecord = r => require.ensure([], () => r(require('@/views/sacc/sleepRecord/index')), 'sleepRecord')
const sleepDetail = r => require.ensure([], () => r(require('@/views/sacc/sleepRecord/detail/index')), 'sleepDetail')
// 托育方案-成长记录相关-记膳食
const dietRecord = r => require.ensure([], () => r(require('@/views/sacc/dietRecord/index')), 'dietRecord')
const foodRecord = r => require.ensure([], () => r(require('@/views/sacc/dietRecord/food/index')), 'foodRecord')
const milkRecord = r => require.ensure([], () => r(require('@/views/sacc/dietRecord/milk/index')), 'milkRecord')
const dietDetail = r => require.ensure([], () => r(require('@/views/sacc/dietRecord/detail/index')), 'dietDetail')
// 托育方案-成长记录相关-记饮水
const drinkRecord = r => require.ensure([], () => r(require('@/views/sacc/drinkRecord/index')), 'drinkRecord')
const drinkSet = r => require.ensure([], () => r(require('@/views/sacc/drinkRecord/set/index')), 'drinkSet')
const drinkDetail = r => require.ensure([], () => r(require('@/views/sacc/drinkRecord/detail/index')), 'drinkDetail')
// 托育方案-成长记录相关-记便便
const stoolRecord = r => require.ensure([], () => r(require('@/views/sacc/stoolRecord/index')), 'stoolRecord')
const stoolSet = r => require.ensure([], () => r(require('@/views/sacc/stoolRecord/set/index')), 'stoolSet')
const stoolDetail = r => require.ensure([], () => r(require('@/views/sacc/stoolRecord/detail/index')), 'stoolDetail')
// 托育方案-成长记录相关-记情绪
const emotionRecord = r => require.ensure([], () => r(require('@/views/sacc/emotionRecord/index')), 'emotionRecord')
const emotionSet = r => require.ensure([], () => r(require('@/views/sacc/emotionRecord/set/index')), 'emotionSet')
const emotionDetail = r => require.ensure([], () => r(require('@/views/sacc/emotionRecord/detail/index')), 'emotionDetail')

const sacc = {
  /* -------------托育管理-考勤-------------*/
  attendance: [
    // 考勤首页
    {
      path: '/attendance',
      name: 'attendance',
      component: attendance,
      meta: {
        showTab: true,
        title: '考勤'
      }
    },
    // 送园签入
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn,
      meta: {
        showTab: true,
        title: '送园签入'
      }
    },
    // 离园签出
    {
      path: '/signOut',
      name: 'signOut',
      component: signOut,
      meta: {
        showTab: true,
        title: '离园签出'
      }
    }
  ],
  /* -------------托育管理-晨午检-------------*/
  checkHome: [
    // 晨午检首页
    {
      path: '/checkHome',
      name: 'checkHome',
      component: checkHome,
      meta: {
        showTab: true,
        title: '晨午检'
      }
    },
    // 开始晨检
    {
      path: '/morningCheck',
      name: 'morningCheck',
      component: morningCheck,
      meta: {
        showTab: true,
        title: '开始晨检'
      }
    },
    // 开始午检
    {
      path: '/noonCheck',
      name: 'noonCheck',
      component: noonCheck,
      meta: {
        showTab: true,
        title: '开始午检'
      }
    }
  ],
  /* -------------托育管理-睡眠记录-------------*/
  sleepRecord: [
    {
      path: '/sleepRecord',
      name: 'sleepRecord',
      component: sleepRecord,
      meta: {
        showTab: true,
        title: '睡眠记录'
      }
    },
    {
      path: '/sleepDetail',
      name: 'sleepDetail',
      component: sleepDetail,
      meta: {
        showTab: true,
        title: '睡眠详情'
      }
    }
  ],
  /* -------------托育管理-膳食记录-------------*/
  dietRecord: [
    {
      path: '/dietRecord',
      name: 'dietRecord',
      component: dietRecord,
      meta: {
        showTab: true,
        title: '膳食记录'
      }
    },
    {
      path: '/foodRecord',
      name: 'foodRecord',
      component: foodRecord,
      meta: {
        showTab: true,
        title: '记餐食'
      }
    },
    {
      path: '/milkRecord',
      name: 'milkRecord',
      component: milkRecord,
      meta: {
        showTab: true,
        title: '记喂奶'
      }
    },
    {
      path: '/dietDetail',
      name: 'dietDetail',
      component: dietDetail,
      meta: {
        showTab: true,
        title: '膳食详情'
      }
    }
  ],
  /* -------------托育管理-饮水记录-------------*/
  drinkRecord: [
    {
      path: '/drinkRecord',
      name: 'drinkRecord',
      component: drinkRecord,
      meta: {
        showTab: true,
        title: '饮水记录'
      }
    },
    {
      path: '/drinkSet',
      name: 'drinkSet',
      component: drinkSet,
      meta: {
        showTab: true,
        title: '记饮水'
      }
    },
    {
      path: '/drinkDetail',
      name: 'drinkDetail',
      component: drinkDetail,
      meta: {
        showTab: true,
        title: '饮水详情'
      }
    }
  ],
  /* -------------托育管理-便便记录-------------*/
  stoolRecord: [
    {
      path: '/stoolRecord',
      name: 'stoolRecord',
      component: stoolRecord,
      meta: {
        showTab: true,
        title: '便便记录'
      }
    },
    {
      path: '/stoolSet',
      name: 'stoolSet',
      component: stoolSet,
      meta: {
        showTab: true,
        title: '记便便'
      }
    },
    {
      path: '/stoolDetail',
      name: 'stoolDetail',
      component: stoolDetail,
      meta: {
        showTab: true,
        title: '便便详情'
      }
    }
  ],
  /* -------------托育管理-情绪记录-------------*/
  emotionRecord: [
    {
      path: '/emotionRecord',
      name: 'emotionRecord',
      component: emotionRecord,
      meta: {
        showTab: true,
        title: '情绪记录'
      }
    },
    {
      path: '/emotionSet',
      name: 'emotionSet',
      component: emotionSet,
      meta: {
        showTab: true,
        title: '记情绪'
      }
    },
    {
      path: '/emotionDetail',
      name: 'emotionDetail',
      component: emotionDetail,
      meta: {
        showTab: true,
        title: '情绪详情'
      }
    }
  ]
}

export default sacc
