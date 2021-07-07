import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 幼托首页
const guardcare_homepage = r => require.ensure([], () => r(require('@/views/guardcare/homePage/index')), 'guardcare_homepage')

// 幼托一体化方案-考勤
const guardcare_attendance = r => require.ensure([], () => r(require('@/views/guardcare/attendance/attendance/index')), 'guardcare_attendance')
const guardcare_endorsement = r => require.ensure([], () => r(require('@/views/guardcare/attendance/endorsement/index')), 'guardcare_endorsement')
const guardcare_statisticsDay = r => require.ensure([], () => r(require('@/views/guardcare/attendance/statisticsList/day')), 'guardcare_statisticsDay')
const guardcare_statisticsMonth = r => require.ensure([], () => r(require('@/views/guardcare/attendance/statisticsList/month')), 'guardcare_statisticsMonth')
const guardcare_attendanceDetail = r => require.ensure([], () => r(require('@/views/guardcare/attendance/detail/index')), 'guardcare_attendanceDetail')
// 幼托一体化方案-请假列表
const guardcare_leave = r => require.ensure([], () => r(require('@/views/guardcare/leave/leave/index')), 'guardcare_leave')
const guardcare_leaveDetail = r => require.ensure([], () => r(require('@/views/guardcare/leave/detail/index')), 'guardcare_leaveDetail')
// 幼托一体化方案-健康检查
const guardcare_bodyCheck = r => require.ensure([], () => r(require('@/views/guardcare/check/check/index')), 'guardcare_bodyCheck')
const guardcare_checkPage = r => require.ensure([], () => r(require('@/views/guardcare/check/checkPage/index')), 'guardcare_checkPage')
const guardcare_checkDetail = r => require.ensure([], () => r(require('@/views/guardcare/check/detail/index')), 'guardcare_checkDetail')
// 幼托一体化方案-宝宝表现
const guardcare_comment = r => require.ensure([], () => r(require('@/views/guardcare/comment/index')), 'guardcare_comment')
const guardcare_detail = r => require.ensure([], () => r(require('@/views/guardcare/comment/detail')), 'guardcare_detail')
const guardcare_commentSetting = r => require.ensure([], () => r(require('@/views/guardcare/comment/setting')), 'guardcare_commentSetting')

// 幼托一体化方案-交待事宜
const guardcare_matterList = r => require.ensure([], () => r(require('@/views/guardcare/matter/index')), 'guardcare_matterList')
const guardcare_matterListDetail = r => require.ensure([], () => r(require('@/views/guardcare/matter/detail')), 'guardcare_matterListDetail')

// 幼托一体化方案-每周计划
const guardcare_weekPlan = r => require.ensure([], () => r(require('@/views/guardcare/plan/index')), 'guardcare_weekPlan')

// 幼托一体化方案-幼儿食谱
const guardcare_recipesManage = r => require.ensure([], () => r(require('@/views/guardcare/recipes/index')), 'guardcare_recipesManage')

// 云监控
const guardcare_monitorEquipment = r => require.ensure([], () => r(require('@/views/guardcare/monitorEquipment/index')), 'guardcare_monitorEquipment')
const guardcare_monitorEquipment_read = r => require.ensure([], () => r(require('@/views/guardcare/monitorEquipment/video')), 'guardcare_monitorEquipment_read')

// 动态
const guardcare_dynamic = r => require.ensure([], () => r(require('@/views/guardcare/dynamics/index')), 'guardcare_dynamic')
const guardcare_postDynamic = r => require.ensure([], () => r(require('@/views/guardcare/dynamics/postDynamics/index')), 'guardcare_postDynamic')
const guardcare_dynamicDetail = r => require.ensure([], () => r(require('@/views/guardcare/dynamics/detail/index')), 'guardcare_dynamicDetail')

// 萌宝成长
const guardcare_dailyManage = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/index')), 'guardcare_dailyManage')
const guardcare_dailyManageSetting = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/settings/index')), 'guardcare_dailyManageSetting')
const guardcare_dailyManageBrief = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/brief')), 'guardcare_dailyManageBrief')
const guardcare_dailyManageSleep = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/sleep')), 'guardcare_dailyManageSleep')
const guardcare_dailyManageEat = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/eat')), 'guardcare_dailyManageEat')
const guardcare_dailyManageCustom = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/custom')), 'guardcare_dailyManageCustom')
const guardcare_dailyManageDiaper = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/diaper')), 'guardcare_dailyManageDiaper')
const guardcare_dailyManageDrink = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/drink')), 'guardcare_dailyManageDrink')
const guardcare_dailyManageEmotion = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/emotion')), 'guardcare_dailyManageEmotion')
const guardcare_dailyManageMilk = r => require.ensure([], () => r(require('@/views/guardcare/dailyManage/detail/milk')), 'guardcare_dailyManageMilk')

const guardcare = {
  guardcare_homepage: [
    // 幼托首页
    {
      path: '/guardcare_homepage',
      name: 'guardcare_homepage',
      component: guardcare_homepage,
      meta: {
        showTab: true,
        title: '首页',
        fActive: 0
      }
    }
  ],
  guardcare_attendance: [
    // 考勤统计
    {
      path: '/guardcare_attendance',
      name: 'guardcare_attendance',
      component: guardcare_attendance,
      meta: {
        showTab: true,
        title: '考勤统计',
        fActive: 1
      }
    },
    // 补签
    {
      path: '/guardcare_endorsement',
      name: 'guardcare_endorsement',
      component: guardcare_endorsement,
      meta: {
        showTab: true,
        title: '补签',
        fActive: 1
      }
    },
    // 统计明细（日）
    {
      path: '/guardcare_statisticsDay',
      name: 'guardcare_statisticsDay',
      component: guardcare_statisticsDay,
      meta: {
        showTab: true,
        title: '统计明细',
        fActive: 1
      }
    },
    // 统计明细（月）
    {
      path: '/guardcare_statisticsMonth',
      name: 'guardcare_statisticsMonth',
      component: guardcare_statisticsMonth,
      meta: {
        showTab: true,
        title: '统计明细',
        fActive: 1
      }
    },
    // 考勤详情
    {
      path: '/guardcare_attendanceDetail',
      name: 'guardcare_attendanceDetail',
      component: guardcare_attendanceDetail,
      meta: {
        showTab: true,
        title: '考勤详情',
        fActive: 1
      }
    }
  ],
  /* -------------请假列表-------------*/
  guardcare_leave: [
    //  请假列表
    {
      path: '/guardcare_leave',
      name: 'guardcare_leave',
      component: guardcare_leave,
      meta: {
        showTab: true,
        title: '幼儿请假',
        fActive: 1
      }
    },
    // 请假详情
    {
      path: '/guardcare_leaveDetail',
      name: 'guardcare_leaveDetail',
      component: guardcare_leaveDetail,
      meta: {
        showTab: true,
        title: '请假详情',
        fActive: 1
      }
    }
  ],
  /* -------------健康检查-------------*/
  guardcare_bodyCheck: [
    // 健康检查
    {
      path: '/guardcare_bodyCheck',
      name: 'guardcare_bodyCheck',
      component: guardcare_bodyCheck,
      meta: {
        showTab: true,
        title: '健康检查',
        fActive: 1
      }
    },
    // 检查页面
    {
      path: '/guardcare_checkPage',
      name: 'guardcare_checkPage',
      component: guardcare_checkPage,
      meta: {
        showTab: true,
        title: '',
        fActive: 1
      }
    },
    // 检查详情
    {
      path: '/guardcare_checkDetail',
      name: 'guardcare_checkDetail',
      component: guardcare_checkDetail,
      meta: {
        showTab: true,
        title: '健康检查',
        fActive: 1
      }
    }
  ],
  /* -------------宝宝表现-------------*/
  guardcare_comment: [
    {
      path: '/guardcare_comment',
      name: 'guardcare_comment',
      component: guardcare_comment,
      meta: {
        showTab: false,
        title: '宝宝表现'
      }
    },
    {
      path: '/guardcare_detail',
      name: 'guardcare_detail',
      component: guardcare_detail,
      meta: {
        showTab: false,
        title: '表现详情'
      }
    },
    {
      path: '/guardcare_commentSetting',
      name: 'guardcare_commentSetting',
      component: guardcare_commentSetting,
      meta: {
        showTab: false,
        title: '点评设置'
      }
    }
  ],
  /* --------------云监控---------------*/
  guardcare_monitorEquipment: [
    {
      path: '/guardcare_monitorEquipment',
      name: 'guardcare_monitorEquipment',
      component: guardcare_monitorEquipment,
      meta: {
        showTab: false,
        title: '云视频'
      }
    },
    {
      path: '/guardcare_monitorEquipment_read',
      name: 'guardcare_monitorEquipment_read',
      component: guardcare_monitorEquipment_read,
      meta: {
        showTab: false,
        title: '云视频'
      }
    }
  ],
  /* -------------交待事宜-------------*/
  guardcare_matterList: [
    {
      path: '/guardcare_matterList',
      name: 'guardcare_matterList',
      component: guardcare_matterList,
      meta: {
        showTab: false,
        title: '交代事宜'
      }
    },
    {
      path: '/guardcare_matterListDetail',
      name: 'guardcare_matterListDetail',
      component: guardcare_matterListDetail,
      meta: {
        showTab: false,
        title: '事宜详情'
      }
    }
  ],
  /* -------------每周计划-------------*/
  guardcare_weekPlan: [
    {
      path: '/guardcare_weekPlan',
      name: 'guardcare_weekPlan',
      component: guardcare_weekPlan,
      meta: {
        showTab: false,
        title: '每周计划'
      }
    }
  ],
  /* -------------幼儿食谱-------------*/
  guardcare_recipesManage: [
    {
      path: '/guardcare_recipesManage',
      name: 'guardcare_recipesManage',
      component: guardcare_recipesManage,
      meta: {
        showTab: false,
        title: '幼儿食谱'
      }
    }
  ],
  /* -------------萌宝成长-------------*/
  guardcare_dailyManage: [
    {
      path: '/guardcare_dailyManage',
      name: 'guardcare_dailyManage',
      component: guardcare_dailyManage,
      meta: {
        showTab: false,
        title: '萌宝成长'
      }
    },
    {
      path: '/guardcare_dailyManageSetting',
      name: 'guardcare_dailyManageSetting',
      component: guardcare_dailyManageSetting,
      meta: {
        showTab: false,
        title: '萌宝成长设置'
      }
    },
    {
      path: '/guardcare_dailyManageBrief',
      name: 'guardcare_dailyManageBrief',
      component: guardcare_dailyManageBrief,
      meta: {
        showTab: false,
        title: '萌宝成长记'
      }
    },
    {
      path: '/guardcare_dailyManageSleep',
      name: 'guardcare_dailyManageSleep',
      component: guardcare_dailyManageSleep,
      meta: {
        showTab: false,
        title: '睡眠'
      }
    },
    {
      path: '/guardcare_dailyManageEat',
      name: 'guardcare_dailyManageEat',
      component: guardcare_dailyManageEat,
      meta: {
        showTab: false,
        title: '进食'
      }
    },
    {
      path: '/guardcare_dailyManageCustom',
      name: 'guardcare_dailyManageCustom',
      component: guardcare_dailyManageCustom,
      meta: {
        showTab: false,
        title: '自定义'
      }
    },
    {
      path: '/guardcare_dailyManageDiaper',
      name: 'guardcare_dailyManageDiaper',
      component: guardcare_dailyManageDiaper,
      meta: {
        showTab: false,
        title: '换尿布'
      }
    },
    {
      path: '/guardcare_dailyManageDrink',
      name: 'guardcare_dailyManageDrink',
      component: guardcare_dailyManageDrink,
      meta: {
        showTab: false,
        title: '喝水'
      }
    },
    {
      path: '/guardcare_dailyManageEmotion',
      name: 'guardcare_dailyManageEmotion',
      component: guardcare_dailyManageEmotion,
      meta: {
        showTab: false,
        title: '情绪'
      }
    },
    {
      path: '/guardcare_dailyManageMilk',
      name: 'guardcare_dailyManageMilk',
      component: guardcare_dailyManageMilk,
      meta: {
        showTab: false,
        title: '喂奶'
      }
    }
  ],
  guardcare_clazzPost: [
    {
      path: '/guardcare_clazzPost',
      name: 'guardcare_clazzPost',
      component: guardcare_dynamic,
      meta: {
        showTab: true,
        title: '动态'
      }
    },
    {
      path: '/guardcare_postDynamic',
      name: 'guardcare_postDynamic',
      component: guardcare_postDynamic,
      meta: {
        showTab: true,
        title: '动态'
      }
    },
    {
      path: '/guardcare_dynamicsDetail',
      name: 'guardcare_dynamicsDetail',
      component: guardcare_dynamicDetail,
      meta: {
        showTab: false,
        title: '动态'
      }
    }
  ]
}

export default guardcare
