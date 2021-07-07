import request from '@/utils/request'

/**
 * 获取所有枚举
 * @returns {AxiosPromise}
 */
export function getNeurooEnumAll() {
  return request({
    url: 'neuroo/enum/all',
    method: 'get'
  })
}

/**
 * 通过名称获取枚举值
 * @param name
 * @returns {AxiosPromise}
 */
export function getNeurooEnumByName({ name }) {
  return request({
    url: 'neuroo/enum',
    method: 'get',
    params: { name }
  })
}
