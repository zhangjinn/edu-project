import Layout from '@/layout/index'

const guardCareDynamic = {
  //  幼托一体化解决方案
  'guardcare_childManage': () => import('@/views/guardcare/childManage/childMessage/index'),
  'guardcare_earnestMoneyMangage': () => import('@/views/guardcare/orderManage/earnestMoneyMangage/index'),
  'guardcare_orderManage': () => import('@/views/guardcare/orderManage/charge/index'),
  'guardcare_gradeManage': () => import('@/views/guardcare/edu/gradeManage'),
  'guardcare_clazzManage': () => import('@/views/guardcare/edu/clazzManage'),
  'guardcare_roomManage': () => import('@/views/guardcare/edu/roomManage'),
  'guardcare_courseManage': () => import('@/views/guardcare/edu/courseManage'),
  'guardcare_scheduleManage': () => import('@/views/guardcare/edu/scheduleManage'),
  'guardcare_materialPriceManage': () => import('@/views/guardcare/edu/materialPriceManage'),
  'guardcare_incomeFlow': () => import('@/views/guardcare/financeManage/incomeFlow'),
  'guardcare_costFlow': () => import('@/views/guardcare/financeManage/costFlow'),
  'guardcare_attendanceSettlement': () => import('@/views/guardcare/financeManage/attendanceSettlement'),
  'guardcare_refundManage': () => import('@/views/guardcare/financeManage/refundManage'),
  'guardcare_cashFlow': () => import('@/views/guardcare/digitalReport/cashFlow'),
  'guardcare_attendance': () => import('@/views/guardcare/edu/attendance'),
  'guardcare_bodyCheck': () => import('@/views/guardcare/careManage/healthCheck'),
  'guardcare_attendanceStatistics': () => import('@/views/guardcare/digitalReport/attendanceStatistics'),
  'guardcare_dashboard': () => import('@/views/guardcare/dashboard'),
  'guardcare_recipesManage': () => import('@/views/guardcare/careManage/recipesManage'),
  'guardcare_cm': () => import('@/views/guardcare/edu/guardcare_cm'),
  'guardcare_monitorEquipment': () => import('@/views/guardcare/cloudDeviceManage/monitor'),
  'guardcare_videoOrder': () => import('@/views/guardcare/orderManage/cloudOrderMangage')
}
/**
 * 静态路由, 用于非中台配置的页面
 */
const guardCareConstant = [
  // guardcare应用设置
  {
    path: '/guardcareSettings',
    name: 'guardcareSettings',
    component: Layout,
    hidden: true,
    children: [{
      path: 'roomManageSetting',
      name: 'roomManageSetting',
      component: () => import('@/views/guardcare/settings/roomManageSetting/index'),
      meta: { title: '场所/教室设置' }
    },
    {
      path: 'materialPriceManageSetting',
      name: 'materialPriceManageSetting',
      component: () => import('@/views/guardcare/settings/materialPriceManageSetting/index'),
      meta: { title: '物品/费用设置' }
    },
    {
      path: 'scheduleManageSetting',
      name: 'scheduleManageSetting',
      component: () => import('@/views/guardcare/settings/scheduleManageSetting/index'),
      meta: { title: '课表设置' }
    },
    {
      path: 'attendanceSetting',
      name: 'attendanceSetting',
      component: () => import('@/views/guardcare/settings/attendanceSetting'),
      meta: { title: '请假设置' }
    },
    {
      path: 'healthCheckSetting',
      name: 'healthCheckSetting',
      component: () => import('@/views/guardcare/settings/healthCheckSetting'),
      meta: { title: '健康检查设置' }
    },
    {
      path: 'recipesManageSetting',
      name: 'recipesManageSetting',
      component: () => import('@/views/guardcare/settings/recipesManageSetting'),
      meta: { title: '食谱设置' }
    },
    // 幼托-幼儿管理-扫码入园登记
    {
      path: 'guardcare_register',
      name: 'guardcare_register',
      component: () => import('@/views/guardcare/childManage/childRegister'),
      meta: { title: '扫码入园登记' }
    },
    // 幼托-幼儿管理-导入批次管理
    {
      path: 'guardcare_childImportManage',
      name: 'guardcare_childImportManage',
      component: () => import('@/views/guardcare/childManage/importManage'),
      meta: { title: '导入批次管理' }
    },
    // 幼托-财务-收支流水应用设置
    {
      path: 'guardcare_incomeCostFlowSetting',
      name: 'guardcare_incomeCostFlowSetting',
      component: () => import('@/views/guardcare/settings/incomeCostFlowSetting'),
      meta: { title: '幼托财务设置' }
    },
    // 幼托-财务-考勤结算应用设置
    {
      path: 'guardcare_attendanceSettleSetting',
      name: 'guardcare_attendanceSettleSetting',
      component: () => import('@/views/guardcare/settings/attendanceSettleSetting'),
      meta: { title: '考勤结算设置' }
    },
    // 幼托-食谱编辑
    {
      path: 'guardcare_recipeEdit',
      name: 'guardcare_recipeEdit',
      component: () => import('@/views/guardcare/careManage/recipesManage/firstTable/edit'),
      meta: { title: '幼儿食谱' }
    },
    // 幼托-智能云监控设置
    {
      path: 'monitorManageSetting',
      name: 'monitorManageSetting',
      component: () => import('@/views/guardcare/settings/monitorManageSetting'),
      meta: { title: '智能云监控设置' }
    },
    // 智能云设备管理-智能云视频-班级授权
    {
      path: 'guardcare_monitorEquipment_clazzAuthorize',
      name: 'guardcare_monitorEquipment_clazzAuthorize',
      component: () => import('@/views/guardcare/cloudDeviceManage/monitor/clazzAuthorize'),
      meta: { title: '班级授权' }
    },
    // 智能云设备管理-智能云视频-员工授权
    {
      path: 'guardcare_monitorEquipment_staffAuthorize',
      name: 'guardcare_monitorEquipment_staffAuthorize',
      component: () => import('@/views/guardcare/cloudDeviceManage/monitor/staffAuthorize'),
      meta: { title: '员工授权' }
    }]
  }
]

export { guardCareDynamic, guardCareConstant }
