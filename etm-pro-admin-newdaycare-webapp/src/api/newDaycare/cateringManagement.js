import request from '@/utils/request'

// ****人群管理
/**
 * 根据人群名称查询人群列表
 * @param peopleName 人群名称
 * @returns {AxiosPromise}
 */
export function queryPeopleGroupList ({ peopleName }) {
  return request({
    url: '/newdaycare/diet_people',
    method: 'get',
    params: { peopleName }
  })
}

/**
 * 新增人群
 * @param peopleScore *
 人群范围设置
 * @param fodList 餐别组合
 * @param peopleName 人群名称
 * @param weekSet 周设置
 * @param isLslamic 是否清真
 * @param isEnable 是否启用
 * @returns {AxiosPromise}
 */
export function createPeopleGroup ({ peopleScore, fodList, peopleName, weekSet, isLslamic, isEnable }) {
  return request({
    url: '/newdaycare/diet_people',
    method: 'post',
    data: { peopleScore, fodList, peopleName, weekSet, isLslamic, isEnable }
  })
}

/**
 * 更新人群
 * @param dietPeopleId
 * @param isEnable 是否启用
 * @param peopleName 人群名称
 * @param fodList 餐别组合
 * @param weekSet 周设置
 * @param peopleScore *
 人群范围设置
 * @param isLslamic 是否清真
 * @returns {AxiosPromise}
 */
export function updatePeoppleGroup ({ dietPeopleId, isEnable, peopleName, fodList, weekSet, peopleScore, isLslamic }) {
  return request({
    url: `/newdaycare/diet_people/${dietPeopleId}`,
    method: 'put',
    data: { isEnable, peopleName, fodList, weekSet, peopleScore, isLslamic }
  })
}

/**
 * 删除人群
 * @param dietPeopleId 人群 ID
 * @returns {AxiosPromise}
 */
export function removePeopleGroup ({ dietPeopleId }) {
  return request({
    url: `/newdaycare/diet_people/${dietPeopleId}`,
    method: 'delete'
  })
}

/**
 * 查询一个
 * @param id
 * @returns {AxiosPromise}
 */
export function queryPeoppleGroupDetail ({ id }) {
  return request({
    url: `/newdaycare/diet_people/findOne/${id}`,
    method: 'get'
  })
}

// **食材库
