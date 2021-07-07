// import request from '@/service/daycare/mockRequest'
import request from '../http'

/** 查询交代事宜列表
 * @param tellState {string} 交代状态
 TO_BE_SIGNED :待确认
 DETERMINE :已确定
 REVOKED :已撤销
 * @param childName {string|null} 学员名称
 * @returns {AxiosPromise}
 */
export function queryMatterList({ tellState, childName }) {
  return request({
    url: '/daycare/tell_matters',
    method: 'get',
    params: { tellState, childName }
  })
}

/**
 * 获取交代事宜
 * @param tellMattersId 交代事宜 ID
 * @returns {AxiosPromise}
 */
export function queryMatterDetail({ tellMattersId }) {
  return request({
    url: `/daycare/tell_matters/${tellMattersId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 确认
 * @param tellMattersId 事宜id
 * @param tellState 交代状态
 * C_TO_BE_SIGNED :待确认 B_DETERMINE :已确定 A_REVOKED :已撤销
 * @returns {AxiosPromise}
 */
export function sureMatter({ tellMattersId, tellState }) {
  return request({
    url: `/daycare/tell_matters/revoke/${tellMattersId}`,
    method: 'put',
    data: { tellState }
  })
}
