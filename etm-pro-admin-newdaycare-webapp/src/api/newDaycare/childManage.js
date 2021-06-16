import request from '@/utils/request'
// import _request from '@/api/newdaycare/mockRequest'
import { uploadFileForUrlAndFile } from '@/api/base/base'

/**
 * 根据学员状态查询搜索条件
 * @param category {String} ' UNSOLD :未成交学员, DEAL :已成交, HISTORY :历史学员, PUBLIC_POOL :公海'
 * @returns {AxiosPromise}
 */
export function queryFields ({ category }) {
  return request({
    url: '/newdaycare/child/search_field',
    method: 'post',
    data: { category }
  })
}

/**
 * 获取学员列表
 * @param category {string} 分类
 * @param fieldList {array<Object>} 筛选条件
 * @param quickScreening
 * @param pageSize {number} 分页
 * @param pageNum {number} 分页
 * @returns {AxiosPromise}
 */
export function queryChildList ({ category, fieldList, quickScreening, pageSize, pageNum }) {
  return request({
    url: '/newdaycare/child/advanced_search',
    method: 'post',
    data: { pageSize, pageNum, fieldList, quickScreening, category }
  })
}

/**
 * 分配学员
 * @param batchNo
 * @param childIdList
 * @param followerList
 * @returns {AxiosPromise}
 */
export function createAssignChild ({ batchNo, childIdList, followerList }) {
  return request({
    url: '/newdaycare/assign_batch/item',
    method: 'post',
    data: { batchNo, childIdList, followerList }
  })
}

/**
 * 新增学员
 * @param avatar {string}
 * @param childName {string}
 * @param {Object[]} relationshipList
 * @param {string} relationshipList.personRelationId
 * @param {string} relationshipList.relationshipId
 * @param {string} relationshipList.parentName
 * @param {string} relationshipList.telephone
 * @param gender {string}
 * @param birthday {string}
 * @param areaCode {string}
 * @param address {string}
 * @param qqNumber {string}
 * @param wechatNumber {string}
 * @param followerId {string}
 * @param marketerId {string}
 * @param category {string}
 * @param statusId {string}
 * @param sourceId {string}
 * @param importanceAttrId {string}
 * @param tagIdList {string[]}
 * @returns {AxiosPromise}
 */
export function createChild ({ faceList, remark, avatar, membershipCards, childName, relationshipList, gender, birthday, areaCode, address, qqNumber, wechatNumber, followerId, marketerId, category, statusId, sourceId, importanceAttrId, tagIdList }) {
  return request({
    url: '/newdaycare/child',
    method: 'post',
    data: {
      faceList,
      avatar,
      childName,
      relationshipList,
      gender,
      birthday,
      areaCode,
      remark,
      address,
      qqNumber,
      wechatNumber,
      followerId,
      marketerId,
      category,
      statusId,
      sourceId,
      membershipCards,
      importanceAttrId,
      tagIdList
    }
  })
}

/**
 * 通过学员ID获取学员资料用于显示
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildInfoForDisplay ({ childId }) {
  return request({
    url: `/newdaycare/child/specific/${childId}`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 通过学员ID获取学员资料用于编辑
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildInfoForEdit ({ childId }) {
  return request({
    url: `/newdaycare/child/${childId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 通过学员ID获取学员入园用于编辑
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildAdmission ({ childId }) {
  return request({
    url: `/newdaycare/child/find/admission/${childId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 更新学员
 * @param childId
 * @param avatar
 * @param childName
 * @param relationshipList
 * @param gender
 * @param birthday
 * @param areaCode
 * @param address
 * @param qqNumber
 * @param wechatNumber
 * @param followerId
 * @param marketerId
 * @param category
 * @param statusId
 * @param sourceId
 * @param importanceAttrId
 * @param membershipCards
 * @param tagIdList
 * @returns {AxiosPromise}
 */
export function updateChild ({ faceList, remark, membershipCards, childId, avatar, childName, relationshipList, gender, birthday, areaCode, address, qqNumber, wechatNumber, followerId, marketerId, category, statusId, sourceId, importanceAttrId, tagIdList }) {
  return request({
    url: `/newdaycare/child/${childId}`,
    method: 'put',
    data: {
      faceList,
      avatar,
      membershipCards,
      childName,
      relationshipList,
      gender,
      remark,
      birthday,
      areaCode,
      address,
      qqNumber,
      wechatNumber,
      followerId,
      marketerId,
      category,
      statusId,
      sourceId,
      importanceAttrId,
      tagIdList
    }
  })
}

/**
 * 导入文件上传
 * @param batchNo
 * @param category
 * @param source
 * @param file
 * @returns {AxiosPromise}
 */
export function uploadFileBatchImport ({ file, options }) {
  const url = '/newdaycare/child/excel'
  return uploadFileForUrlAndFile({ url, file, options })
}

/**
 * 通过学员ID获取跟进记录
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildFollowLogList ({ childId }) {
  return request({
    url: `/newdaycare/follow/${childId}`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 通过学员ID获取分配记录
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildAssignLogList ({ childId }) {
  return request({
    url: `/newdaycare/assign_batch/item/child_assign/${childId}`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 通过学员ID和tab类型获取跟进tab栏的对应类型的时间轴数据
 * @param childId
 * @param type 类型 跟进、打电话、发短信、任务 FOLLOW_UP :跟进 PHONE :打电话 TASK :任务 SEND_MESSAGE :发短信
 * @returns {AxiosPromise}
 */
export function queryChildLogsByPanelType ({ childId, type }) {
  return request({
    url: '/newdaycare/follow',
    method: 'get',
    params: { childId, type }
  })
}

/**
 * 新增学员跟进
 * @param childId
 * @param meansId 跟进方式ID
 * @param childImportance
 * @param childStatus
 * @param imageList
 * @param content
 * @param nextFollowTime
 * @param followTime
 * @returns {AxiosPromise}
 */
export function createChildFollow ({ childId, courseManagementMap, visitTime, meansId, childImportance, childStatus, imageList, content, nextFollowTime, followTime }) {
  return request({
    url: '/newdaycare/follow',
    method: 'post',
    data: {
      childId,
      courseManagementMap,
      visitTime,
      meansId,
      childImportance,
      childStatus,
      imageList,
      content,
      nextFollowTime,
      followTime
    }
  })
}

/**
 * 放弃学员
 * @param childId
 * @returns {AxiosPromise}
 */
export function updateChildResourceStatus ({ childIdList }) {
  return request({
    url: '/newdaycare/child/renounce',
    method: 'put',
    data: { childIdList }
  })
}

/**
 * 领取学员
 * @param childId
 * @returns {AxiosPromise}
 */
export function createPullDownChild ({ childId }) {
  return request({
    url: `/newdaycare/assign_batch/receive/${childId}`,
    method: 'post',
    data: { childId }
  })
}

/**
 * 批量删除学员
 * @param childIdList
 * @returns {AxiosPromise} 批量
 */
export function removeChildOnBatch ({ childIdList }) {
  return request({
    url: '/newdaycare/child',
    method: 'delete',
    data: { childIdList }
  })
}

/**
 * 查询学员的早教考勤记录
 * @param childId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceLogListByTeach ({ childId, startDate, endDate }) {
  return request({
    url: '/newdaycare/taattendance/child_taattendance',
    method: 'get',
    params: { childId, startDate, endDate }
  })
}

/**
 * 查询学员的托育考勤记录
 * @param childId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceLogListByCare ({ childId, startDate, endDate }) {
  return request({
    url: '/newdaycare/ca_aattendance/child_caattendance',
    method: 'get',
    params: { childId, startDate, endDate }
  })
}

/**
 * 查询不在公海的学员
 * @param childName
 * @param telephone
 * @returns {AxiosPromise}
 */
export function queryChildNotInPool ({ childName, telephone }) {
  return request({
    url: '/newdaycare/child/not_child_pool',
    method: 'get',
    params: { childName, telephone }
  })
}

/**
 * 查询有课时的学员
 * @param childName
 * @param teClazzId
 * @param courseId
 * @param courseTypeId
 * @returns {AxiosPromise}
 */
export function queryChildHaveCourse ({ childName, teClazzId, courseId, courseTypeId, type }) {
  return request({
    url: '/newdaycare/child/have_course_child',
    method: 'get',
    params: { childName, teClazzId, courseId, courseTypeId, type }
  })
}

/**
 * 查询托育有课时的学员
 * @param childName
 * @param teClazzId
 * @param courseId
 * @param courseTypeId
 * @returns {AxiosPromise}
 */
export function queryCaeChildHaveCourse ({ childName, teClazzId, courseId, courseTypeId, type }) {
  return request({
    url: '/newdaycare/child/have_car_course_child',
    method: 'get',
    params: { childName, teClazzId, courseId, courseTypeId, type }
  })
}

/**
 * 查询学员订单记录详情
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildOrderLog ({ childId }) {
  return request({
    url: `/newdaycare/cac_contract/child/contract_details/${childId}`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 到访记录查询
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryVisit (childId) {
  return request({
    url: `/newdaycare/follow/visit/${childId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 确认到访
 * @param followId
 * @returns {AxiosPromise}
 */
export function updateVisit ({ followId, visits, visitTime }) {
  return request({
    url: `/newdaycare/follow/${followId}`,
    method: 'put',
    data: { visits, visitTime }
  })
}

/**
 * 学员跟进阶段查询
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryFollowPhase (childId) {
  return request({
    url: `/newdaycare/follow/find_follow_phase/${childId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取早教试听列表
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param childId
 * @param timePeriodId
 * @param courseName
 * @param status
 * @returns {AxiosPromise}
 */
export function queryTeachCourse ({ startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }) {
  return request({
    url: '/newdaycare/child_course',
    method: 'get',
    params: { startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }
  })
}

/**
 * 获取托育试听列表
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param childId
 * @param timePeriodId
 * @param courseName
 * @param status
 * @returns {AxiosPromise}
 */
export function queryCareCourse ({ startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }) {
  return request({
    url: '/newdaycare/ca_schild_course/attempt_course',
    method: 'get',
    params: { startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }
  })
}

/**
 * 获取早教上课记录
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryTeachCourseRecord (childId) {
  return request({
    url: `/newdaycare/child_course/${childId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取早教上课记录
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryCareCourseRecord (childId) {
  return request({
    url: `/newdaycare/ca_schild_course/${childId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取早教约课列表
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param childId
 * @param timePeriodId
 * @param courseName
 * @param status
 * @returns {AxiosPromise}
 */
export function queryTeachAppCourseLists ({ startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }) {
  return request({
    url: '/newdaycare/child_course/appointment_course',
    method: 'get',
    params: { startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }
  })
}

/**
 * 获取托育约课列表
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param childId
 * @param timePeriodId
 * @param courseName
 * @param status
 * @returns {AxiosPromise}
 */
export function queryCaseAppCourseLists ({ startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }) {
  return request({
    url: '/newdaycare/ca_schild_course/appointment_course',
    method: 'get',
    params: { startDate, endDate, weekdayList, childId, timePeriodId, courseName, status }
  })
}

/**
 *    添加早教约课
 * @param courseManagementIdList
 * @param childId
 * @returns {AxiosPromise}
 */
export function createTeachApp (courseManagementIdList, childId) {
  return request({
    url: '/newdaycare/child_course/appointment_course',
    method: 'post',
    data: { courseManagementIdList, childId }
  })
}

/**
 *    添加托育约课
 * @param courseManagementIdList
 * @param childId
 * @returns {AxiosPromise}
 */
export function createCareApp (courseManagementIdList, childId) {
  return request({
    url: '/newdaycare/ca_schild_course/appointment_course',
    method: 'post',
    data: { courseManagementIdList, childId }
  })
}

/**
 * 添加早教试听
 * @param courseManagementIdList
 * @param childId
 * @returns {AxiosPromise}
 */
export function createTeachAudi (courseManagementIdList, childId) {
  return request({
    url: '/newdaycare/child_course',
    method: 'post',
    data: { courseManagementIdList, childId }
  })
}

/**
 * 添加早教试听
 * @param courseManagementIdList
 * @param childId
 * @returns {AxiosPromise}
 */
export function createCreaAudi (list, childId) {
  return request({
    url: '/newdaycare/experience',
    // url: `/newdaycare/ca_schild_course`,
    method: 'post',
    data: { list, childId }
  })
}

/**
 * 查询会员卡类型列表
 * @returns {AxiosPromise}
 */
export function queryUserCardType () {
  return request({
    url: '/newdaycare/membership_card_type',
    method: 'get'

  })
}

/**
 * 查询学员的联系人
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryContactsList ({ childId }) {
  return request({
    url: `/newdaycare/child/child_relationship/${childId}`,
    method: 'get'

  })
}

/**
 * 查询托育班级列表,托育试听用
 * @param clazzName 班级名
 * @param dateTime 选定日期
 * @returns {AxiosPromise}
 */
export function queryClazzLists ({ clazzName, dateTime }) {
  return request({
    url: '/newdaycare/care/cae_clazz/experience',
    method: 'get',
    params: { clazzName, dateTime }
  })
}

/**
 * 查询当前账号能访问的班级列表
 * @returns {AxiosPromise}
 */
export function queryKindergarten () {
  return request({
    url: '/newdaycare/guard/educational/clazz/visible',
    method: 'get'

  })
}

/**
 * 通过数据源来添加幼儿
 * @param sourceChildId 数据源的学员id
 * @param clazzId 班级ID
 * @param isLeftBehindChildren 留守儿童
 * @param childName 姓名
 * @param bloodType 血型
 * @param healthCondition 健康状况
 * @param onceSick 曾经患病
 * @param foodAllergyInfo 食物过敏情况
 * @param drugAllergyInfo 药物过敏情况
 * @param isCompleteVaccination 疫苗接种齐全
 * @param isEatByYourself 自己吃饭
 * @param imageList 图片信息
 * @param remarks 备注
 * @param nationality 国籍
 * @param certificateType 证件类型
 * @param certificateNumber 证件号码
 * @param currentAreaCode 现住址地区编码
 * @param currentAddress 现住址详细地址
 * @param householdRegisterAreaCode 户籍所在地地区编码
 * @param birthday 出生日期
 * @param gender 性别
 * @param enrollmentTime 入托日期
 * @param relationshipList 联系人列表
 * @param avatar 头像
 * @returns {AxiosPromise}
 */
export function createKindergarten ({ faceImageList, sourceChildId, clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, relationshipList, avatar }) {
  return request({
    url: '/newdaycare/guard/child/from_source',
    method: 'post',
    data: {
      sourceChildId,
      clazzId,
      faceImageList,
      isLeftBehindChildren,
      childName,
      bloodType,
      healthCondition,
      onceSick,
      foodAllergyInfo,
      drugAllergyInfo,
      isCompleteVaccination,
      isEatByYourself,
      imageList,
      remarks,
      nationality,
      certificateType,
      certificateNumber,
      currentAreaCode,
      currentAddress,
      householdRegisterAreaCode,
      birthday,
      gender,
      enrollmentTime,
      relationshipList,
      avatar
    }
  })
}

/**
 * 获取家长
 * @param phone 家长 电话
 * @returns {AxiosPromise}
 */
export function queryParentInfo (phone) {
  return request({
    url: `/newdaycare/parent/${phone}`,
    method: 'get'

  })
}

/**
 * 查询年级列表
 * @param name 年级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryGradeList ({ name, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/grade',
    method: 'get',
    params: { name, pageNum, pageSize, paged }
  })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param clazzName 班级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryClazzAllLists ({ gradeId, clazzId, clazzName, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/clazz',
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged }
  })
}

/**
 * 查询学员的联系人（返回是kinshipId）
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryCardDetail (childId) {
  return request({
    url: `/newdaycare/child/child_kinship/${childId}`,
    method: 'get'

  })
}
