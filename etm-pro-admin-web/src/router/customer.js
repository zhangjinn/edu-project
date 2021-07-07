import Layout from '@/layout/index'

const customerDynamic = {
  // crm
  'customer_productCenter': () => import('@/views/customer/listSource/productCenter'),
  'customer_speechSource': () => import('@/views/customer/listSource/speechSource'),
  'customer_radarSearch': () => import('@/views/customer/radarSearch'),
  'customer_crashPortrayal': () => import('@/views/customer/aiCrash/crashPortrayal/index')
}
/**
 * 静态路由, 用于非中台配置的页面
 */
const customerConstant = [
  {
    path: '/customer',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'customer_productCenterSetting',
        name: 'customer_productCenterSetting',
        component: () => import('@/views/customer/settings/productCenterSetting'),
        meta: { title: '产品设置' }
      },
      {
        path: 'customer_speechContent',
        name: 'customer_speechContent',
        component: () => import('@/views/customer/listSource/speechSource/speechContent'),
        meta: { title: '话术内容' }
      },
      {
        path: 'customer_waitPortrayal',
        name: 'customer_waitPortrayal',
        component: () => import('@/views/customer/waitPortrayal/index'),
        meta: { title: '待画像批次' }
      },
      {
        path: 'customer_historyPortrayal',
        name: 'customer_historyPortrayal',
        component: () => import('@/views/customer/historyPortrayal/index'),
        meta: { title: '客户群画像历史' }
      },
      {
        path: 'customer_detailsPortrayal',
        name: 'customer_detailsPortrayal',
        component: () => import('@/views/customer/detailsPortrayal/index'),
        meta: { title: '客户群画像详情' }
      }
    ]
  }
]

export { customerDynamic, customerConstant }
