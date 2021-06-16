// import request from '@/api/newdaycare/mockRequest'
import request from '@/utils/request'

/**
 * 查询学员标签
 * @returns {AxiosPromise}
 */
export function queryChildTagSelect () {
  return request({
    url: '/newdaycare/tag',
    method: 'get',
    params: {}
  })
}

/**
 * 查询学员状态
 * @param childCategory  UNSOLD :未成交学员DEAL :已成交HISTORY :历史学员CHILD_POOL :公海
 * @returns {AxiosPromise}
 */
export function queryChildStatus ({ childCategory }) {
  return request({
    url: '/newdaycare/child_status',
    method: 'get',
    params: { childCategory }
  })
}

/**
 * 查询学员来源
 * @returns {AxiosPromise}
 */
export function queryChildSource () {
  return request({
    url: '/newdaycare/child_source',
    method: 'get',
    params: {}
  })
}

/**
 * 通过枚举查询程度 重要程度|学历程度...
 * @param attribute
 * @returns {AxiosPromise}
 */
export function queryChildAttribute ({ name }) {
  return request({
    url: `/newdaycare/child_attribute/${name}`,
    method: 'get',
    params: { name }
  })
}

/**
 * 查询学员称呼
 */
export function queryChildRelationship () {
  return request({
    url: '/newdaycare/relationship',
    method: 'get',
    params: {}
  })
}

/**
 * 获取跟进方式
 * @param category
 * @returns {AxiosPromise}
 */
export function queryChildFollowSelect () {
  return request({
    url: '/newdaycare/follow_means',
    method: 'get',
    params: {}
  })
}

/**
 * 通过ID获取跟进模板内容
 * @returns {AxiosPromise}
 */
export function queryFollowTemplateById ({ followContentTemplateId }) {
  return request({
    url: `/newdaycare/follow_content_template/${followContentTemplateId}`,
    method: 'get',
    params: { followContentTemplateId }
  })
}

// 查询跟进内容模板列表
export function queryFollowTemplateSelect () {
  return request({
    url: '/newdaycare/follow_content_template',
    method: 'get'
  })
}

/**
 * 会员卡-根据卡号获取详情
 * @param cardNumber 会员卡号
 * @returns {AxiosPromise}
 */
export function queryCheckCardNumber ({ cardNumber }) {
  return request({
    url: '/newdaycare/membership_card/judge',
    method: 'get',
    params: { cardNumber }
  })
}
