import Layout from '@/layout/index'

const dayCareDynamic = {
  // 早托
  'daycare_childManage': () => import('@/views/daycare/childManage/myChild/index'),
  'daycare_courseManage': () => import('@/views/daycare/courseManage'),
  'daycare_smsCenter': () => import('@/views/daycare/smsCenter/index'),
  'daycare_callCenter': () => import('@/views/daycare/smsCenter/call'),
  'daycare_earnestMoneyMangage': () => import('@/views/daycare/contract/earnestMoney/index'),
  'daycare_teachContract': () => import('@/views/daycare/contract/teachContract/index'),
  'daycare_careContract': () => import('@/views/daycare/contract/careContract/index'),
  'daycare_roomManage': () => import('@/views/daycare/classes'),
  'daycare_childPool': () => import('@/views/daycare/childManage/childPool/index'),
  'daycare_materialPriceManage': () => import('@/views/daycare/materialPriceManage/views/index'),
  // 'daycare_priceTeach': () => import('@/views/daycare/priceTeach/views/index'),
  'daycare_attendanceTeach': () => import('@/views/daycare/attendanceTeach/index'),
  'daycare_attendanceCare': () => import('@/views/daycare/attendanceCare/index'),
  'daycare_incomeFlow': () => import('@/views/daycare/incomeFlow/index'),
  'daycare_cashFlow': () => import('@/views/daycare/statistics/cashFlow/index'),
  'daycare_sourceOfChildAnalysis': () => import('@/views/daycare/statistics/sourceOfChildAnalysis/index'),
  'daycare_salesmanAnalysis': () => import('@/views/daycare/statistics/salesmanAnalysis/index'),
  'daycare_usedCourse': () => import('@/views/daycare/statistics/usedCourse/index'),
  'daycare_usedCourseTeacher': () => import('@/views/daycare/statistics/usedCourseTeacher/index'),
  'daycare_teacherEffect': () => import('@/views/daycare/statistics/teacherEffect/index'),
  'daycare_attendanceStatistics': () => import('@/views/daycare/statistics/attendanceStatistics/index'),
  'daycare_costFlow': () => import('@/views/daycare/costFlow/index'),
  'daycare_courseTimeManageTeach': () => import('@/views/daycare/courseTimeManageTeach/index'),
  'daycare_bodyCheck': () => import('@/views/daycare/bodyCheck'),
  'daycare_mealsRecord': () => import('@/views/daycare/mealsRecord'),
  'daycare_dashboard': () => import('@/views/daycare/dashboard/index'),
  'daycare_courseTimeManageCare': () => import('@/views/daycare/courseTimeMangeCare/index'),
  'daycare_cm': () => import('@/views/daycare/homeManage/daycare_cm'),
  'daycare_marketAnalysis': () => import('@/views/daycare/statistics/marketAnalysis/index'),
  'daycare_salesAnalysis': () => import('@/views/daycare/statistics/salesAnalysis/index'),
  'daycare_recipesManage': () => import('@/views/daycare/recipesManage'),
  'daycare_videoOrder': () => import('@/views/daycare/cloudVideoOrder/index'),
  'daycare_monitorEquipment': () => import('@/views/daycare/listEquipment/monitorEquipment'),
  'daycare_cardAttendance': () => import('@/views/daycare/cardAttendance/index'),
  'daycare_vipCardManage': () => import('@/views/daycare/contract/card'),
  'daycare_cmNoticeManage': () => import('@/views/daycare/cmNoticeManage/index'),
  'daycare_clazzCircle': () => import('@/views/daycare/clazzCircle/index'),
  'daycare_bookManage': () => import('@/views/daycare/listLibrary/bookManage/index'),
  'daycare_lendManage': () => import('@/views/daycare/listLibrary/lendManage/index'),
  'daycare_lendApplication': () => import('@/views/daycare/listLibrary/lendApplication/index'),
  'daycare_customerList': () => import('@/views/daycare/customOrder/index'),
  'daycare_callingCard': () => import('@/views/daycare/digitalCard/index'),
  'daycare_enrollMinisite': () => import('@/views/daycare/enrollMinisite/index'),
  'daycare_dataCenter': () => import('@/views/daycare/dataCenter/index'),
  'daycare_enrollEvaluation': () => import('@/views/daycare/enrollEvaluation/index')
  // 'daycare_auditionCare': () => import('@/views/daycare/freeListen/index'),
  // 'daycare_priceCare': () => import('@/views/daycare/priceCare/index'),
  // 'daycare_materialManage': () => import('@/views/daycare/materialManage/index'),
  // 'daycare_clazzTeach': () => import('@/views/daycare/classes/education/tabbs'),
  // 'daycare_clazzCare': () => import('@/views/daycare/clazzCare/index'),
  // 'daycare_packageCare': () => import('@/views/daycare/packageCare/index')
}

/**
 * 静态路由, 用于非中台配置的页面
 */
const dayCareConstant = [
  {
    id: 'daycare_list10',
    path: '/setting',
    component: Layout,
    name: 'setting',
    meta: { title: 'daycare_list4' },
    children: [
      {
        path: 'courseTimeMange_setting',
        name: 'courseTimeMange_setting',
        component: () => import('@/views/daycare/courseTimeMangeCare/setting/index'),
        meta: { title: '托育排课管理设置' }
      },
      {
        path: 'card_setting',
        name: 'card_setting',
        component: () => import('@/views/daycare/contract/card/timeSlot'),
        meta: { title: '会员卡类型' }
      }
    ]
  },
  {
    id: 'daycare_list',
    path: '/daycare_list',
    component: Layout,
    name: 'daycare_list',
    meta: {
      title: 'daycare_list',
      icon: 'iconteam1'
    },
    children: [
      // 托育申请补贴流程
      {
        path: 'daycare_allowanceGuide',
        name: 'daycare_allowanceGuide',
        component: () => import('@/views/daycare/dashboard/contentGuide/allowance/index'),
        meta: { title: '托育申请补贴流程' }
      },
      // 高效获客技巧
      {
        path: 'daycare_skillGuide',
        name: 'daycare_skillGuide',
        component: () => import('@/views/daycare/dashboard/contentGuide/skill/index'),
        meta: { title: '高效获客技巧' }
      },
      // 托幼营养食谱标准
      {
        path: 'daycare_recipeGuide',
        name: 'daycare_recipeGuide',
        component: () => import('@/views/daycare/dashboard/contentGuide/recipe/index'),
        meta: { title: '托幼营养食谱标准' }
      },
      // 2020年托育新政
      {
        path: 'daycare_policyGuide',
        name: 'daycare_policyGuide',
        component: () => import('@/views/daycare/dashboard/contentGuide/policy/index'),
        meta: { title: '2020年托育新政' }
      }
    ]
  },
  {
    id: 'daycare_recipes',
    path: '/daycare_recipes',
    component: Layout,
    name: 'daycare_recipes',
    meta: { title: 'daycare_recipes' },
    children: [
      {
        path: 'recipeEdit',
        name: 'recipeEdit',
        component: () => import('@/views/daycare/recipesManage/firstTable/edit'),
        meta: { title: '编辑食谱' }
      },
      {
        path: 'recipeSetting',
        name: 'recipeSetting',
        component: () => import('@/views/daycare/recipesManage/setting/index'),
        meta: { title: '食谱配置' }
      }
    ]
  },
  {
    id: 'daycare_videoEquipment',
    path: '/daycare_videoEquipment',
    component: Layout,
    name: 'daycare_videoEquipment',
    meta: { title: 'daycare_videoEquipment' },
    children: [
      {
        path: 'classroomAuthorize',
        name: 'classroomAuthorize',
        component: () => import('@/views/daycare/listEquipment/monitorEquipment/classroomAuthorize'),
        meta: { title: '班级授权' }
      },
      {
        path: 'workerAuthorize',
        name: 'workerAuthorize',
        component: () => import('@/views/daycare/listEquipment/monitorEquipment/workerAuthorize'),
        meta: { title: '教职工授权' }
      },
      {
        path: 'videoEquipmentSetting',
        name: 'videoEquipmentSetting',
        component: () => import('@/views/daycare/listEquipment/monitorEquipment/setting/index'),
        meta: { title: '智能云视频' }
      }
    ]
  },
  {
    id: 'daycare_dataCenterList',
    path: '/daycare_dataCenterList',
    component: Layout,
    name: 'daycare_dataCenterList',
    meta: { title: 'daycare_dataCenterList' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/daycare/dataCenter/dataList'),
        meta: { title: '总部数据' }
      }
    ]
  },
  {
    id: 'daycare_enrollMiniSiteManagement',
    path: '/daycare_enrollMiniSiteManagement',
    component: Layout,
    name: 'daycare_enrollMiniSiteManagement',
    meta: { title: 'daycare_enrollMiniSiteManagement' },
    children: [
      {
        path: 'h5Data',
        name: 'h5Data',
        component: () => import('@/views/daycare/enrollMinisite/h5Data'),
        meta: { title: '表单汇总' }
      },
      {
        path: 'h2Manage',
        name: 'h2Manage',
        component: () => import('@/views/daycare/enrollMinisite/h2Manage'),
        meta: { title: '活动管理' }
      }
    ]
  }
]

export { dayCareDynamic, dayCareConstant }
