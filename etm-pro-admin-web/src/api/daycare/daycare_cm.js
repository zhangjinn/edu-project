import request from '@/utils/request'

// 获取C端的入口地址
export function getClientUrl() {
  return request({
    url: `/daycare/enterprise_config/client_enter_url`,
    method: 'get'
  })
}
