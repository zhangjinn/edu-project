import request from '@/utils/request'
import secApiPrefix from './textPrefix'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

// 观测管理表格数据
export function getEvalList(params) {
  return request({
    url: '/game/api/task',
    method: 'get',
    params
  })
}
