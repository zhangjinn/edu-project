import request from '../http.js'

/**
 * 新增动态（发布动态）
 * @param textContent 文本内容
 * @param fileInfoList 文件信息列表
 * @param allowComments 是否允许评论
 * @param type 类型
 * @param clazzIdList 班级id的列表
 * @returns {AxiosPromise}
 */
export function createDynamic({ textContent, fileInfoList, allowComments, type, clazzIdList }) {
  return request({
    url: `/guardcare/dynamics`,
    method: 'post',
    data: {
      textContent,
      fileInfoList,
      allowComments,
      type,
      clazzIdList
    }
  })
}

/**
 * 查询动态列表并分页
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryDynamic({ clazzId, pageNum, pageSize, paged }) {
  return request({
    url: `/guardcare/dynamics/page`,
    method: 'get',
    params: {
      clazzId,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 获取年级班级集合
 * @param clazzName 班级名称
 * @returns {AxiosPromise}
 */
export function queryClassList({ clazzName }) {
  return request({
    url: `/guardcare/educational/clazz/by_grade`,
    method: 'get',
    params: { clazzName }
  })
}

/**
 * 删除动态
 * @param dynamicsId
 * @returns {AxiosPromise}
 */
export function removeDynamics({ dynamicsId }) {
  return request({
    url: `/guardcare/dynamics/${dynamicsId}`,
    method: 'delete'
  })
}

/**
 * 查询动态详情
 * @param dynamicsId
 * @param clazzId 班级id
 * @returns {AxiosPromise}
 */
export function queryDynamicDetail({ dynamicsId, clazzId }) {
  return request({
    url: `/guardcare/dynamics/details/${dynamicsId}`,
    method: 'get',
    params: { clazzId }
  })
}

/**
 * 点赞或取消点赞
 * @param dynamicsId 动态id
 * @param like 是否点赞
 * @returns {AxiosPromise}
 */
export function updateDynamicsLike({ dynamicsId, like }) {
  return request({
    url: `/guardcare/dynamics/like`,
    method: 'put',
    data: {
      dynamicsId,
      like
    }
  })
}

/**
 * 新增班级动态评论（发布动态评论）
 * @param dynamicsId 动态id
 * @param replyToCommentId 回复的评论的id
 * @param parentCommentId 父评论id（层级关系）
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function createDynamicsComment({ dynamicsId, replyToCommentId, parentCommentId, content }) {
  return request({
    url: `/guardcare/dynamics_comment`,
    method: 'post',
    data: {
      dynamicsId,
      replyToCommentId,
      parentCommentId,
      content
    }
  })
}

/**
 * 查询动态评论列表
 * @param dynamicsId 动态id
 * @returns {AxiosPromise}
 */
export function queryCommentList({ dynamicsId }) {
  return request({
    url: `/guardcare/dynamics_comment/list`,
    method: 'get',
    params: { dynamicsId }
  })
}

/**
 * 删除动态评论
 * @param commentId
 * @returns {AxiosPromise}
 */
export function removeDynamicsComment({ commentId }) {
  return request({
    url: `/guardcare/dynamics_comment/${commentId}`,
    method: 'delete'

  })
}

/**
 * 查询当前账号能访问的班级列表
 * @returns {AxiosPromise}
 */
export function queryClassAuth() {
  return request({
    url: `/guardcare/educational/clazz/visible`,
    method: 'get'

  })
}

