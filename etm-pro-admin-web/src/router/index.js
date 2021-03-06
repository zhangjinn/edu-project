import Vue from 'vue'
import Router from 'vue-router'
import { getMySolutionByTerminalType, queryRouteTable } from '@/api/auth'
import { createAuth, removeAllInfo } from '@/utils/auth'
/* Layout */
import Layout from '@/layout'
// import { dayCareConstant, dayCareDynamic } from '@/router/daycare'
// import { newdayCareConstant, newdayCareDynamic } from '@/router/newdaycare'
// import { guardCareConstant, guardCareDynamic } from '@/router/guardcare'
// import { standardCareConstant, standardCareDynamic } from '@/router/standardcare'
// import { customerConstant, customerDynamic } from '@/router/customer'
import staticRoutes from './staticRoutes'
import subMicroRoutes from '@/router/microStatic'
Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

const componentObj = {
  dashboard: () => import('@/views/base/dashboardV2/index'),
  'organization': () => import('@/views/base/organization'),
  'org': () => import('@/views/base/org'), // ?????????
  'player': () => import('@/views/base/player'),
  'systemSetting': () => import('@/views/base/systemSetting/index'), // ????????????
  'systemSettingAll': () => import('@/views/base/systemSettingAll/index'), // ????????????
  'cameraSetting': () => import('@/views/base/cameraSetting/index'),
  // 'dataOverview': () => import('@/views/evaluation/dataOverview'),
  // 'reportManagement': () => import('@/views/evaluation/reportManagement'),
  // 'reportManagementConsumptionPlan': () => import('@/views/evaluation/reportManagementConsumptionPlan'),
  // 'payRecordManagement': () => import('@/views/evaluation/payRecordManagement'),
  // 'orderManagement': () => import('@/views/evaluation/orderManagement'),
  // 'evaluationSetup': () => import('@/views/evaluation/evaluationSetup'),
  // 'collectionManage': () => import('@/views/evaluation/collectionManage'),
  // 'student': () => import('@/views/customer/student'),
  // 'customer_smsCenter': () => import('@/views/customer/smsCenter/index'),
  'memberManage': () => import('@/views/sacc/memberManage'),
  'enrollmentManage': () => import('@/views/sacc/enrollmentManage'),
  'memberManageV2': () => import('@/views/sacc/memberManageV2'),
  'classManage': () => import('@/views/sacc/classManage/index'),
  'bodyCheck': () => import('@/views/sacc/bodyCheck/index'),
  'attendance': () => import('@/views/sacc/attendance/index'),
  'course': () => import('@/views/sacc/course/index'),
  'schedule': () => import('@/views/sacc/schedule'),
  'recipesManage': () => import('@/views/sacc/recipesManage'),
  'nurtureSetup': () => import('@/views/sacc/nurtureSetup/index'),
  // 'customer_luckySearch': () => import('@/views/customer/luckySearch/index'),
  // ????????????
  'clazzManage_neuroo': () => import('@/views/neuroo/edu/classManage/index'),
  'courseManage_neuroo': () => import('@/views/neuroo/edu/courseManage/index'),
  'memberManage_neuroo': () => import('@/views/neuroo/memberManage/index'),
  'orderManage_neuroo': () => import('@/views/neuroo/orderManage/index'),
  // 0.1.0????????????
  // 'callCenter': () => import('@/views/customer/callCenter'),
  // 'customerScan': () => import('@/views/customer/customerScan'),
  'paymentCenter': () => import('@/views/base/paymentCenter/new'),
  // ????????????
  'payAccountSetting': () => import('@/views/base/payAccountSetting'),
  // ?????????/??????????????????
  'basic_newPayAccountSetting': () => import('@/views/base/accountManage/index'),

  // ?????????
  'fileCenter': () => import('@/views/base/cloudDisk')
  // ????????????
  // 'customer_myCustomer': () => import('@/views/customer/listCustomer/myCustomer'),
  // 'customer_followRecord': () => import('@/views/customer/listCustomer/followRecord'),
  // 'customer_dealRecord': () => import('@/views/customer/listCustomer/dealRecord'),
  // ????????????
  // 'customer_publicCustomer': () => import('@/views/customer/listCustomer/publicCustomer'),

  // ???????????????
  // 'evaluation_yiweilaiQuestion': () => import('@/views/evaluation/yiweilaiQuestion'),
  // 'evaluation_yiweilaiSetup': () => import('@/views/evaluation/yiweilaiSetup'),
  // // ??????????????????
  // 'evaluation_reportHistoryTeacher': () => import('@/views/evaluation/reportHistoryTeacher'),
  //
  // 'evaluation_sharingOutManage': () => import('@/views/evaluation/sharingOutManage'),
  // 'evaluation_sharingInManage': () => import('@/views/evaluation/sharingInManage'),

  // ...dayCareDynamic,
  // ...newdayCareDynamic
  // ...guardCareDynamic
  // ...standardCareDynamic
  // ...customerDynamic
}

// affix: true ?????????????????????????????????
export const constantRoutes = [
  ...staticRoutes,
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/base/loginV2/login'),
    hidden: true
  },
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/base/redirect')
  //     }
  //   ]
  // },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/base/404'),
    hidden: true
  },
  // ??????????????????????????????
  {
    path: '/print',
    name: 'print',
    component: () => import('@/components/print/printContract'),
    hidden: true
  },
  // ??????
  {
    path: '/accountSetting',
    name: 'accountSetting',
    component: Layout,
    hidden: true,
    children: [
      // {
      //   path: 'index',
      //   name: 'index',
      //   component: () => import('@/views/base/accountManage/index'),
      //   meta: { title: '??????' }
      // },
      {
        path: 'merchant',
        name: 'merchant',
        component: () => import('@/views/base/accountManage/merchant/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'enterpriseMerchant',
        name: 'enterpriseMerchant',
        component: () => import('@/views/base/accountManage/merchant/enterpriseMerchant'),
        meta: { title: '??????????????????' }
      },
      {
        path: 'personalMerchant',
        name: 'personalMerchant',
        component: () => import('@/views/base/accountManage/merchant/personalMerchant'),
        meta: { title: '??????????????????' }
      },
      {
        path: 'personalAccount',
        name: 'personalAccount',
        component: () => import('@/views/base/accountManage/merchant/personalAccount'),
        meta: { title: '??????????????????' }
      },
      {
        path: 'caibaoMerchant',
        name: 'caibaoMerchant',
        component: () => import('@/views/base/accountManage/caibao/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'caibaoAccount',
        name: 'caibaoAccount',
        component: () => import('@/views/base/accountManage/caibao/setting'),
        meta: { title: '??????????????????' }
      }
    ]
  },
  // ??????/?????????????????????????????????
  {
    id: 'document',
    path: '/document',
    component: Layout,
    name: 'document',
    meta: {
      title: 'document',
      icon: 'iconteam1'
    },
    children: [
      {
        path: 'allowanceGuide',
        name: 'allowanceGuide',
        component: () => import('@/views/base/document/allowance/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'skillGuide',
        name: 'skillGuide',
        component: () => import('@/views/base/document/skill/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'recipeGuide',
        name: 'recipeGuide',
        component: () => import('@/views/base/document/recipe/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'policyGuide',
        name: 'policyGuide',
        component: () => import('@/views/base/document/policy/index'),
        meta: { title: '????????????' }
      },
      {
        path: 'productDetail',
        name: 'productDetail',
        component: () => import('@/views/base/document/productDetail/productDetail'),
        meta: { title: '????????????' }
      },
      {
        path: 'industry',
        name: 'industry',
        component: () => import('@/views/base/document/productDetail/productDetail'),
        meta: { title: '????????????' }
      }
    ]
  },
  // {
  //   id: 'customer_myCustomer',
  //   path: '/customer_myCustomer',
  //   component: Layout,
  //   name: 'customer_myCustomer',
  //   meta: {
  //     title: '????????????',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: 'customer_batch',
  //       name: 'customer_batch',
  //       component: () => import('@/views/customer/listCustomer/batch'),
  //       meta: { title: '????????????' }
  //     },
  //     {
  //       path: 'customer_settings',
  //       name: 'customer_settings',
  //       component: () => import('@/views/customer/customerSetting'),
  //       meta: { title: '????????????' }
  //     }
  //   ]
  // },
  {
    id: 'temp',
    path: '/temp',
    component: Layout,
    name: 'temp',
    meta: {
      title: 'temp',
      icon: 'iconteam1'
    },
    children: [
      {
        path: 'temp',
        name: 'temp',
        component: () => import('@/views/newDaycare/feedback/index.vue'),
        meta: { title: 'temp' }
      }
    ]
  },
  // {
  //   id: 'newdaycare_childcareSetting',
  //   path: '/newdaycare_childcareSetting',
  //   component: Layout,
  //   name: 'newdaycare_childcareSetting',
  //   meta: {
  //     title: 'childcareSetting',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'childcareSetting2',
  //       component: () => import('@/views/newDaycare/childManage/settings'),
  //       meta: { title: '??????????????????' }
  //     }
  //   ]
  // },
  // {
  //   id: 'daycare_childcareSetting',
  //   path: '/daycare_childcareSetting',
  //   component: Layout,
  //   name: 'daycare_childcareSetting',
  //   meta: {
  //     title: 'childcareSetting',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'childcareSetting1',
  //       component: () => import('@/views/daycare/childManage/settings'),
  //       meta: { title: '??????????????????' }
  //     }
  //   ]
  // },
  // {
  //   id: 'newdaycare_courseManageSetting',
  //   path: '/newdaycare_courseManageSetting',
  //   component: Layout,
  //   name: 'newdaycare_courseManageSetting',
  //   meta: {
  //     title: 'courseManageSetting',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'courseManageSetting1',
  //       component: () => import('@/views/newDaycare/courseManage/settings'),
  //       meta: { title: '??????/??????????????????' }
  //     }
  //   ]
  // },
  // {
  //   id: 'newdaycare_clazzCareSetting',
  //   path: '/newdaycare_clazzCareSetting',
  //   component: Layout,
  //   name: 'newdaycare_clazzCareSetting',
  //   meta: {
  //     title: 'clazzCareSetting',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'clazzCareSetting1',
  //       component: () => import('@/views/newDaycare/clazzCare/settings'),
  //       meta: { title: '????????????????????????' }
  //     }
  //   ]
  // },
  // ????????????
  {
    id: 'application',
    path: '/application',
    component: Layout,
    redirect: '/application/index',
    name: 'application',
    hidden: true,
    meta: {
      title: '????????????',
      icon: 'example'
    },
    children: [
      {
        path: 'courseSetting',
        name: 'courseSetting',
        component: () => import('@/views/sacc/course/setting'),
        meta: { title: '????????????' }
      },
      {
        path: 'bodyCheckSetting',
        name: 'bodyCheckSetting',
        component: () => import('@/views/sacc/bodyCheck/setting'),
        meta: { title: '???????????????' }
      }
    ]
  },
  // {
  //   id: 'newdaycare_courseTimeManageSetting',
  //   path: '/newdaycare_courseTimeManageSetting',
  //   component: Layout,
  //   name: 'newdaycare_courseTimeManageSetting',
  //   meta: {
  //     title: '????????????',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'courseTimeManageSetting1',
  //       component: () => import('@/views/newDaycare/courseTimeManageTeach/settings/courseManagesSetting/index'),
  //       meta: { title: '????????????' }
  //     }
  //   ]
  // },
  // {
  //   id: 'newdacare_staffSetting',
  //   path: '/newdacare_staffSetting',
  //   component: Layout,
  //   name: 'newdacare_staffSetting',
  //   meta: {
  //     title: 'staffSetting',
  //     icon: 'iconteam1'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'staffSetting',
  //       component: () => import('@/views/newDaycare/listDataManage/staffFile/setting/index'),
  //       meta: { title: '??????????????????' }
  //     }
  //   ]
  // },
  // {
  //   path: '/basicSetup',
  //   name: 'basicSetup',
  //   component: Layout,
  //   redirect: '/basicSetup/index',
  //   hidden: true,
  //   children: [{
  //     path: 'index',
  //     name: 'basicSetup',
  //     component: () => import('../views/customer/basicSetup'),
  //     meta: { title: '????????????' }
  //   }]
  // },
  {
    path: '/memberSetup',
    name: 'memberSetup',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'memberSetup',
      component: () => import('@/views/sacc/memberSetup'),
      meta: { title: '????????????' }
    }]
  },
  {
    path: '/profile',
    name: 'profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'profile',
      component: () => import('@/views/base/userInfo/index'),
      meta: { title: '????????????' }
    }]
  },
  // {
  //   path: '/payRecordPdf',
  //   name: 'payRecordPdf',
  //   component: () => import('@/views/evaluation/reportManagement/components/payRecordDetail/pdfShow'),
  //   meta: { title: '??????????????????' }
  // },
  // {
  //   path: '/questionPdf',
  //   name: 'questionPdf',
  //   component: () => import('@/views/evaluation/yiweilaiQuestion/questionPdf'),
  //   meta: { title: '??????????????????' }
  // },
  // {
  //   path: '/child',
  //   name: 'child',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'newdaycare_childManage',
  //       name: 'newdaycare_childMange',
  //       component: () => import('@/views/newDaycare/childManage/myChild/index'),
  //       meta: { title: '????????????' }
  //
  //     }, {
  //       name: 'newdaycare_smsCenter',
  //       path: 'newdaycare_smsCenter',
  //       component: () => import('@/views/newDaycare/smsCenter/tpl'),
  //       meta: { title: '????????????' }
  //     },
  //     {
  //       path: '/newdaycare_importBatch',
  //       name: 'newdaycare_importBatch',
  //       component: () => import('@/views/newDaycare/importBatch/views/index'),
  //       meta: { title: '??????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_assignBatch',
  //       name: 'newdaycare_assignBatch',
  //       component: () => import('@/views/newDaycare/assignBatch/views/index'),
  //       meta: { title: '??????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_classRoom',
  //       name: 'newdaycare_classRoom',
  //       component: () => import('@/views/newDaycare/classRoom/views/index'),
  //       meta: { title: '??????' }
  //     },
  //     {
  //       path: '/newdaycare_materialPriceManagesSetting',
  //       name: 'newdaycare_materialPriceManagesSetting',
  //       component: () => import('@/views/newDaycare/priceTeach/views/setting/index'),
  //       meta: { title: '????????????' }
  //     },
  //     {
  //       path: '/newdaycare_attendanceTeachSetting',
  //       name: 'newdaycare_attendanceTeachSetting',
  //       component: () => import('@/views/newDaycare/attendanceTeach/setting/index'),
  //       meta: { title: '??????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_attendanceCareSetting',
  //       name: 'newdaycare_attendanceCareSetting',
  //       component: () => import('@/views/newDaycare/attendanceCare/setting/index'),
  //       meta: { title: '??????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_smsCenterSetting',
  //       name: 'newdaycare_smsCenterCareSetting',
  //       component: () => import('@/views/newDaycare/smsCenter/msgSetting/index'),
  //       meta: { title: '???????????????' }
  //     },
  //     {
  //       path: '/newdaycare_incomeFlowSetting',
  //       name: 'newdaycare_incomeFlowSetting',
  //       component: () => import('@/views/newDaycare/incomeFlow/settings'),
  //       meta: { title: '??????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_bodyCheckSetting',
  //       name: 'newdaycare_bodyCheckSetting',
  //       component: () => import('@/views/newDaycare/bodyCheck/setting/index'),
  //       meta: { title: '????????????' }
  //     },
  //     {
  //       path: '/newdaycare_bodyCheckGuardSetting',
  //       name: 'newdaycare_bodyCheckGuardSetting',
  //       component: () => import('@/views/newDaycare/bodyCheckGuard/setting'),
  //       meta: { title: '?????????????????????' }
  //     },
  //     {
  //       path: '/newdaycare_mealsRecordSetting',
  //       name: 'newdaycare_mealsRecordSetting',
  //       component: () => import('@/views/newDaycare/mealsRecord/settings'),
  //       meta: { title: '????????????' }
  //     },
  //     {
  //       path: '/newdaycare_addNotification',
  //       name: 'newdaycare_addNotification',
  //       component: () => import('@/views/newDaycare/cmNoticeManage/addNotification/index'),
  //       meta: { title: '??????/????????????' }
  //     },
  //     // {
  //     //   path: '/newdaycare_editNotification',
  //     //   name: 'newdaycare_editNotification',
  //     //   component: () => import('@/views/newDaycare/cmNoticeManage/editNotification/index'),
  //     //   meta: { title: '????????????' }
  //     // },
  //     {
  //       path: '/newdaycare_bookManageSetting',
  //       name: 'newdaycare_bookManageSetting',
  //       component: () => import('@/views/newDaycare/listLibrary/bookManage/setting/index'),
  //       meta: { title: '????????????/????????????' }
  //     },
  //     // {
  //     //   path: '/customer_smsCenterSetting',
  //     //   name: 'customer_smsCenterSetting',
  //     //   component: () => import('@/views/customer/smsCenter/msgSetting/index'),
  //     //   meta: { title: '???????????????' }
  //     // },
  //     {
  //       path: '/cm_setting',
  //       name: 'cm_setting',
  //       component: () => import('@/views/newDaycare/homeManage/daycare_cm'),
  //       meta: { title: '???????????????' }
  //     },
  //     {
  //       path: '/channelSettings',
  //       name: 'channelSettings',
  //       component: () => import('@/views/newDaycare/listChannelManage/settings/index'),
  //       meta: { title: '??????????????????' }
  //     }
  //   ]
  // },
  {
    path: '/dashboardMore',
    name: 'dashboardMore',
    component: Layout,
    hidden: true,
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('../views/base/dashboardV2/moreList/product'),
      meta: { title: '????????????' }
    },
    {
      path: 'headline',
      name: 'headline',
      component: () => import('../views/base/dashboardV2/moreList/headline'),
      meta: { title: '????????????' }
    }]
  }
  // ...dayCareConstant,
  // ...newdayCareConstant
  // ...guardCareConstant
  // ...standardCareConstant
  // ...customerConstant
]
const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export let asyncRoutes = []
export const asyncRouters = []
async function groupRouter(routeTable) {
  const routerGroup = routeTable.reduce((acc, cur) => {
    if (!acc[cur.projectCode]) {
      acc[cur.projectCode] = []
    }
    cur.path = '/' + cur.uri
    acc[cur.projectCode].push(cur)
    return acc
  }, {})
  localStorage.setItem('routeGroup', JSON.stringify(routerGroup))
}

async function handleRouter(routes, defaultUrl) {
  console.log('defaultUrl: ', defaultUrl)
  const result = {
    path: '/',
    hidden: true,
    redirect: defaultUrl,
    component: Layout,
    children: routes.map(item => {
      try {
        const config = JSON.parse(item.config)
        const path = item.uri ? item.uri : ''
        item.path = '/' + path
        item.meta = {
          title: item.displayName,
          iconCode: item.iconCode
        }
        item.name = config.name
        item.component = componentObj[config.name]
      } catch (e) {
        console.error('error in src/router/index.js:893 function:() ', e)
      }
      return item
    })
  }
  result.children.push(...subMicroRoutes) // ???????????????????????????????????????????????????????????????????????????
  console.log('result: ', result)
  asyncRouters.push(result)
}
// ?????????????????????????????????????????????
export async function refreshRoutes(cb) {
  asyncRoutes = []
  const cacheSolution = JSON.parse(localStorage.getItem('CACHESOLUTION'))
  const routeTable = JSON.parse(localStorage.getItem('routeTable'))
  if (cacheSolution && routeTable) {
    const defaultUrl = '/' + (await handleRouterForSideBarMenu(cacheSolution))
    await handleRouter(routeTable, defaultUrl)
    await groupRouter(routeTable)
    createAuth()
    cb && cb(defaultUrl)
  } else {
    await getMySolutionByTerminalType('PC').then(async res => {
      const { solutionList } = res.data
      localStorage.setItem('CACHESOLUTION', JSON.stringify(solutionList))
      // const defaultUrl = await handleRouterForSideBarMenu(solutionList)
      await queryRouteTable({ terminalType: 'PC' }).then(async res => {
        // await handleRouter(res.data, defaultUrl)
        // await groupRouter(res.data)
        localStorage.setItem('routeTable', JSON.stringify(res.data))
      })
      localStorage.setItem('CACHESOLUTION', JSON.stringify(solutionList))
      await refreshRoutes(cb)
      // createAuth()
      // cb && cb(defaultUrl)
    }).catch(err => {
      console.log(err)
      removeAllInfo()
      window.location.reload()
      return []
    })
  }
}

// ??????
const biasSymbol = ''
export const basicuri = ''

async function handleRouterForSideBarMenu(solutionList) {
  return new Promise(resolve => {
    solutionList.forEach(item => {
      if (item.type === 'BASIC') {
        item.resourceList.forEach(menu => {
          if (menu.type === 'MENU') {
            const config = JSON.parse(menu.config || '{}')
            asyncRoutes.push({
              path: biasSymbol + menu.uri,
              // component: Layout,
              hidden: true,
              children: [
                {
                  path: menu.uri,
                  name: config.name,
                  // component: componentObj[config.name],
                  meta: {
                    title: menu.displayName,
                    icon: menu.iconCode || ''
                  }
                }
              ]
            })
          }
          if (menu.type === 'FOLDER') {
            const router = {
              path: '/' + menu.uri,
              // component: Layout,
              hidden: true,
              children: menu.childList.map(item => {
                // const self = JSON.parse(item.config.trim() || '{}')
                return {
                  path: item.uri,
                  name: item.displayName,
                  // component: componentObj[self.name],
                  meta: {
                    title: item.displayName,
                    icon: item.iconCode || ''
                  }
                }
              })
            }
            asyncRoutes.push(router)
          }
        })
      }
      if (item.type === 'BUSINESS') {
        let uri = ''
        item.resourceList.forEach(folder => {
          if (folder.type === 'MENU') {
            uri = folder.uri
          }
          if (folder.type === 'FOLDER') {
            const config = JSON.parse(folder.config.trim() || '{}')
            const router = {
              id: config.name,
              name: config.name,
              // component: Layout,
              // path: biasSymbol + folder.uri,
              alwaysShow: config.alwaysShow,
              meta: {
                title: folder.displayName,
                icon: folder.iconCode
              },
              children: []
            }

            folder.childList.forEach(child => {
              if (child.type === 'MENU') {
                if (!uri) {
                  uri = child.uri
                }
                const childconfig = JSON.parse(child.config.trim() || '{}')
                router.children.push({
                  path: child.uri,
                  name: childconfig.name,
                  // component: componentObj[childconfig.name],
                  meta: {
                    title: child.displayName,
                    affix: childconfig.affix
                  }
                })
              }
            })
            asyncRoutes.push(router)
          }
          if (folder.type === 'MENU') {
            const config = JSON.parse(folder.config.trim() || '{}')
            const router = {
              id: config.name,
              // name: config.name,
              // component: Layout,
              // path: biasSymbol + folder.uri,
              alwaysShow: config.alwaysShow,
              children: [
                {
                  name: config.name,
                  path: biasSymbol + folder.uri,
                  meta: {
                    title: folder.displayName,
                    icon: folder.iconCode
                  }
                  // component: componentObj[config.name]
                }
              ]
            }
            asyncRoutes.push(router)
          }

          const redirect = '/' + uri
          const route = {
            path: '/',
            hidden: true,
            redirect: redirect
          }
          asyncRoutes.push(route)
          resolve(uri || '/404')
        })
        // resolve('/404')
      }
    })
  })
}

export default router
