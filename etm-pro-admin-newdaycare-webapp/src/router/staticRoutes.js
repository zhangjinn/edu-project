export default [
  {
    path: '/newdaycare_smsCenterSetting',
    name: 'newdaycare_smsCenterCareSetting',
    component: () => import(/* webpackChunkName: "newdaycare_smsCenterCareSetting" */ '@/views/newDaycare/smsCenter/msgSetting/index'),
    meta: { title: '云短信设置' }
  },
  {
    path: '/newdaycare_childcareSetting',
    name: 'newdaycare_childcareSetting',
    component: () => import(/* webpackChunkName: "newdaycare_childcareSetting" */ '@/views/newDaycare/childManage/settings'),
    meta: { title: '学员管理设置' }
  },
  {
    path: '/newdaycare_courseManageSetting',
    name: 'newdaycare_courseManageSetting',
    component: () => import(/* webpackChunkName: "newdaycare_courseManageSetting" */ '@/views/newDaycare/courseManage/settings'),
    meta: { title: '课程/套餐管理设置' }
  },
  {
    path: '/newdaycare_clazzCareSetting',
    name: 'newdaycare_clazzCareSetting',
    component: () => import(/* webpackChunkName: "newdaycare_clazzCareSetting" */ '@/views/newDaycare/clazzCare/settings'),
    meta: { title: '托育班级管理设置' }
  },
  {
    id: 'newdaycare_courseTimeManageSetting',
    path: '/newdaycare_courseTimeManageSetting',
    component: () => import(/* webpackChunkName: "newdaycare_courseTimeManageSetting" */ '@/views/newDaycare/courseTimeManageTeach/settings/courseManagesSetting/index'),
    meta: { title: '排课设置' }
  },
  {
    path: '/newdaycare_staffSetting',
    name: 'newdaycare_staffSetting',
    component: () => import(/* webpackChunkName: "newdaycare_staffSetting" */ '@/views/newDaycare/listDataManage/staffFile/setting/index'),
    meta: { title: '学员管理设置' }
  },
  {
    name: '/newdaycare_smsCenter',
    path: 'newdaycare_smsCenter',
    component: () => import(/* webpackChunkName: "newdaycare_smsCenter" */ '@/views/newDaycare/smsCenter/tpl'),
    meta: { title: '模板管理' }
  },
  {
    path: '/newdaycare_importBatch',
    name: 'newdaycare_importBatch',
    component: () => import(/* webpackChunkName: "newdaycare_importBatch" */ '@/views/newDaycare/importBatch/views/index'),
    meta: { title: '导入批次管理' }
  },
  {
    path: '/newdaycare_assignBatch',
    name: 'newdaycare_assignBatch',
    component: () => import(/* webpackChunkName: "newdaycare_assignBatch" */ '@/views/newDaycare/assignBatch/views/index'),
    meta: { title: '分配批次管理' }
  },
  {
    path: '/newdaycare_classRoom',
    name: 'newdaycare_classRoom',
    component: () => import(/* webpackChunkName: "newdaycare_classRoom" */ '@/views/newDaycare/classRoom/views/index'),
    meta: { title: '教室' }
  },
  {
    path: '/newdaycare_materialPriceManagesSetting',
    name: 'newdaycare_materialPriceManagesSetting',
    component: () => import(/* webpackChunkName: "newdaycare_materialPriceManagesSetting" */ '@/views/newDaycare/priceTeach/views/setting/index'),
    meta: { title: '物品设置' }
  },
  {
    path: '/newdaycare_attendanceTeachSetting',
    name: 'newdaycare_attendanceTeachSetting',
    component: () => import(/* webpackChunkName: "newdaycare_attendanceTeachSetting" */ '@/views/newDaycare/attendanceTeach/setting/index'),
    meta: { title: '早教请假设置' }
  },
  {
    path: '/newdaycare_attendanceCareSetting',
    name: 'newdaycare_attendanceCareSetting',
    component: () => import(/* webpackChunkName: "newdaycare_attendanceCareSetting" */ '@/views/newDaycare/attendanceCare/setting/index'),
    meta: { title: '托育请假设置' }
  },
  {
    path: '/newdaycare_incomeFlowSetting',
    name: 'newdaycare_incomeFlowSetting',
    component: () => import(/* webpackChunkName: "newdaycare_incomeFlowSetting" */ '@/views/newDaycare/incomeFlow/settings'),
    meta: { title: '早托财务设置' }
  },
  {
    path: '/newdaycare_bodyCheckSetting',
    name: 'newdaycare_bodyCheckSetting',
    component: () => import(/* webpackChunkName: "newdaycare_bodyCheckSetting" */ '@/views/newDaycare/bodyCheck/setting/index'),
    meta: { title: '检查设置' }
  },
  {
    path: '/newdaycare_bodyCheckGuardSetting',
    name: 'newdaycare_bodyCheckGuardSetting',
    component: () => import(/* webpackChunkName: "newdaycare_bodyCheckGuardSetting" */ '@/views/newDaycare/bodyCheckGuard/setting'),
    meta: { title: '幼儿园检查设置' }
  },
  {
    path: '/newdaycare_mealsRecordSetting',
    name: 'newdaycare_mealsRecordSetting',
    component: () => import(/* webpackChunkName: "newdaycare_mealsRecordSetting" */ '@/views/newDaycare/mealsRecord/settings'),
    meta: { title: '报餐设置' }
  },
  {
    path: '/newdaycare_addNotification',
    name: 'newdaycare_addNotification',
    component: () => import(/* webpackChunkName: "newdaycare_addNotification" */ '@/views/newDaycare/cmNoticeManage/addNotification/index'),
    meta: { title: '发布/编辑通知' }
  },
  {
    path: '/newdaycare_bookManageSetting',
    name: 'newdaycare_bookManageSetting',
    component: () => import(/* webpackChunkName: "newdaycare_bookManageSetting" */ '@/views/newDaycare/listLibrary/bookManage/setting/index'),
    meta: { title: '书籍管理/分类设置' }
  },
  {
    path: '/cm_setting',
    name: 'cm_setting',
    component: () => import(/* webpackChunkName: "cm_setting" */ '@/views/newDaycare/homeManage/daycare_cm'),
    meta: { title: '家长端设置' }
  },
  {
    path: '/channelSettings',
    name: 'channelSettings',
    component: () => import(/* webpackChunkName: "channelSettings" */ '@/views/newDaycare/listChannelManage/settings/index'),
    meta: { title: '渠道类型设置' }
  },
  {
    path: '/courseTimeMange_setting',
    name: 'courseTimeMange_setting',
    component: () => import(/* webpackChunkName: "courseTimeMange_setting" */ '@/views/newDaycare/courseTimeMangeCare/setting/index'),
    meta: { title: '托育排课管理设置' }
  },
  {
    path: '/card_setting',
    name: 'card_setting',
    component: () => import(/* webpackChunkName: "card_setting" */ '@/views/newDaycare/contract/card/timeSlot'),
    meta: { title: '会员卡类型' }
  },
  {
    path: '/scheduleManageSetting',
    name: 'scheduleManageSetting',
    component: () => import(/* webpackChunkName: "scheduleManageSetting" */ '@/views/newDaycare/listEduGuard/scheduleManageSetting/index'),
    meta: { title: '课表设置' }
  },
  // {
  //   path: '/newdaycare_allowanceGuide',
  //   name: 'newdaycare_allowanceGuide',
  //   component: () => import(/* webpackChunkName: "newdaycare_allowanceGuide" */ '@/views/newDaycare/dashboard/contentGuide/allowance/index'),
  //   meta: { title: '托育申请补贴流程' }
  // },
  // // 高效获客技巧
  // {
  //   path: '/newdaycare_skillGuide',
  //   name: 'newdaycare_skillGuide',
  //   component: () => import(/* webpackChunkName: "newdaycare_skillGuide" */ '@/views/newDaycare/dashboard/contentGuide/skill/index'),
  //   meta: { title: '高效获客技巧' }
  // },
  // // 托幼营养食谱标准
  // {
  //   path: '/newdaycare_recipeGuide',
  //   name: 'newdaycare_recipeGuide',
  //   component: () => import(/* webpackChunkName: "newdaycare_recipeGuide" */ '@/views/newDaycare/dashboard/contentGuide/recipe/index'),
  //   meta: { title: '托幼营养食谱标准' }
  // },
  // // 2020年托育新政
  // {
  //   path: '/newdaycare_policyGuide',
  //   name: 'newdaycare_policyGuide',
  //   component: () => import(/* webpackChunkName: "newdaycare_policyGuide" */ '@/views/newDaycare/dashboard/contentGuide/policy/index'),
  //   meta: { title: '2020年托育新政' }
  // },
  {
    path: '/recipeEdit',
    name: 'recipeEdit',
    component: () => import(/* webpackChunkName: "recipeEdit" */ '@/views/newDaycare/recipesManage/firstTable/edit'),
    meta: { title: '编辑食谱' }
  },
  {
    path: '/recipeSetting',
    name: 'recipeSetting',
    component: () => import(/* webpackChunkName: "recipeSetting" */ '@/views/newDaycare/recipesManage/setting/index'),
    meta: { title: '食谱配置' }
  },
  {
    path: '/recipesGuardEdit',
    name: 'recipesGuardEdit',
    component: () => import(/* webpackChunkName: "recipesGuardEdit" */ '@/views/newDaycare/listCareGuard/recipesManage/firstTable/edit'),
    meta: { title: '编辑幼儿园食谱' }
  },
  {
    path: '/recipesGuardSetting',
    name: 'recipesGuardSetting',
    component: () => import(/* webpackChunkName: "recipesGuardSetting" */ '@/views/newDaycare/listCareGuard/recipesManage/recipesManageSetting'),
    meta: { title: '幼儿园食谱配置' }
  },
  {
    path: '/classroomAuthorize',
    name: 'classroomAuthorize',
    component: () => import(/* webpackChunkName: "classroomAuthorize" */ '@/views/newDaycare/listEquipment/monitorEquipment/classroomAuthorize'),
    meta: { title: '托育班级授权' }
  },
  {
    path: '/childClassroomAuthorize',
    name: 'childClassroomAuthorize',
    component: () => import(/* webpackChunkName: "childClassroomAuthorize" */ '@/views/newDaycare/listEquipment/monitorEquipment/childClassroomAuthorize'),
    meta: { title: '幼儿园班级授权' }
  },
  {
    path: '/workerAuthorize',
    name: 'workerAuthorize',
    component: () => import(/* webpackChunkName: "workerAuthorize" */ '@/views/newDaycare/listEquipment/monitorEquipment/workerAuthorize'),
    meta: { title: '教职工授权' }
  },
  {
    path: '/videoEquipmentSetting',
    name: 'videoEquipmentSetting',
    component: () => import(/* webpackChunkName: "videoEquipmentSetting" */ '@/views/newDaycare/listEquipment/monitorEquipment/setting/index'),
    meta: { title: '智能云视频' }
  },
  {
    path: '/newdaycare_dataCenterList_list',
    name: 'newdaycare_dataCenterList_list',
    component: () => import(/* webpackChunkName: "newdaycare_dataCenterList_list" */ '@/views/newDaycare/dataCenter/dataList'),
    meta: { title: '总部数据' }
  },
  {
    path: '/newdaycare_enrollMiniSiteManagement_h5Data',
    name: 'newdaycare_enrollMiniSiteManagement_h5Data',
    component: () => import(/* webpackChunkName: "newdaycare_enrollMiniSiteManagement_h5Data" */ '@/views/newDaycare/enrollMinisite/h5Data'),
    meta: { title: '表单汇总' }
  },
  {
    path: 'newdaycare_enrollMiniSiteManagement_h2Manage',
    name: 'newdaycare_enrollMiniSiteManagement_h2Manage',
    component: () => import(/* webpackChunkName: "newdaycare_enrollMiniSiteManagement_h2Manage" */ '@/views/newDaycare/enrollMinisite/h2Manage'),
    meta: { title: '活动管理' }
  },
  {
    path: '/newdaycare_childManageGuardcare_register',
    name: 'newdaycare_childManageGuardcare_register',
    component: () => import(/* webpackChunkName: "newdaycare_childManageGuardcare_register" */ '@/views/newDaycare/childManageGuard/register'),
    meta: { title: '扫码入园登记' }
  },
  {
    path: '/newdaycare_childManageGuardcare_importManage',
    name: 'newdaycare_childManageGuardcare_importManage',
    component: () => import(/* webpackChunkName: "newdaycare_childManageGuardcare_importManage" */ '@/views/newDaycare/childManageGuard/import'),
    meta: { title: '导入批次管理' }
  },
  {
    path: '/newdaycare_attendanceSettle_setting',
    name: 'newdaycare_attendanceSettle_setting',
    component: () => import(/* webpackChunkName: "newdaycare_attendanceSettle_setting" */ '@/views/newDaycare/attendanceSettlement/setting'),
    meta: { title: '考勤结算设置' }
  },
  {
    path: '/newdaycare_priceGuardcare_setting',
    name: 'newdaycare_priceGuardcare_setting',
    component: () => import(/* webpackChunkName: "newdaycare_priceGuardcare_setting" */ '@/views/newDaycare/priceGuard/setting'),
    meta: { title: '费用设置' }
  },
  {
    path: '/newdaycare_attendanceGuardcare_setting',
    name: 'newdaycare_attendanceGuardcare_setting',
    component: () => import(/* webpackChunkName: "newdaycare_attendanceGuardcare_setting" */ '@/views/newDaycare/attendanceGuard/setting'),
    meta: { title: '请假设置' }
  },
  {
    path: '/ewdaycare_dietManagement_editMyRecipes',
    name: 'ewdaycare_dietManagement_editMyRecipes',
    component: () => import(/* webpackChunkName: "ewdaycare_dietManagement_editMyRecipes" */ '@/views/newDaycare/dietManagement/components/myRecipes/editRecipes'),
    meta: { title: '编辑食谱' }
  }
]
