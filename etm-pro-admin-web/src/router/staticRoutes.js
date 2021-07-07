export default [
  {
    path: '/static',
    name: 'static',
    component: () => import('@/layout/index'),
    children: [
      {
        path: 'paymentCenter',
        name: 'paymentCenter',
        meta: { title: '充值中心' },
        component: () => import('@/views/base/paymentCenter/new')
      }
    ]
  }

]
