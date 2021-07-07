import request from '@/utils/request'

export function queryEnrollSetting() {
  return request({
    url: '/evaluation/evaluation_setting',
    method: 'get'
  })
}
