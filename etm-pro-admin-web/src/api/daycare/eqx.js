// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 获取用户已添加资源列表
 * @param editType 易企秀资源类型
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @param name 资源名称
 * @param pageNo 页码, 默认为1
 * @param pageSize 每页数量, 默认为10
 * @returns {AxiosPromise}
 */
export function queryEqxResourceList({ editType, name, pageNo, pageSize }) {
  return request({
    url: `/daycare/eqx/resource/list`,
    method: 'get',
    params: { editType, name, pageNo, pageSize }
  })
}

/**
 * 获取作品详情
 * @param editType 易企秀资源类型
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @param id 作品id
 * @returns {AxiosPromise}
 */
export function queryResourceInfo({ editType, id }) {
  return request({
    url: `/daycare/eqx/resource/info`,
    method: 'get',
    params: { editType, id }
  })
}

/**
 * 访问商城页面
 * @param editType 易企秀资源类型
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @returns {AxiosPromise}
 */
export function queryEqxStore({ editType }) {
  return request({
    url: `/daycare/eqx/resource/visit`,
    method: 'get',
    params: { editType }
  })
}

/**
 * 获取编辑地址
 * @param resourceId 易企秀资源id
 * @param editType 易企秀资源类型
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @returns {AxiosPromise}
 */
export function queryEqxEdit({ resourceId, editType }) {
  return request({
    url: `/daycare/eqx/resource/edit`,
    method: 'get',
    params: { resourceId, editType }
  })
}

/**
 * 删除易企秀资源
 * @param resourceId 易企秀资源 ID
 * @returns {AxiosPromise}
 */
export function removeEqxResource({ resourceId }) {
  return request({
    url: `/daycare/eqx/resource/${resourceId}`,
    method: 'delete'
  })
}

/**
 * 访问分享页面
 * @param resourceId 易企秀资源id
 * @param editType 易企秀资源类型
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @returns {AxiosPromise}
 */
export function queryEqxResourcePreview({ resourceId, editType }) {
  return request({
    url: `/daycare/eqx/resource/preview`,
    method: 'get',
    params: { resourceId, editType }
  })
}

/**
 * 海报访问分享页面
 * @param resourceId 易企秀资源id
 * @param editType 易企秀资源类型
 * @returns {AxiosPromise}
 */
export function queryEqxH2ResourceDownload({ resourceId, code }) {
  return request({
    url: `/daycare/eqx/resource/download`,
    method: 'get',
    params: { resourceId, code }
  })
}

/**
 * 获取活动中奖名单
 * @param id 资源id
 * @param pageNo
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryEqxWinnerList({ id, pageNo, pageSize }) {
  return request({
    url: `/daycare/eqx/resource/rewardList`,
    method: 'get',
    params: { id, pageNo, pageSize }
  })
}

/**
 * 获取表单数据
 * @param editType 资源类型, 只支持h5和互动, 默认为H5
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @param id 资源id
 * @returns {AxiosPromise}
 */
export function queryEqxResourceForm({ editType, id }) {
  return request({
    url: `/daycare/eqx/resource/form`,
    method: 'get',
    params: { editType, id }
  })
}

/**
 * 查询组织的付费情况
 * @returns {AxiosPromise}
 */
export function queryEqxIsPay() {
  return request({
    url: `/daycare/eqx/resource/isPay`,
    method: 'get'
  })
}

/**
 * 获取表单数据
 * @param editType 资源类型, 只支持h5和互动, 默认为H5
 h5 :h5
 h2 :海报
 h5e :表单
 hd :互动
 video :视频
 lsc :极简长页
 * @param id 资源id
 * @param pageNo 页码
 * @param pageSize 每页大小
 * @returns {AxiosPromise}
 */
export function queryForm({ editType, id, pageNo, pageSize }) {
  return request({
    url: `/daycare/eqx/resource/form`,
    method: 'get',
    params: { editType, id, pageNo, pageSize }
  })
}

/**
 * 获取活动中奖名单
 * @param id 资源id
 * @param pageNo
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryRewardList({ id, pageNo, pageSize }) {
  return request({
    url: `/daycare/eqx/resource/rewardList`,
    method: 'get',
    params: { id, pageNo, pageSize }
  })
}

/**
 * 导出活动中奖名单
 * @param id 资源id
 * @param pageNo
 * @param pageSize
 * @returns {AxiosPromise}
 */
// export function exportRewardExcel({ id, pageNo, pageSize }) {
//   return request({
//     url: `/daycare/eqx/resource/rewardExcel`,
//     method: 'get',
//     params: { id, pageNo, pageSize }
//   })
// }

/**
 * 获取活动传播数据
 * @param id 资源id
 * @returns {AxiosPromise}
 */
export async function queryRewardData({ id }) {
  return request({
    url: `/daycare/eqx/resource/rewardData`,
    method: 'get',
    params: { id }
  })
}
