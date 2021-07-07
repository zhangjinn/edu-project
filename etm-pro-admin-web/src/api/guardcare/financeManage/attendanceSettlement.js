import request from '@/utils/request'

// 查询结算列表并分页
export function getSettlementList(data) {
  return request({
    url: `/guardcare/settlement_records/page`,
    method: 'get',
    params: data
  })
}

// 确认结算
export function confirmSettlement(data) {
  return request({
    url: `/guardcare/settlement_records/settlement`,
    method: 'put',
    data
  })
}

// 修改金额
export function resetSettleAmount(data) {
  return request({
    url: `/guardcare/settlement_records/amount`,
    method: 'put',
    data
  })
}

// 检查是否允许结算
export function checkSettleStatus(data) {
  return request({
    url: `/guardcare/settlement_records/check`,
    method: 'get',
    params: data
  })
}
