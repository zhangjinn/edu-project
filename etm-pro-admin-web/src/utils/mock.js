const Mock = require('mockjs')
const domian = process.env.VUE_APP_BASE_DOMAIN_API
// ================================================

import { applicationSetting, contacter, customField, test } from '../mockapi'

const apis = [...test, ...contacter, ...customField, ...applicationSetting]

/**
 * handleMock
 * @param url
 * @param type
 * @param objOrFun
 */
export function toMock({ url, method, obj }) {
  if (process.env.NODE_ENV !== 'development') {
    return false
  }
  const base_url = domian + url
  Mock.mock(RegExp(base_url + '.*'), method, function() {
    const data = Mock.mock(obj)
    console.log(method + '-' + url, ':', JSON.stringify({
      code: 0,
      message: '成功',
      data: data
    }, null, 2))
    return {
      code: 0,
      message: '成功',
      data: data
    }
  })
}

for (const api of apis) {
  toMock({ url: api.url, method: api.method, obj: api.data })
}
