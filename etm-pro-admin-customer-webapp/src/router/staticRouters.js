export default [
  {
    path: '/customer_productCenterSetting',
    name: 'customer_productCenterSetting',
    component: () => import('@/views/productCenterSetting'),
    meta: { title: '产品设置' }
  }, {
    path: '/customer_speechContent',
    name: 'customer_speechContent',
    component: () => import('@/views/listSource/speechSource/speechContent'),
    meta: { title: '话术内容' }
  },
  {
    path: '/customer_waitPortrayal',
    name: 'customer_waitPortrayal',
    component: () => import('@/views/waitPortrayal/index'),
    meta: { title: '待画像客户' }
  },
  {
    path: '/customer_historyPortrayal',
    name: 'customer_historyPortrayal',
    component: () => import('@/views/historyPortrayal/index'),
    meta: { title: '历史画像客户' }
  },
  {
    path: '/customer_detailsPortrayal',
    name: 'customer_detailsPortrayal',
    component: () => import('@/views/detailsPortrayal/index'),
    meta: { title: '客户画像详情' }
  },
  {
    path: '/customer_settings',
    name: 'customer_settings',
    component: () => import('@/views/customerSetting/index'),
    meta: { title: '应用设置' }
  },
  {
    path: '/customer_smsCenterSetting',
    name: 'customer_smsCenterSetting',
    component: () => import('@/views/smsCenter/msgSetting/index'),
    meta: { title: '云短信设置' }
  },
  {
    path: '/customer_batch',
    name: 'customer_batch',
    component: () => import('@/views/listCustomer/batch'),
    meta: { title: '批次记录' }
  }

]
