import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const daycare = {
  /* -------------首页-------------*/
  daycare_homepage: [
    {
      path: '/daycare_homepage',
      name: 'daycare_homepage',
      component: () => import('@/views/daycare/homePage/index'),
      meta: {
        showTab: true,
        title: '首页',
        fActive: 0
      }
    }
  ],
  daycare_attendanceTeach: [
    // 早勤统计
    {
      path: '/daycare_attendanceTeach',
      name: 'daycare_attendanceTeach',
      component: () => import('@/views/daycare/attendanceTeach/attendance/index'),
      // component: daycare_attendanceTeach,
      meta: {
        showTab: true,
        title: '考勤统计'
      }
    },
    // 补签
    {
      path: '/daycare_teach_endorsement',
      name: 'daycare_teach_endorsement',
      component: () => import('@/views/daycare/attendanceTeach/endorsement/index'),
      meta: {
        showTab: true,
        title: '考勤'
      }
    },
    // 统计明细（日）
    {
      path: '/daycare_teach_statisticsDay',
      name: 'daycare_teach_statisticsDay',
      component: () => import('@/views/daycare/attendanceTeach/statisticsList/day'),
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 统计明细（月）
    {
      path: '/daycare_teach_statisticsMonth',
      name: 'daycare_teach_statisticsMonth',
      component: () => import('@/views/daycare/attendanceTeach/statisticsList/month'),
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 考勤详情
    {
      path: '/daycare_teach_attendanceDetail',
      name: 'daycare_teach_attendanceDetail',
      component: () => import('@/views/daycare/attendanceTeach/detail/index'),
      meta: {
        showTab: true,
        title: '考勤详情'
      }
    }
  ],
  daycare_attendanceCare: [
    // 早勤统计
    {
      path: '/daycare_attendanceCare',
      name: 'daycare_attendanceCare',
      component: () => import('@/views/daycare/attendanceCare/attendance/index'),
      // component: daycare_attendanceTeach,
      meta: {
        showTab: true,
        title: '考勤统计'
      }
    },
    // 补签
    {
      path: '/daycare_care_endorsement',
      name: 'daycare_care_endorsement',
      component: () => import('@/views/daycare/attendanceCare/endorsement/index'),
      meta: {
        showTab: true,
        title: '考勤'
      }
    },
    // 统计明细（日）
    {
      path: '/daycare_care_statisticsDay',
      name: 'daycare_care_statisticsDay',
      component: () => import('@/views/daycare/attendanceCare/statisticsList/day'),
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 统计明细（月）
    {
      path: '/daycare_care_statisticsMonth',
      name: 'daycare_care_statisticsMonth',
      component: () => import('@/views/daycare/attendanceCare/statisticsList/month'),
      meta: {
        showTab: true,
        title: '统计明细'
      }
    },
    // 考勤详情
    {
      path: '/daycare_care_attendanceDetail',
      name: 'daycare_care_attendanceDetail',
      component: () => import('@/views/daycare/attendanceCare/detail/index'),
      meta: {
        showTab: true,
        title: '考勤详情'
      }
    }
  ],
  /* -------------请假列表-------------*/
  daycare_leave: [
    //  请假列表
    {
      path: '/daycare_leave',
      name: 'daycare_leave',
      component: () => import('@/views/daycare/leave/leave/index'),
      meta: {
        showTab: true,
        title: '请假'
      }
    },
    // 请假详情
    {
      path: '/daycare_leaveDetail',
      name: 'daycare_leaveDetail',
      component: () => import('@/views/daycare/leave/detail/index'),
      meta: {
        showTab: true,
        title: '请假详情'
      }
    }
  ],
  /* -------------报餐-------------*/
  daycare_mealsRecord: [
    // 报餐记录
    {
      path: '/daycare_mealsRecord',
      name: 'daycare_mealsRecord',
      component: () => import('@/views/daycare/meals/mealsRecord/index'),
      meta: {
        showTab: true,
        title: '报餐记录'
        // fActive: 2
      }
    },
    // 添加报餐
    {
      path: '/add_mealsRecord',
      name: 'add_mealsRecord',
      component: () => import('@/views/daycare/meals/addMealsRecord/index'),
      meta: {
        showTab: true,
        title: '添加报餐'
      }
    },
    // 修改报餐
    {
      path: '/fix_mealsRecord',
      name: 'fix_mealsRecord',
      component: () => import('@/views/daycare/meals/fixMeals/index'),
      meta: {
        showTab: true,
        title: '修改报餐'
      }
    }
  ],
  /* -------------健康检查-------------*/
  daycare_bodyCheck: [
    //  检查列表
    {
      path: '/daycare_bodyCheck',
      name: 'daycare_bodyCheck',
      component: () => import('@/views/daycare/check/check/index'),
      meta: {
        showTab: true,
        title: '健康检查'
      }
    },
    // 检查页面
    {
      path: '/daycare_bodyCheckPage',
      name: 'daycare_bodyCheckPage',
      component: () => import('@/views/daycare/check/checkPage/index'),
      meta: {
        showTab: true,
        title: ''
      }
    },
    // 检查详情
    {
      path: '/daycare_bodyCheckDetail',
      name: 'daycare_bodyCheckDetail',
      component: () => import('@/views/daycare/check/detail/index'),
      meta: {
        showTab: true,
        title: ''
      }
    }
  ],
  /* -------------交代事宜-------------*/
  daycare_matterList: [
    {
      path: '/daycare_matterList',
      name: 'daycare_matterList',
      component: () => import('@/views/daycare/matterList/index'),
      meta: {
        showTab: true,
        title: '交代事宜'
      }
    },
    {
      path: '/daycare_matterDetail',
      name: 'daycare_matterDetail',
      component: () => import('@/views/daycare/matterList/matterDetail/index'),
      meta: {
        showTab: true,
        title: '交代详情'
      }
    }
  ],
  /* -------------早教点评-------------*/
  daycare_commentTeach: [
    {
      path: '/daycare_commentTeach',
      name: 'daycare_commentTeach',
      component: () => import('@/views/daycare/commentTeach/index'),
      meta: {
        showTab: false,
        title: '早教点评'
      }
    },
    {
      path: '/daycare_commentTeachDetail',
      name: 'daycare_commentTeachDetail',
      component: () => import('@/views/daycare/commentTeach/detail'),
      meta: {
        showTab: false,
        title: '早教点评'
      }
    },
    {
      path: '/daycare_commentTeachSetting',
      name: 'daycare_commentTeachSetting',
      component: () => import('@/views/daycare/commentTeach/setting'),
      meta: {
        showTab: false,
        title: '早教点评'
      }
    }
  ],
  /* -------------托育点评-------------*/
  daycare_commentCare: [
    {
      path: '/daycare_commentCare',
      name: 'daycare_commentCare',
      component: () => import('@/views/daycare/commentCare/index'),
      meta: {
        showTab: true,
        title: '托育点评'
      }
    },
    {
      path: '/daycare_commentCareDetail',
      name: 'daycare_commentCareDetail',
      component: () => import('@/views/daycare/commentCare/detail'),
      meta: {
        showTab: false,
        title: '托育点评'
      }
    },
    {
      path: '/daycare_commentCareSetting',
      name: '/daycare_commentCareSetting',
      component: () => import('@/views/daycare/commentCare/setting'),
      meta: {
        showTab: false,
        title: '托育点评'
      }
    }
  ],
  // 云监控
  daycare_monitorEquipment: [
    {
      path: '/daycare_monitorEquipment',
      name: 'daycare_monitorEquipment',
      component: () => import('@/views/daycare/monitorEquipment'),
      meta: {
        showTab: false,
        title: ''
      }
    },
    {
      path: '/daycare_monitorEquipment_read',
      name: 'daycare_monitorEquipment_read',
      component: () => import('@/views/daycare/monitorEquipment/video'),
      meta: {
        showTab: false,
        title: ''
      }
    }
  ],
  // 资料库
  fileCenter: [{
    path: '/fileCenter',
    name: 'fileCenter',
    component: () => import('@/views/daycare/fileCenter'),
    meta: {
      showTab: false,
      title: ''
    }
  }],
  // 周日程
  daycare_weekPlan: [{
    path: '/daycare_weekPlan',
    name: 'daycare_weekPlan',
    component: () => import('@/views/daycare/weekPlan/index'),
    meta: {
      showTab: false,
      title: ''
    }
  }],
  // 家园通知
  daycare_cmNoticeManage: [
    {
      path: '/daycare_cmNoticeManage',
      name: 'daycare_cmNoticeManage',
      component: () => import('@/views/daycare/notice'),
      meta: {
        showTab: false,
        title: ''
      }
    },
    {
      path: '/daycare_cmNoticeManage_datail',
      name: 'daycare_cmNoticeManage_datail',
      component: () => import('@/views/daycare/notice/detail'),
      meta: {
        showTab: false,
        title: ''
      }
    },
    {
      path: '/daycare_cmNoticeManage_read',
      name: 'daycare_cmNoticeManage_read',
      component: () => import('@/views/daycare/notice/read'),
      meta: {
        showTab: false,
        title: ''
      }
    },
    {
      path: '/daycare_cmNoticeManage_read_detail',
      name: 'daycare_cmNoticeManage_read_detail',
      component: () => import('@/views/daycare/notice/read_detail'),
      meta: {
        showTab: false,
        title: ''
      }
    }
  ],
  // 课程表
  daycare_courseTimeManage: [
    {
      path: '/daycare_courseTimeManage',
      name: 'daycare_courseTimeManage',
      component: () => import('@/views/daycare/courseTimeManage/index'),
      meta: {
        showTab: false,
        title: ''
      }
    },
    {
      path: '/daycare_courseTimeManage_detail',
      name: 'daycare_courseTimeManage_detail',
      component: () => import('@/views/daycare/courseTimeManage/detail'),
      meta: {
        showTab: false,
        title: ''
      }
    }
  ],
  /* -------------周食谱-------------*/
  daycare_recipesManage: [{
    path: '/daycare_recipesManage',
    name: 'daycare_recipesManage',
    component: () => import('@/views/daycare/recipeManage/index'),
    meta: {
      showTab: false,
      title: ''
    }
  }],
  // 在园日记
  daycare_dailyManage: [
    {
      path: '/daycare_dailyManage',
      name: 'daycare_dailyManage',
      component: () => import('@/views/daycare/dailyManage/index'),
      meta: {
        showTab: false,
        title: '在园日记'
      }
    },
    {
      path: '/daycare_dailyManageSetting',
      name: 'daycare_dailyManageSetting',
      component: () => import('@/views/daycare/dailyManage/setting'),
      meta: {
        showTab: false,
        title: '在园日记'
      }
    },
    {
      path: '/daycare_dailyManageDetail',
      name: 'daycare_dailyManageDetail',
      component: () => import('@/views/daycare/dailyManage/detail'),
      meta: {
        showTab: false,
        title: '在园日记'
      }
    },
    {
      path: '/daycare_dailyManageProject',
      name: 'daycare_dailyManageProject',
      component: () => import('@/views/daycare/dailyManage/project'),
      meta: {
        showTab: false,
        title: '在园日记'
      }
    }
  ],
  // 动态
  daycare_clazzPost: [
    {
      path: '/daycare_clazzPost',
      name: 'daycare_clazzPost',
      component: () => import('@/views/daycare/dynamics/index'),
      meta: {
        showTab: true,
        title: '动态'
      }
    },
    {
      path: '/daycare_postDynamic',
      name: 'daycare_postDynamic',
      component: () => import('@/views/daycare/dynamics/postDynamics/index'),
      meta: {
        showTab: true,
        title: '动态'
      }
    },
    {
      path: '/daycare_dynamicsDetail',
      name: 'daycare_dynamicsDetail',
      component: () => import('@/views/daycare/dynamics/detail/index'),
      meta: {
        showTab: false,
        title: '动态'
      }
    }
  ],
  daycare_Library: [
    {
      path: '/daycare_Library',
      name: 'daycare_Library',
      component: () => import('@/views/daycare/library/index'),
      meta: {
        showTab: true,
        title: '图书中心'
      }
    },
    {
      path: '/libraryStoreCount',
      name: 'libraryStoreCount',
      component: () => import('@/views/daycare/library/storeCount/index'),
      meta: {
        // showTab: true,
        title: '图书借阅'
      }
    },
    {
      path: '/libraryBorrow',
      name: 'libraryBorrow',
      component: () => import('@/views/daycare/library/borrow/index'),
      meta: {
        // showTab: true,
        title: '图书借阅'
      }
    },
    {
      path: '/libraryApplication',
      name: 'libraryApplication',
      component: () => import('@/views/daycare/library/application/index'),
      meta: {
        // showTab: true,
        title: '图书借阅'
      }
    },
    {
      path: '/libraryOverdue',
      name: 'libraryOverdue',
      component: () => import('@/views/daycare/library/overdue/index'),
      meta: {
        // showTab: true,
        title: '图书借阅'
      }
    },
    {
      path: '/libraryManage',
      name: 'libraryManage',
      component: () => import('@/views/daycare/library/manage/index'),
      meta: {
        // showTab: true,
        title: '图书借阅'
      }
    },
    {
      path: '/libraryBorrowRegister',
      name: 'libraryBorrowRegister',
      component: () => import('@/views/daycare/library/borrow/borrowRegister/index'),
      meta: {
        // showTab: true,
        title: '借阅申请'
      }
    },
    {
      path: '/libraryRenewal',
      name: 'libraryRenewal',
      component: () => import('@/views/daycare/library/borrow/libraryRenewal/index'),
      meta: {
        // showTab: true,
        title: '借阅申请'
      }
    }
  ]
}

export default daycare
