import request from '@/utils/request'

// 查询收支项目列表
export function getStatementItemList(data) {
  return request({
    url: `/guardcare/statement_type`,
    method: 'get',
    params: data
  })
}

// 新增收支类型
export function addStatementItem(data) {
  return request({
    url: `/guardcare/statement_type`,
    method: 'post',
    data
  })
}

// 更新收支类型
export function renewStatementItem(statementTypeId, data) {
  return request({
    url: `/guardcare/statement_type/${statementTypeId}`,
    method: 'put',
    data
  })
}

// 删除收支类型
export function deleteStatementItem(statementTypeId) {
  return request({
    url: `/guardcare/statement_type/${statementTypeId}`,
    method: 'delete'
  })
}

// 修改收支类型排序
export function renewStatementItemSort(data) {
  return request({
    url: `/guardcare/statement_type/sort`,
    method: 'put',
    data
  })
}
