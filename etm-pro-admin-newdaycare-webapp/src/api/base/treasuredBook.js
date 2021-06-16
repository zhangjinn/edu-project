import request from '@/utils/request'

/**
 * 根据编码查询对应的宝典
 * @param coding 编码
 * @returns {AxiosPromise}
 */
export function queryTreasuredBook ({ coding }) {
  return request({
    url: '/basic/treasured_book/coding',
    method: 'get',
    params: { coding }
  })
}

/**
 * 增加点赞/播放数
 * @param treasuredBookItemId 宝典项ID
 * @param status 是点赞还是观看
 * @returns {AxiosPromise}
 */
export function createTreasuredBookLike ({ treasuredBookItemId, status }) {
  return request({
    url: '/basic/treasured_book',
    method: 'post',
    data: { treasuredBookItemId, status }
  })
}
