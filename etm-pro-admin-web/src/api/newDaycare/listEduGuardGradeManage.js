import request from '@/utils/request'

/**
 * 查询年级列表
 * @param name 年级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getGrade({ name, pageNum, pageSize, paged, noLoadding }) {
  return request({
    url: `/newdaycare/guard/educational/grade`,
    method: 'get',
    params: {
      name,
      pageNum,
      pageSize,
      paged,
      noLoadding
    }
  })
}

/**
 * 新增年级
 * @param name 年级名称
 * @returns {AxiosPromise}
 */
export function createGrade({ name }) {
  return request({
    url: `/newdaycare/guard/educational/grade`,
    method: 'post',
    data: { name }
  })
}

/**
 * 删除年级
 * @param id
 * @returns {AxiosPromise}
 */
export function removeGrade({ id }) {
  return request({
    url: `/newdaycare/guard/educational/grade/${id}`,
    method: 'delete'

  })
}

/**
 * 获取年级详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryGradeDetail({ id }) {
  return request({
    url: `/newdaycare/guard/educational/grade/${id}`,
    method: 'get'
  })
}

/**
 * 修改年级
 * @param id
 * @param name 年级名称
 * @returns {AxiosPromise}
 */
export function updateGrade({ id, name }) {
  return request({
    url: `/newdaycare/guard/educational/grade/${id}`,
    method: 'put',
    data: { name }
  })
}
