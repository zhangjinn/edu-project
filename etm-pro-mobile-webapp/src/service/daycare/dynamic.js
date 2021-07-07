import request from '../http.js'

/**
 * 查询动态列表 BM
 * @param courseId 课程id
 * @param clazzId 班级id
 * @param teachOrCare 课程类型
 TEACH :早教
 CARE :托育
 * @returns {AxiosPromise}
 */
export function queryDynamic({ pageNum, pageSize, courseId, clazzId, teachOrCare }) {
  return request({
    url: `/daycare/dynamic/find_all`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      courseId,
      clazzId,
      teachOrCare
    }
  })
}

/**
 * 获取课程信息
 * @returns {AxiosPromise}
 */
export function queryClassAuth() {
  return request({
    url: `/daycare/dynamic/find_course`,
    method: 'get'

  })
}

/**
 * 获取发布范围数据 BPC
 * @returns {AxiosPromise}
 */
export function queryClassAuthInPost() {
  return request({
    url: `/daycare/dynamic/authorization`,
    method: 'get'

  })
}

/**
 * 新增动态 BPC BM
 * @param content 发布内容
 * @param dynamicType 上传类型
 * @param urlList 图片 / 视频地址
 * @param dynamicReleaseScopeDTOList 发布范围
 * @param canComment 是否可评论
 * @param dynamicCover undefined
 * @returns {AxiosPromise}
 */
export function createDynamic({ content, dynamicType, urlList, dynamicReleaseScopeDTOList, canComment, dynamicCover }) {
  return request({
    url: `/daycare/dynamic`,
    method: 'post',
    data: {
      content,
      dynamicType,
      urlList,
      dynamicReleaseScopeDTOList,
      canComment,
      dynamicCover
    }
  })
}

/**
 * 获取动态 BPC BM
 * @param courseId 课程id
 * @param clazzId 班级id
 * @param teachOrCare 课程类型
 * @param dynamicId 动态id
 * @returns {AxiosPromise}
 */
export function queryDynamicDetail({ courseId, clazzId, teachOrCare, dynamicId }) {
  return request({
    url: `/daycare/dynamic/details`,
    method: 'get',
    params: {
      courseId,
      clazzId,
      teachOrCare,
      dynamicId
    }
  })
}

/**
 * 删除动态 BPC
 * @param dynamicId 动态 ID
 * @returns {AxiosPromise}
 */
export function removeDynamics({ dynamicId }) {
  return request({
    url: `/daycare/dynamic/${dynamicId}`,
    method: 'delete'

  })
}

/**
 * 新增/取消动态点赞
 * @param dynamicId 动态id
 * @param state 是否可点赞 false 点赞 true 取消点赞
 * @returns {AxiosPromise}
 */
export function updateDynamicsLike({ dynamicId, state }) {
  return request({
    url: `/daycare/like`,
    method: 'post',
    data: {
      dynamicId,
      state
    }
  })
}

/**
 * 查询动态评论列表
 * @param dynamicId 动态id
 * @returns {AxiosPromise}
 */
export function queryCommentList({ dynamicId }) {
  return request({
    url: `/daycare/comment/${dynamicId}`,
    method: 'get'
  })
}

/**
 * 新增动态评论
 * @param dynamicId 动态id
 * @param commentContent 评论内容
 * @param commentFatherId 评论父id（父id为空，则是一级）
 * @returns {AxiosPromise}
 */
export function createDynamicsComment({ dynamicId, commentContent, commentFatherId }) {
  return request({
    url: `/daycare/comment`,
    method: 'post',
    data: {
      dynamicId,
      commentContent,
      commentFatherId
    }
  })
}

/**
 * 删除动态评论
 * @param commentId 动态评论 ID
 * @returns {AxiosPromise}
 */
export function removeDynamicsComment({ commentId }) {
  return request({
    url: `/daycare/comment/${commentId}`,
    method: 'delete'

  })
}
