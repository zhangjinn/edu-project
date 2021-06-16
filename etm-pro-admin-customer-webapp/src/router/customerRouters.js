export default [
  {
    path: '/customer_speechSource',
    name: 'customer_speechSource',
    component: () => import(/* webpackChunkName: "customer_speechSource" */'@/views/listSource/speechSource')
  }, {
    path: '/customer_productCenter',
    name: 'customer_productCenter',
    component: () => import(/* webpackChunkName: "customer_productCenter" */'@/views/listSource/productCenter')
  },
  {
    path: '/callCenter',
    name: 'callCenter',
    component: () => import(/* webpackChunkName: "callCenter" */'@/views/callCenter')
  },
  {
    path: '/customer_smsCenter',
    name: 'customer_smsCenter',
    component: () => import(/* webpackChunkName: "customer_smsCenter" */'@/views/smsCenter')
  },
  {
    path: '/customer_myCustomer',
    name: 'customer_myCustomer',
    component: () => import(/* webpackChunkName: "customer_myCustomer" */'@/views/listCustomer/myCustomer')
  },
  {
    path: '/customer_publicCustomer',
    name: 'customer_publicCustomer',
    component: () => import(/* webpackChunkName: "customer_myCustomer" */'@/views/listCustomer/publicCustomer')
  },
  {
    path: '/customer_followRecord',
    name: 'customer_followRecord',
    component: () => import(/* webpackChunkName: "customer_myCustomer" */'@/views/listCustomer/followRecord')
  },
  {
    path: '/customer_dealRecord',
    name: 'customer_dealRecord',
    component: () => import(/* webpackChunkName: "customer_myCustomer" */'@/views/listCustomer/dealRecord')
  },
  {
    path: '/customer_radarSearch',
    name: 'customer_radarSearch',
    component: () => import(/* webpackChunkName: "customer_radarSearch" */'@/views/radarSearch')
  },
  {
    path: '/customer_crashPortrayal',
    name: 'customer_crashPortrayal',
    component: () => import(/* webpackChunkName: "customer_crashPortrayal" */'@/views/aiCrash/crashPortrayal/index')
  },
  {
    path: '/customer_luckySearch',
    name: 'customer_luckySearch',
    component: () => import(/* webpackChunkName: "customer_luckySearch" */'@/views/luckySearch/index')
  }
]
