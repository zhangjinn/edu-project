import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 纽诺定制方案-考勤
const attendance_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/attendance/attendance/index')), 'attendance_neuroo')
const endorsement_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/attendance/endorsement/index')), 'endorsement_neuroo')
const statisticsDay_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/attendance/statisticsList/day')), 'statisticsDay_neuroo')
const statisticsMonth_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/attendance/statisticsList/month')), 'statisticsMonth_neuroo')
const attendanceDetail_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/attendance/detail/index')), 'attendanceDetail_neuroo')
// 纽诺定制方案-请假列表
const leave_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/leave/leave/index')), 'leave_neuroo')
const leaveDetail_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/leave/detail/index')), 'leaveDetail_neuroo')
// 纽诺定制方案-健康三检
const check_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/check/check/index')), 'check_neuroo')
const morningCheck_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/check/morningCheck/index')), 'morningCheck_neuroo')
const noonCheck_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/check/noonCheck/index')), 'noonCheck_neuroo')
const nightCheck_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/check/nightCheck/index')), 'nightCheck_neuroo')
const checkDetail_neuroo = r => require.ensure([], () => r(require('@/views/neuroo/check/detail/index')), 'checkDetail_neuroo')

const neuroo = {
  /* -------------纽诺定制-考勤-------------*/
  attendance_neuroo: [
    // 考勤统计
    {
      path: '/attendance_neuroo',
      name: 'attendance_neuroo',
      component: attendance_neuroo,
      meta: {
        showTab: true,
        title: '考勤统计'
      }
    },
    // 补签
    {
      path: '/endorsement_neuroo',
      name: 'endorsement_neuroo',
      component: endorsement_neuroo,
      meta: {
        showTab: true,
        title: '补签'
      }
    },
    // 统计明细（日）
    {
      path: '/statisticsDay_neuroo',
      name: 'statisticsDay_neuroo',
      component: statisticsDay_neuroo,
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 统计明细（月）
    {
      path: '/statisticsMonth_neuroo',
      name: 'statisticsMonth_neuroo',
      component: statisticsMonth_neuroo,
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 考勤详情
    {
      path: '/attendanceDetail_neuroo',
      name: 'attendanceDetail_neuroo',
      component: attendanceDetail_neuroo,
      meta: {
        showTab: true,
        title: '考勤详情'
      }
    }
  ],
  /* -------------纽诺定制-请假列表-------------*/
  leave_neuroo: [
    //  请假列表
    {
      path: '/leave_neuroo',
      name: 'leave_neuroo',
      component: leave_neuroo,
      meta: {
        showTab: true,
        title: '请假列表'
      }
    },
    // 请假详情
    {
      path: '/leaveDetail_neuroo',
      name: 'leaveDetail_neuroo',
      component: leaveDetail_neuroo,
      meta: {
        showTab: true,
        title: '请假详情'
      }
    }
  ],
  /* -------------纽诺定制-健康三检-------------*/
  check_neuroo: [
    // 健康三检
    {
      path: '/check_neuroo',
      name: 'check_neuroo',
      component: check_neuroo,
      meta: {
        showTab: true,
        title: '健康三检'
      }
    },
    // 晨检
    {
      path: '/morningCheck_neuroo',
      name: 'morningCheck_neuroo',
      component: morningCheck_neuroo,
      meta: {
        showTab: true,
        title: '晨检'
      }
    },
    // 午检
    {
      path: '/noonCheck_neuroo',
      name: 'noonCheck_neuroo',
      component: noonCheck_neuroo,
      meta: {
        showTab: true,
        title: '午检'
      }
    },
    // 晚检
    {
      path: '/nightCheck_neuroo',
      name: 'nightCheck_neuroo',
      component: nightCheck_neuroo,
      meta: {
        showTab: true,
        title: '晚检'
      }
    },
    // 检查详情
    {
      path: '/checkDetail_neuroo',
      name: 'checkDetail_neuroo',
      component: checkDetail_neuroo,
      meta: {
        showTab: true,
        title: '健康三检'
      }
    }
  ]
}

export default neuroo
