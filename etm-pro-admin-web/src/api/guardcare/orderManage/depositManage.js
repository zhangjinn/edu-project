import request from '@/utils/request'

// 查询订金列表
export function getDepositList(data) {
  return request({
    url: `/guardcare/deposit`,
    method: 'get',
    params: data
  })
}

// 新增订金
export function addNewDeposit(data) {
  return request({
    url: `/guardcare/deposit`,
    method: 'post',
    data
  })
}

// 更新订金
export function renewDeposit(depositId, data) {
  return request({
    url: `/guardcare/deposit/${depositId}`,
    method: 'put',
    data
  })
}

// 获取订金
export function getDepositDetail(depositId) {
  return request({
    url: `/guardcare/deposit/${depositId}`,
    method: 'get'
  })
}

// 删除订金
export function deleteDeposit(depositId) {
  return request({
    url: `/guardcare/deposit/${depositId}`,
    method: 'delete'
  })
}
