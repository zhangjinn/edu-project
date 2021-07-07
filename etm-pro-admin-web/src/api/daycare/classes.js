// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 获取托育班所有班级（分页）
 * @returns {AxiosPromise}
 */
export function queryNurseriesList({ teacherId, clazzName, lastPositionEnum, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/care/cae_clazz/clazz_page`,
    method: 'get',
    params: { teacherId, clazzName, lastPositionEnum, pageNum, pageSize, paged }
  })
}

/**
 * 创建班级
 * @param data
 * @returns {AxiosPromise}
 */
export function createClasses({ headTeacherId, remark, name }) {
  return request({
    url: `/daycare/care/cae_clazz`,
    method: 'post',
    data: { headTeacherId, remark, name }
  })
}

/**
 * 新增托育班级
 * @param headTeacherId 班主任id
 * @param teacherIdList 老师id
 * @param fullNumber 班级容量
 * @param remark 备注
 * @param name 班级名称
 * @param clazzRoomId 教室id, INT
 * @param generationId 适用年龄段id, INT
 * @returns {AxiosPromise}
 */
export function createNurseriesClasses({ headTeacherId, teacherIdList, fullNumber, remark, name, clazzRoomId, generationId }) {
  return request({
    url: `/daycare/care/cae_clazz`,
    method: 'post',
    data: { headTeacherId, teacherIdList, fullNumber, remark, name, clazzRoomId, generationId }
  })
}

/**
 * 获取托育班级列表（下拉）
 * @param clazzName
 * @returns {AxiosPromise}
 */
export function queryClasses({ clazzName }) {
  return request({
    url: `/daycare/care/cae_clazz`,
    method: 'get',
    params: { clazzName }
  })
}

/**
 * 获取班级所属学员
 * @param classid
 * @returns {AxiosPromise}
 */
export function queryClassChildren({ clazzId, childName }) {
  return request({
    url: `/daycare/care/cae_clazz/clazz_child`,
    method: 'get',
    params: { clazzId, childName }
  })
}

/**
 * 删除班级
 * @param caeClazzId
 * @returns {AxiosPromise}
 */
export function removeClass({ caeClazzId }) {
  return request({
    url: `/daycare/care/cae_clazz/${caeClazzId}`,
    method: 'delete',
    data: {}
  })
}

// /**
//  * 更新班级详情
//  * @param data
//  * @returns {AxiosPromise}
//  */
// export function updateClassDetail({ caeClazzName, headTeacherId, remark, enable, caeClazzId }) {
//   return request({
//     url: `/daycare/care/cae_clazz/${caeClazzId}`,
//     method: 'put',
//     data: { caeClazzName, headTeacherId, remark, enable }
//   })
// }

/**
 * 更新托育班级
 * @param caeClazzId
 * @param headTeacherId 班主任id
 * @param teacherIdList 老师id
 * @param fullNumber 班级容量
 * @param remark 备注
 * @param caeClazzName 班级名称
 * @param clazzRoomId 教室id, INT
 * @param generationId 适用年龄段id, INT
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateClassDetail({ caeClazzId, headTeacherId, teacherIdList, fullNumber, remark, caeClazzName, clazzRoomId, generationId, enable }) {
  return request({
    url: `/daycare/care/cae_clazz/${caeClazzId}`,
    method: 'put',
    data: { headTeacherId, teacherIdList, fullNumber, remark, caeClazzName, clazzRoomId, generationId, enable }
  })
}

/**
 * 获取班级详情
 * @param caeClazzId
 * @returns {AxiosPromise}
 */
export function queryClassDetail({ caeClazzId }) {
  return request({
    url: `/daycare/care/cae_clazz/${caeClazzId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 学员退班
 * @returns {AxiosPromise}
 */
export function getOutClass({ childId, clazzId }) {
  return request({
    url: `/daycare/care/cae_clazz/retreat`,
    method: 'post',
    data: {
      clazzId,
      childId
    }
  })
}

/**
 * 给学员调班
 * @param childIdList
 * @param currentClazzId
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function exchangeClass({ childIdList, currentClazzId, clazzId }) {
  return request({
    url: `/daycare/care/cae_clazz/adjustmente`,
    method: 'post',
    data: { childIdList, currentClazzId, clazzId }
  })
}

/**
 * 获取全部幼儿
 * @returns {AxiosPromise}
 */
export function queryAllChildren() {
  return request({
    url: `/daycare/child/down_search`,
    method: 'get',
    params: {}
  })
}

/**
 * 往班级添加学员
 * @param clazzId
 * @param childIdList
 * @returns {AxiosPromise}
 */
export function createJoinChildren({ clazzId, childIdList }) {
  return request({
    url: `/daycare/care/cae_clazz/add_child`,
    method: 'post',
    data: { clazzId, childIdList }
  })
}

/*
*  早教-班级
* */

/**
 * 获取托育班所有班级（分页）
 * @returns {AxiosPromise}
 */
export function queryTeachNurseriesList({ teacherId, clazzName, lastPositionEnum, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/teach/te_clazz/clazz_page`,
    method: 'get',
    params: { teacherId, clazzName, lastPositionEnum, pageNum, pageSize, paged }
  })
}

/**
 * 创建班级
 * @param data
 * @returns {AxiosPromise}
 */
export function createTeachClasses({ headTeacherId, remark, name }) {
  return request({
    url: `/daycare/teach/te_clazz`,
    method: 'post',
    data: { headTeacherId, remark, name }
  })
}

/**
 * 获取早教班级列表（下拉）
 * @param clazzName
 * @returns {AxiosPromise}
 */
export function queryTeachClasses({ clazzName }) {
  return request({
    url: `/daycare/teach/te_clazz`,
    method: 'get',
    params: { clazzName }
  })
}

/**
 * 获取班级所属学员
 * @param classid
 * @returns {AxiosPromise}
 */
export function queryTeachClassChildren({ clazzId, childName }) {
  return request({
    url: `/daycare/teach/te_clazz/clazz_child`,
    method: 'get',
    params: { clazzId, childName }
  })
}

/**
 * 删除班级
 * @param caeClazzId
 * @returns {AxiosPromise}
 */
export function removeTeachClass({ teClazzId }) {
  return request({
    url: `/daycare/teach/te_clazz/${teClazzId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 更新班级详情
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTeachClassDetail({ teClazzName, headTeacherId, remark, enable, teClazzId }) {
  return request({
    url: `/daycare/teach/te_clazz/${teClazzId}`,
    method: 'put',
    data: { teClazzName, headTeacherId, remark, enable }
  })
}

/**
 * 获取班级详情
 * @param caeClazzId
 * @returns {AxiosPromise}
 */
export function queryTeachClassDetail({ teClazzId }) {
  return request({
    url: `/daycare/teach/te_clazz/${teClazzId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 学员退班
 * @returns {AxiosPromise}
 */
export function getOutTeachClass({ childId, clazzId }) {
  return request({
    url: `/daycare/teach/te_clazz/retreat`,
    method: 'post',
    data: {
      clazzId,
      childId
    }
  })
}

/**
 * 给学员调班
 * @param childIdList
 * @param currentClazzId
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function exchangeTeachClass({ childIdList, currentClazzId, clazzId }) {
  return request({
    url: `/daycare/teach/te_clazz/adjustmente`,
    method: 'post',
    data: { childIdList, currentClazzId, clazzId }
  })
}

// /**
//  * 获取全部幼儿
//  * @returns {AxiosPromise}
//  */
// export function queryAllChildren() {
//   return request({
//     url: `/daycare/child/down_search`,
//     method: 'get',
//     params: {}
//   })
// }

/**
 * 往班级添加学员
 * @param clazzId
 * @param childIdList
 * @returns {AxiosPromise}
 */
export function createJoinTeachChildren({ clazzId, childIdList }) {
  return request({
    url: `/daycare/teach/te_clazz/add_child`,
    method: 'post',
    data: { clazzId, childIdList }
  })
}

/**
 * 查询教室列表
 * @returns {AxiosPromise}
 */
export function queryClassroomList({ roomName }) {
  return request({
    url: `/daycare/room/list`,
    method: 'get',
    params: { roomName }
  })
}
