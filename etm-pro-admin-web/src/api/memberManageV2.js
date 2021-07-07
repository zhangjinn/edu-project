import request from '@/utils/request'

// 条件查询会员的分页信息
export function queryMemberInfo(params) {
  return request({
    url: '/sacc/v2/customer/page',
    method: 'get',
    params
  })
}

// 设置会员入园(old)
export function putInGarden(data) {
  return request({
    url: '/sacc/customer/admission',
    method: 'put',
    data
  })
}

// 设置会员离园(old)
export function getOutGarden(data) {
  return request({
    url: '/sacc/customer/departure',
    method: 'put',
    data
  })
}

// 查询班级列表
export function getClassList() {
  return request({
    url: '/sacc/clazz/classList',
    method: 'get'
  })
}

// 批量分班
export function arrangeClass({ customerIds, clazzId }) {
  return request({
    url: '/sacc/v2/customer/batch/clazz',
    method: 'put',
    data: { customerIds, clazzId }
  })
}

// 查询会员信息
export function getMemberInfo(id) {
  return request({
    url: `/sacc/v2/customer/${id}`,
    method: 'get'
  })
}

// 修改会员信息
export function modifyMemberInfo({ id, data }) {
  return request({
    url: `/sacc/v2/customer/${id}`,
    method: 'put',
    data
  })
}

// 查询联系人称呼(old)
export function getContactType(type) {
  return request({
    url: '/sacc/dictionaries/' + type,
    method: 'get'
  })
}
