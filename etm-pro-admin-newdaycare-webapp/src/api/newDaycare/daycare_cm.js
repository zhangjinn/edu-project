import request from '@/utils/request'

// 获取C端的入口地址
export function getClientUrl () {
  return request({
    url: '/newdaycare/enterprise_config/client_enter_url',
    method: 'get'
  })
}
