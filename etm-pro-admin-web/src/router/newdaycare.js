import Layout from '@/layout/index'

const newdayCareDynamic = {
  // 早托
  'newdaycare_childManage': () => import('@/views/newDaycare/childManage/myChild/index'),
  'newdaycare_courseManage': () => import('@/views/newDaycare/courseManage'),
  'newdaycare_smsCenter': () => import('@/views/newDaycare/smsCenter/index'),
  'newdaycare_callCenter': () => import('@/views/newDaycare/smsCenter/call'),
  'newdaycare_earnestMoneyMangage': () => import('@/views/newDaycare/contract/earnestMoney/index'),
  'newdaycare_teachContract': () => import('@/views/newDaycare/contract/teachContract/index'),
  'newdaycare_careContract': () => import('@/views/newDaycare/contract/careContract/index'),
  'newdaycare_roomManage': () => import('@/views/newDaycare/classes'),
  'newdaycare_childPool': () => import('@/views/newDaycare/childManage/childPool/index'),
  // 'newdaycare_materialPriceManage': () => import('@/views/daycare/materialPriceManage/views/index'),
  'newdaycare_priceTeach': () => import('@/views/newDaycare/priceTeach/views/index'),
  'newdaycare_attendanceTeach': () => import('@/views/newDaycare/attendanceTeach/index'),
  'newdaycare_attendanceCare': () => import('@/views/newDaycare/attendanceCare/index'),
  'newdaycare_incomeFlow': () => import('@/views/newDaycare/incomeFlow/index'),
  'newdaycare_cashFlow': () => import('@/views/newDaycare/statistics/cashFlow/index'),
  'newdaycare_sourceOfChildAnalysis': () => import('@/views/newDaycare/statistics/sourceOfChildAnalysis/index'),
  'newdaycare_salesmanAnalysis': () => import('@/views/newDaycare/statistics/salesmanAnalysis/index'),
  'newdaycare_usedCourse': () => import('@/views/newDaycare/statistics/usedCourse/index'),
  'newdaycare_usedCourseTeacher': () => import('@/views/newDaycare/statistics/usedCourseTeacher/index'),
  'newdaycare_teacherEffect': () => import('@/views/newDaycare/statistics/teacherEffect/index'),
  'newdaycare_attendanceStatistics': () => import('@/views/newDaycare/statistics/attendanceStatistics/index'),
  'newdaycare_costFlow': () => import('@/views/newDaycare/costFlow/index'),
  'newdaycare_courseTimeManageTeach': () => import('@/views/newDaycare/courseTimeManageTeach/index'),
  'newdaycare_bodyCheck': () => import('@/views/newDaycare/bodyCheck'),
  'newdaycare_mealsRecord': () => import('@/views/newDaycare/mealsRecord'),
  'newdaycare_dashboard': () => import('@/views/newDaycare/dashboard/index'),
  'newdaycare_courseTimeManageCare': () => import('@/views/newDaycare/courseTimeMangeCare/index'),
  'newdaycare_cm': () => import('@/views/newDaycare/homeManage/daycare_cm'),
  'newdaycare_marketAnalysis': () => import('@/views/newDaycare/statistics/marketAnalysis/index'),
  'newdaycare_salesAnalysis': () => import('@/views/newDaycare/statistics/salesAnalysis/index'),
  'newdaycare_recipesManage': () => import('@/views/newDaycare/recipesManage'),
  'newdaycare_videoOrder': () => import('@/views/newDaycare/cloudVideoOrder/index'),
  'newdaycare_monitorEquipment': () => import('@/views/newDaycare/listEquipment/monitorEquipment'),
  'newdaycare_cardAttendance': () => import('@/views/newDaycare/cardAttendance/index'),
  'newdaycare_vipCardManage': () => import('@/views/newDaycare/contract/card'),
  'newdaycare_cmNoticeManage': () => import('@/views/newDaycare/cmNoticeManage/index'),
  'newdaycare_clazzCircle': () => import('@/views/newDaycare/clazzCircle/index'),
  'newdaycare_bookManage': () => import('@/views/newDaycare/listLibrary/bookManage/index'),
  'newdaycare_lendManage': () => import('@/views/newDaycare/listLibrary/lendManage/index'),
  'newdaycare_lendApplication': () => import('@/views/newDaycare/listLibrary/lendApplication/index'),
  'newdaycare_customerList': () => import('@/views/newDaycare/customOrder/index'),
  'newdaycare_callingCard': () => import('@/views/newDaycare/digitalCard/index'),
  'newdaycare_enrollMinisite': () => import('@/views/newDaycare/enrollMinisite/index'),
  'newdaycare_dataCenter': () => import('@/views/newDaycare/dataCenter/index'),
  'newdaycare_enrollEvaluation': () => import('@/views/newDaycare/enrollEvaluation/index'),
  'newdaycare_auditionCare': () => import('@/views/newDaycare/freeListen/index'),
  'newdaycare_priceCare': () => import('@/views/newDaycare/priceCare/index'),
  'newdaycare_materialManage': () => import('@/views/newDaycare/materialManage/index'),
  'newdaycare_clazzTeach': () => import('@/views/newDaycare/classes/education/tabbs'),
  'newdaycare_clazzCare': () => import('@/views/newDaycare/clazzCare/index'),
  'newdaycare_packageCare': () => import('@/views/newDaycare/packageCare/index'),
  'newdaycare_clazzComment': () => import('@/views/newDaycare/clazzComment/index'),
  'newdaycare_bodyCheckGuard': () => import('@/views/newDaycare/bodyCheckGuard'),
  'newdaycare_matterList': () => import('@/views/newDaycare/matterList/index'),
  'newdaycare_recipesManageGuard': () => import('@/views/newDaycare/listCareGuard/recipesManage/index'),
  'newdaycare_clazzManage': () => import('@/views/newDaycare/listEduGuard/clazzManage/index'),
  'newdaycare_courseManageGuard': () => import('@/views/newDaycare/listEduGuard/courseManage/index'),
  'newdaycare_gradeManage': () => import('@/views/newDaycare/listEduGuard/gradeManage/index'),
  'newdaycare_scheduleManage': () => import('@/views/newDaycare/listEduGuard/scheduleManage/index'),
  'newdaycare_orderManage': () => import('@/views/newDaycare/orderManage/index'),
  'newdaycare_childManageGuard': () => import('@/views/newDaycare/childManageGuard/index'),
  'newdaycare_attendanceSettlement': () => import('@/views/newDaycare/attendanceSettlement/index'),
  'newdaycare_refundManage': () => import('@/views/newDaycare/refundManage/index'),
  'newdaycare_priceGuard': () => import('@/views/newDaycare/priceGuard/index'),
  'newdaycare_attendanceGuard': () => import('@/views/newDaycare/attendanceGuard/index'),
  'newdaycare_specialCourseStatisticsHead': () => import('@/views/newDaycare/statisticsHead/specialCourseStatisticsHead'),
  'newdaycare_specialCourseStatistics': () => import('@/views/newDaycare/statistics/specialCourseStatistics'),
  'newdaycare_cashFlowHead': () => import('@/views/newDaycare/statisticsHead/cashFlowHead'),
  'newdaycare_cashFlowSummaryHead': () => import('@/views/newDaycare/statisticsHead/cashFlowSummaryHead'),
  'newdaycare_settlementStatisticsHead': () => import('@/views/newDaycare/statisticsHead/settlementStatisticsHead'),
  'newdaycare_settlementSummaryHead': () => import('@/views/newDaycare/statisticsHead/settlementSummaryHead'),
  'newdaycare_dashBoardHead': () => import('@/views/newDaycare/dashBoardHead'),
  'newdaycare_feedBack': () => import('@/views/newDaycare/feedback'),
  'newdaycare_feedBackHead': () => import('@/views/newDaycare/feedBackHead'),
  'newdaycare_attendanceStatisticsGuardHead': () => import('@/views/newDaycare/attendanceStatisticsGuardHead'),
  'newdaycare_childDataHead': () => import('@/views/newDaycare/childDataHead/index'),
  'newdaycare_firmDataHead': () => import('@/views/newDaycare/firmDataHead/index'),
  'newdaycare_areaSetHead': () => import('@/views/newDaycare/areaSetHead/index'),
  'newdaycare_listChannelManage': () => import('@/views/newDaycare/listChannelManage/index'),
  'newdaycare_firmFileHead': () => import('@/views/newDaycare/firmFileHead/index'),
  'newdaycare_staffFileHead': () => import('@/views/newDaycare/listDataManage/staffFile/index'),
  'newdaycare_staffFile': () => import('@/views/newDaycare/listDataManage/staffFile/index'),
  'newdaycare_staffDataHead': () => import('@/views/newDaycare/staffDataHead/index'),
  'newdaycare_refundSummaryHead': () => import('@/views/newDaycare/refundSummaryHead/index'),
  'newdaycare_orderSummaryHead': () => import('@/views/newDaycare/orderSummaryHead/index'),
  'newdaycare_orderStatisticsHead': () => import('@/views/newDaycare/orderStatisticsHead/index'),
  'newdaycare_refundStatisticsHead': () => import('@/views/newDaycare/refundStatisticsHead/index'),
  'newdaycare_orderStatistics': () => import('@/views/newDaycare/orderStatistics/index'),
  'newdaycare_accountStatisticsHead': () => import('@/views/newDaycare/accountStatisticsHead/index'),
  'newdaycare_accountStatistics': () => import('@/views/newDaycare/accountStatistics/index')
}

/**
 * 静态路由, 用于非中台配置的页面
 */
const newdayCareConstant = [
  {
    id: 'newdaycare_list10',
    path: '/newdaycare_setting',
    component: Layout,
    name: 'newdaycare_setting',
    meta: { title: 'newdaycare_list4' },
    children: [
      {
        path: 'courseTimeMange_setting',
        name: 'courseTimeMange_setting',
        component: () => import('@/views/newDaycare/courseTimeMangeCare/setting/index'),
        meta: { title: '托育排课管理设置' }
      },
      {
        path: 'card_setting',
        name: 'card_setting',
        component: () => import('@/views/newDaycare/contract/card/timeSlot'),
        meta: { title: '会员卡类型' }
      },
      {
        path: 'scheduleManageSetting',
        name: 'scheduleManageSetting',
        component: () => import('@/views/newDaycare/listEduGuard/scheduleManageSetting/index'),
        meta: { title: '课表设置' }
      }
    ]
  },
  {
    id: 'newdaycare_list',
    path: '/newdaycare_list',
    component: Layout,
    name: 'newdaycare_list',
    meta: {
      title: 'newdaycare_list',
      icon: 'iconteam1'
    },
    children: [
      // 托育申请补贴流程
      {
        path: 'newdaycare_allowanceGuide',
        name: 'newdaycare_allowanceGuide',
        component: () => import('@/views/newDaycare/dashboard/contentGuide/allowance/index'),
        meta: { title: '托育申请补贴流程' }
      },
      // 高效获客技巧
      {
        path: 'newdaycare_skillGuide',
        name: 'newdaycare_skillGuide',
        component: () => import('@/views/newDaycare/dashboard/contentGuide/skill/index'),
        meta: { title: '高效获客技巧' }
      },
      // 托幼营养食谱标准
      {
        path: 'newdaycare_recipeGuide',
        name: 'newdaycare_recipeGuide',
        component: () => import('@/views/newDaycare/dashboard/contentGuide/recipe/index'),
        meta: { title: '托幼营养食谱标准' }
      },
      // 2020年托育新政
      {
        path: 'newdaycare_policyGuide',
        name: 'newdaycare_policyGuide',
        component: () => import('@/views/newDaycare/dashboard/contentGuide/policy/index'),
        meta: { title: '2020年托育新政' }
      }
    ]
  },
  {
    id: 'newdaycare_recipes',
    path: '/newdaycare_recipes',
    component: Layout,
    name: 'newdaycare_recipes',
    meta: { title: 'newdaycare_recipes' },
    children: [
      {
        path: 'recipeEdit',
        name: 'recipeEdit',
        component: () => import('@/views/newDaycare/recipesManage/firstTable/edit'),
        meta: { title: '编辑食谱' }
      },
      {
        path: 'recipeSetting',
        name: 'recipeSetting',
        component: () => import('@/views/newDaycare/recipesManage/setting/index'),
        meta: { title: '食谱配置' }
      }
    ]
  },
  {
    id: 'newdaycare_recipesGuard',
    path: '/newdaycare_recipesGuard',
    component: Layout,
    name: 'newdaycare_recipesGuard',
    meta: { title: 'newdaycare_recipesGuard' },
    children: [
      {
        path: 'recipesGuardEdit',
        name: 'recipesGuardEdit',
        component: () => import('@/views/newDaycare/listCareGuard/recipesManage/firstTable/edit'),
        meta: { title: '编辑幼儿园食谱' }
      },
      {
        path: 'recipesGuardSetting',
        name: 'recipesGuardSetting',
        component: () => import('@/views/newDaycare/listCareGuard/recipesManage/recipesManageSetting'),
        meta: { title: '幼儿园食谱配置' }
      }
    ]
  },
  {
    id: 'newdaycare_videoEquipment',
    path: '/newdaycare_videoEquipment',
    component: Layout,
    name: 'newdaycare_videoEquipment',
    meta: { title: 'newdaycare_videoEquipment' },
    children: [
      {
        path: 'classroomAuthorize',
        name: 'classroomAuthorize',
        component: () => import('@/views/newDaycare/listEquipment/monitorEquipment/classroomAuthorize'),
        meta: { title: '托育班级授权' }
      },
      {
        path: 'childClassroomAuthorize',
        name: 'childClassroomAuthorize',
        component: () => import('@/views/newDaycare/listEquipment/monitorEquipment/childClassroomAuthorize'),
        meta: { title: '幼儿园班级授权' }
      },
      {
        path: 'workerAuthorize',
        name: 'workerAuthorize',
        component: () => import('@/views/newDaycare/listEquipment/monitorEquipment/workerAuthorize'),
        meta: { title: '教职工授权' }
      },
      {
        path: 'videoEquipmentSetting',
        name: 'videoEquipmentSetting',
        component: () => import('@/views/newDaycare/listEquipment/monitorEquipment/setting/index'),
        meta: { title: '智能云视频' }
      }
    ]
  },
  {
    id: 'newdaycare_dataCenterList',
    path: '/newdaycare_dataCenterList',
    component: Layout,
    name: 'newdaycare_dataCenterList',
    meta: { title: 'newdaycare_dataCenterList' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/newDaycare/dataCenter/dataList'),
        meta: { title: '总部数据' }
      }
    ]
  },
  {
    id: 'newdaycare_enrollMiniSiteManagement',
    path: '/newdaycare_enrollMiniSiteManagement',
    component: Layout,
    name: 'newdaycare_enrollMiniSiteManagement',
    meta: { title: 'newdaycare_enrollMiniSiteManagement' },
    children: [
      {
        path: 'h5Data',
        name: 'h5Data',
        component: () => import('@/views/newDaycare/enrollMinisite/h5Data'),
        meta: { title: '表单汇总' }
      },
      {
        path: 'h2Manage',
        name: 'h2Manage',
        component: () => import('@/views/newDaycare/enrollMinisite/h2Manage'),
        meta: { title: '活动管理' }
      }
    ]
  },
  {
    id: 'newdaycare_childManageGuardcare',
    path: '/newdaycare_childManageGuardcare',
    component: Layout,
    name: 'newdaycare_childManageGuardcare',
    meta: { title: 'newdaycare_childManageGuardcare' },
    children: [
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/newDaycare/childManageGuard/register'),
        meta: { title: '扫码入园登记' }
      },
      {
        path: 'importManage',
        name: 'importManage',
        component: () => import('@/views/newDaycare/childManageGuard/import'),
        meta: { title: '导入批次管理' }
      }
    ]
  },
  {
    id: 'newdaycare_attendanceSettle',
    path: '/newdaycare_attendanceSettle',
    component: Layout,
    name: 'newdaycare_attendanceSettle',
    meta: { title: 'newdaycare_attendanceSettle' },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/newDaycare/attendanceSettlement/setting'),
        meta: { title: '考勤结算设置' }
      }
    ]
  },
  {
    id: 'newdaycare_priceGuardcare',
    path: '/newdaycare_priceGuardcare',
    component: Layout,
    name: 'newdaycare_priceGuardcare',
    meta: { title: 'newdaycare_priceGuardcare' },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/newDaycare/priceGuard/setting'),
        meta: { title: '费用设置' }
      }
    ]
  },
  {
    id: 'newdaycare_attendanceGuardcare',
    path: '/newdaycare_attendanceGuardcare',
    component: Layout,
    name: 'newdaycare_attendanceGuardcare',
    meta: { title: 'newdaycare_attendanceGuardcare' },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/newDaycare/attendanceGuard/setting'),
        meta: { title: '请假设置' }
      }
    ]
  }
  // {
  //   id: 'newdaycare_listEduGuard',
  //   path: '/newdaycare_listEduGuard',
  //   component: Layout,
  //   name: 'newdaycare_listEduGuard',
  //   meta: { title: 'newdaycare_listEduGuard' },
  //   children: [
  //     {
  //       path: 'newdaycare_gradeManage',
  //       name: 'newdaycare_gradeManage',
  //       component: () => import('@/views/newDaycare/listEduGuard/gradeManage/index'),
  //       meta: { title: '年级管理' }
  //     },
  //     {
  //       path: 'newdaycare_clazzManage',
  //       name: 'newdaycare_clazzManage',
  //       component: () => import('@/views/newDaycare/listEduGuard/clazzManage/index'),
  //       meta: { title: '班级管理' }
  //     },
  //     {
  //       path: 'newdaycare_courseManageGuard',
  //       name: 'newdaycare_courseManageGuard',
  //       component: () => import('@/views/newDaycare/listEduGuard/courseManage/index'),
  //       meta: { title: '课程管理' }
  //     },
  //     {
  //       path: 'newdaycare_scheduleManage',
  //       name: 'newdaycare_scheduleManage',
  //       component: () => import('@/views/newDaycare/listEduGuard/scheduleManage/index'),
  //       meta: { title: '课表管理' }
  //     }
  //   ]
  // }
]

export { newdayCareDynamic, newdayCareConstant }
