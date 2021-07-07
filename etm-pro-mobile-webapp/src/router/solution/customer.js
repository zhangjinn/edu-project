import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 客户跟进管理
const abCustomerList = r => require.ensure([], () => r(require('@/views/customer/abCustomerList/index')), 'abCustomerList')
const customerList = r => require.ensure([], () => r(require('@/views/customer/customerList/index')), 'customerList')
const allocationList = r => require.ensure([], () => r(require('@/views/customer/allocationList/index')), 'allocationList')
const customerEdit = r => require.ensure([], () => r(require('@/views/customer/customerEdit/index')), 'customerEdit')
const customerDetail = r => require.ensure([], () => r(require('@/views/customer/customerDetail/index')), 'customerDetail')
const followEdit = r => require.ensure([], () => r(require('@/views/customer/followEdit/index')), 'followEdit')
const followRecord = r => require.ensure([], () => r(require('@/views/customer/followRecord/index')), 'followRecord')
const followRecordDetail = r => require.ensure([], () => r(require('@/views/customer/followRecordDetail/index')), 'followRecordDetail')
const customerAssign = r => require.ensure([], () => r(require('@/views/customer/customerAssign/index')), 'customerAssign')
const assignBatch = r => require.ensure([], () => r(require('@/views/customer/assignBatch/index')), 'assignBatch')

const customer = {
  customerList: [
    // 客户列表
    {
      path: '/customerList',
      name: 'customerList',
      component: customerList,
      meta: {
        showTab: true,
        title: '客户名单'
      }
    },
    // 客户公海
    {
      path: '/abCustomerList',
      name: 'abCustomerList',
      component: abCustomerList,
      meta: {
        showTab: true,
        title: '公海'
      }
    },
    // 添加客户
    {
      path: '/customerAdd',
      name: 'customerAdd',
      component: customerEdit,
      meta: {
        showTab: true,
        title: '添加客户'
      }
    },
    // 修改客户
    {
      path: '/customerEdit',
      name: 'customerEdit',
      component: customerEdit,
      meta: {
        showTab: true,
        title: '修改客户'
      }
    },
    // 客户详情
    {
      path: '/customerDetail',
      name: 'customerDetail',
      component: customerDetail,
      meta: {
        showTab: true,
        title: '客户详情'
      }
    },
    // 分配客户
    {
      path: '/customerAssign',
      name: 'customerAssign',
      component: customerAssign,
      meta: {
        showTab: true,
        title: '分配客户'
      }
    },
    // 分配批次
    {
      path: '/assignBatch',
      name: 'assignBatch',
      component: assignBatch,
      meta: {
        showTab: true,
        title: '分配批次'
      }
    },
    // 分配客户名单
    {
      path: '/allocationList',
      name: 'allocationList',
      component: allocationList,
      meta: {
        showTab: true,
        title: '批次详情'
      }
    },
    // 写跟进
    {
      path: '/followEdit',
      name: 'followEdit',
      component: followEdit,
      meta: {
        showTab: true,
        title: '写跟进'
      }
    },
    // 跟进记录
    {
      path: '/followRecord',
      name: 'followRecord',
      component: followRecord,
      meta: {
        showTab: true,
        title: '跟进记录'
      }
    },
    // 跟进详情
    {
      path: '/followRecordDetail',
      name: 'followRecordDetail',
      component: followRecordDetail,
      meta: {
        showTab: true,
        title: '跟进详情'
      }
    }
  ]
}

export default customer
