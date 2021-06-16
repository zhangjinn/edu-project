import request from '@/utils/request'

/**
 * @description 获取所有权限分类
 * @returns {AxiosPromise}
 */
export function getAuthList () {
  return request({
    url: '/basic/enterprise_resource',
    method: 'get'
  })
}

/**
 * @description 根据条件查询当前登录的账户的解决方案和资源列表
 * @returns {AxiosPromise}
 */
export function getMySolutionByTerminalType (terminalType) {
  return request({
    url: '/basic/solution/menu',
    method: 'get',
    params: {
      terminalType
    }
  })
}

/**
 * 查询路由表
 * @param terminalType
 * @returns {AxiosPromise}
 */
export function queryRouteTable ({ terminalType }) {
  return request({
    url: '/basic/resource/menu',
    method: 'get',
    params: { terminalType }
  })
}
