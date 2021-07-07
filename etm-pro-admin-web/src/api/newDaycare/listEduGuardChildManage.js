import request from '@/utils/request'

/**
 * 查询在园幼儿列表并分页
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param telephone 联系电话
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param clazzId 班级ID
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getEnterChildList({ childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/guard/child/page/in`,
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }
  })
}

/**
 * 批量离园
 * @param childIdList 幼儿的ID列表
 * @param outReason 离园原因
 * @returns {AxiosPromise}
 */
export function childLeave({ childIdList, outReason }) {
  return request({
    url: `/newdaycare/guard/child/departure`,
    method: 'put',
    data: { childIdList, outReason }
  })
}

/**
 * 批量调班
 * @param childIdList 幼儿的ID列表
 * @param clazzId 班级ID
 * @returns {AxiosPromise}
 */
export function clazzAdjust({ childIdList, clazzId }) {
  return request({
    url: `/newdaycare/guard/child/clazz`,
    method: 'put',
    data: { childIdList, clazzId }
  })
}

/**
 * 添加幼儿
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
 * @param contactList 联系人列表
 * @param avatar 头像
 * @returns {AxiosPromise}
 */
export function addChild({ clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar }) {
  return request({
    url: `/newdaycare/guard/child`,
    method: 'post',
    data: { clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar }
  })
}

/**
 * 删除幼儿
 * @param childId
 * @returns {AxiosPromise}
 */
export function deleteChild({ childId }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'delete'

  })
}

/**
 * 查询幼儿详情
 * @param childId
 * @returns {AxiosPromise}
 */
export function getChildDetail({ childId }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'get'

  })
}

/**
 * 修改幼儿
 * @param childId
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
 * @param contactList 联系人列表
 * @param avatar 头像
 * @returns {AxiosPromise}
 */
export function renewChild({ childId, clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'put',
    data: { clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar }
  })
}

/**
 * 查询幼儿考勤列表
 * @param childId 幼儿id
 * @param date 日期（yyyy-MM-dd）
 * @returns {AxiosPromise}
 */
export function getAttendanceList({ childId, date }) {
  return request({
    url: `/newdaycare/guard/attendance/list`,
    method: 'get',
    params: { childId, date }
  })
}

/**
 * 校验幼儿重复
 * @param childName 幼儿姓名
 * @param contactList 联系人列表
 * @returns {AxiosPromise}
 */
export function checkChildRepeat({ childName, contactList }) {
  return request({
    url: `/newdaycare/guard/child/check_child_repeat`,
    method: 'post',
    data: { childName, contactList }
  })
}

/**
 * 校验家长手机号码
 * @param phone 手机号码
 * @returns {AxiosPromise}
 */
export function checkParentPhone({ phone }) {
  return request({
    url: `/newdaycare/parent/${phone}`,
    method: 'get'
  })
}

/**
 * 查询在园幼儿列表
 * @param clazzId 班级ID
 * @param childName 幼儿姓名
 * @returns {AxiosPromise}
 */
export function getChildIn({ clazzId, childName }) {
  return request({
    url: `/newdaycare/guard/child/list/in`,
    method: 'get',
    params: { clazzId, childName }
  })
}

/**
 * 查询幼儿月考勤统计
 * @param childId 幼儿id
 * @param date 日期（后端取该日期所在的月份进行处理）(yyyy-MM-dd)
 * @returns {AxiosPromise}
 */
export function getAttendanceStatistics({ childId, date }) {
  return request({
    url: `/newdaycare/guard/attendance/statistics/child_monthly`,
    method: 'get',
    params: { childId, date }
  })
}

/**
 * 查询幼儿的请假记录列表
 * @param childId 幼儿ID
 * @returns {AxiosPromise}
 */
export function getLeaveList({ childId }) {
  return request({
    url: `/newdaycare/guard/leave_request/list`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 查询幼儿班级轨迹
 * @param childId
 * @returns {AxiosPromise}
 */
export function getclazzRecord({ childId }) {
  return request({
    url: `/newdaycare/guard/child_status_update_record/list`,
    method: 'get',
    params: { childId }
  })
}
