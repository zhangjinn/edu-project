import request from '@/utils/request'
import { downloadFile, uploadFileForUrlAndFile } from '@/api/base/base'

/**
 * 查询年级列表
 * @param name 年级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryGuardGradeList ({ name, pageNum, pageSize, paged }) {
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
export function queryGuardClazzList ({ gradeId, clazzId, clazzName, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/clazz',
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged }
  })
}

/**
 * 查询当前账号能访问的班级列表
 * @returns {AxiosPromise}
 */
export function queryGradeAndClazzList () {
  return request({
    url: '/newdaycare/guard/educational/clazz/visible',
    method: 'get'

  })
}

/**
 * 查询在园幼儿列表
 * @param clazzId 班级ID
 * @param childName 幼儿姓名
 * @returns {AxiosPromise}
 */
export function queryGuardChildList ({ clazzId, childName }) {
  return request({
    url: '/newdaycare/guard/child/list/in',
    method: 'get',
    params: { clazzId, childName }
  })
}

/**
 * 查询待入园幼儿列表并分页
 * @param childName 会员姓名
 * @param parentName 家长姓名
 * @param telephone 联系电话
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryChildPendingList ({ childName, parentName, telephone, startDate, endDate, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/child/page/pending',
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, pageNum, pageSize, paged }
  })
}

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
export function queryChildInList ({ childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/child/page/in',
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }
  })
}

/**
 * 查询退园幼儿列表并分页
 * @param childName 会员姓名
 * @param parentName 家长姓名
 * @param telephone 联系电话
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param outReason 退园原因
 GRADUATION :毕业退园
 TRANSFER :转校退园
 OTHER :其他原因
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryChildOutList ({ childName, parentName, telephone, startDate, endDate, outReason, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/child/page/out',
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, outReason, pageNum, pageSize, paged }
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
 * @param contactList 联系人列表
 * @param avatar 头像
 * @returns {AxiosPromise}
 */
export function createChildBySourceChildId ({ sourceChildId, clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar }) {
  return request({
    url: '/newdaycare/guard/child/from_source',
    method: 'post',
    data: {
      sourceChildId,
      clazzId,
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
      contactList,
      avatar
    }
  })
}

/**
 * 校验家长手机号码
 * @param phone 手机号码
 * @returns {AxiosPromise}
 */
export function createParentPhoneCheck ({ phone }) {
  return request({
    url: `/newdaycare/parent/${phone}`,
    method: 'get'
  })
}

/**
 * 校验幼儿重复
 * @param childName 幼儿姓名
 * @param contactList 联系人列表
 * @returns {AxiosPromise}
 */
export function createChildRepeat ({ childName, contactList }) {
  return request({
    url: '/newdaycare/guard/child/check_child_repeat',
    method: 'post',
    data: { childName, contactList }
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
export function createChild ({ clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar, faceImageList }) {
  return request({
    url: '/newdaycare/guard/child',
    method: 'post',
    data: {
      clazzId,
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
      contactList,
      avatar,
      faceImageList
    }
  })
}

/**
 * 查询幼儿详情
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildById ({ childId }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'get'

  })
}

/**
 * 查询幼儿考勤列表
 * @param childId 幼儿id
 * @param date 日期（yyyy-MM-dd）
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceList ({ childId, date }) {
  return request({
    url: '/newdaycare/guard/attendance/list',
    method: 'get',
    params: { childId, date }
  })
}

/**
 * 查询幼儿月考勤统计
 * @param childId 幼儿id
 * @param date 日期（后端取该日期所在的月份进行处理）(yyyy-MM-dd)
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceStatistics ({ childId, date }) {
  return request({
    url: '/newdaycare/guard/attendance/statistics/child_monthly',
    method: 'get',
    params: { childId, date }
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
export function updateChild ({ childId, clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar, faceImageList }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'put',
    data: {
      clazzId,
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
      contactList,
      avatar,
      faceImageList
    }
  })
}

/**
 * 入园审核
 * @param childId 幼儿ID
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
export function updateChildEnrollmentAudit ({ childId, clazzId, isLeftBehindChildren, childName, bloodType, healthCondition, onceSick, foodAllergyInfo, drugAllergyInfo, isCompleteVaccination, isEatByYourself, imageList, remarks, nationality, certificateType, certificateNumber, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, enrollmentTime, contactList, avatar, faceImageList }) {
  return request({
    url: '/newdaycare/guard/child/enrollment_audit',
    method: 'put',
    data: {
      childId,
      clazzId,
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
      contactList,
      avatar,
      faceImageList
    }
  })
}

/**
 * 批量退园
 * @param childIdList 幼儿的ID列表
 * @param outReason 退园原因
 * @returns {AxiosPromise}
 */
export function updateChildDeparture ({ childIdList, outReason }) {
  return request({
    url: '/newdaycare/guard/child/departure',
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
export function updateChildClazz ({ childIdList, clazzId }) {
  return request({
    url: '/newdaycare/guard/child/clazz',
    method: 'put',
    data: { childIdList, clazzId }
  })
}

/**
 * 删除幼儿
 * @param childId
 * @returns {AxiosPromise}
 */
export function removeChild ({ childId }) {
  return request({
    url: `/newdaycare/guard/child/${childId}`,
    method: 'delete'

  })
}

/**
 * 批量入园
 * @param childIdList 幼儿ID的集合
 * @param clazzId 班级ID
 * @param enrollmentTime 入托日期
 * @returns {AxiosPromise}
 */
export function updateChildAdmission ({ childIdList, clazzId, enrollmentTime }) {
  return request({
    url: '/newdaycare/guard/child/admission',
    method: 'put',
    data: { childIdList, clazzId, enrollmentTime }
  })
}

/**
 * 批量导入
 * @returns {AxiosPromise}
 */
export function createChildImport (data, options) {
  const url = '/newdaycare/guard/child/import'
  return uploadFileForUrlAndFile({ url, file: data, options })
}

/**
 * 导出在园幼儿
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
export function queryChildInExport ({ childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }) {
  const url = '/newdaycare/guard/child/export/in'
  return downloadFile({
    method: 'get',
    url,
    params: { childName, parentName, telephone, startDate, endDate, clazzId, pageNum, pageSize, paged }
  })
}

/**
 * 查询幼儿的接送人列表
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildSurrogate ({ childId }) {
  return request({
    url: '/newdaycare/guard/child/surrogate',
    method: 'get',
    params: { childId }
  })
}

/**
 * 查询幼儿班级轨迹
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryChildCLazzRecord ({ childId }) {
  return request({
    url: '/newdaycare/guard/child_status_update_record/list',
    method: 'get',
    params: { childId }
  })
}

/**
 * 查询幼儿的请假记录列表
 * @param childId 幼儿ID
 * @returns {AxiosPromise}
 */
export function queryChildLeaveList ({ childId }) {
  return request({
    url: '/newdaycare/guard/leave_request/list',
    method: 'get',
    params: { childId }
  })
}

/**
 * 获取导入幼儿模板下载地址
 * @returns {AxiosPromise}
 */
export function queryChildImportTemplate () {
  return request({
    url: '/newdaycare/guard/import_child_batch/template_url',
    method: 'get'

  })
}

/**
 * 查询导入幼儿批次列表并分页
 * @param batchNumber 批次号
 * @param status 批次状态
 NORMAL :正常
 RESCINDED :已撤销
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryImportBatchList ({ batchNumber, status, startTime, endTime, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/import_child_batch/page',
    method: 'get',
    params: { batchNumber, status, startTime, endTime, pageNum, pageSize, paged }
  })
}

/**
 * 撤销导入幼儿批次
 * @param batchId 批次ID
 * @returns {AxiosPromise}
 */
export function updateChildImportRevoke ({ batchId }) {
  return request({
    url: '/newdaycare/guard/import_child_batch/revoke',
    method: 'put',
    data: { batchId }
  })
}

/**
 * 查询导入幼儿批次
 * @param batchId
 * @returns {AxiosPromise}
 */
export function queryImportBatchById ({ batchId }) {
  return request({
    url: `/newdaycare/guard/import_child_batch/${batchId}`,
    method: 'get'

  })
}

/**
 * 修改新生报名通知
 * @param noticeTitle 报名通知标题
 * @param noticeContent 报名通知内容
 * @returns {AxiosPromise}
 */
export function updateChildRegistration ({ noticeTitle, noticeContent }) {
  return request({
    url: '/newdaycare/guard/registration_settings',
    method: 'put',
    params: { noticeTitle, noticeContent }
  })
}

/**
 * 获取新生报名通知
 * @returns {AxiosPromise}
 */
export function queryChildRegistration () {
  return request({
    url: '/newdaycare/guard/registration_settings',
    method: 'get'

  })
}

/**
 * 获取C端的报名的入口地址
 * @returns {AxiosPromise}
 */
export function queryChildRegistrationUrl () {
  return request({
    url: '/newdaycare/guard/registration_settings/client_registration_url',
    method: 'get'

  })
}

/**
 * 查询幼儿的家长列表并分页
 * @param childId 幼儿id
 * @returns {AxiosPromise}
 */
export function queryChildParantList ({ childId }) {
  return request({
    url: '/newdaycare/guard/parent/page',
    method: 'get',
    params: { childId }
  })
}

/**
 * 查询家长
 * @param parentId 家长id
 * @param childId 幼儿id
 * @returns {AxiosPromise}
 */
export function queryChildParent ({ parentId, childId }) {
  return request({
    url: '/newdaycare/guard/parent',
    method: 'get',
    params: { parentId, childId }
  })
}

/**
 * 修改家长
 * @param parentId 家长id
 * @param childId 幼儿id
 * @param telephone 手机号码
 * @param attendanceCardNumber 考勤卡卡号
 * @param avatar 头像
 * @returns {AxiosPromise}
 */
export function updateChildParent ({ parentId, childId, telephone, attendanceCardNumber, avatar }) {
  return request({
    url: '/newdaycare/guard/parent',
    method: 'put',
    data: { parentId, childId, telephone, attendanceCardNumber, avatar }
  })
}

/**
 * 解绑考勤卡
 * @param parentId 家长id
 * @param childId 幼儿id
 * @returns {AxiosPromise}
 */
export function updateParentAttendanceNumber ({ parentId, childId }) {
  return request({
    url: '/newdaycare/guard/parent/un_bundling_attendance_card_number',
    method: 'put',
    data: { parentId, childId }
  })
}

/**
 * 预收订金
 * @param orderNo 订金单号
 * @param money 金额
 * @param paymentType 支付方式
 * @param childId 幼儿id
 * @param remark 备注
 * @param dateCharge 收费日期
 * @returns {AxiosPromise}
 */
export function createGuardDeposit ({ orderNo, money, paymentType, childId, remark, dateCharge }) {
  return request({
    url: '/newdaycare/guard/child/earnest_money',
    method: 'post',
    data: { orderNo, money, paymentType, childId, remark, dateCharge }
  })
}

/**
 * 查询预备生列表并分页
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param telephone 联系电话
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryGuardPreparetoryList ({ childName, parentName, telephone, startDate, endDate, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/child/page/preparatory',
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, pageNum, pageSize, paged }
  })
}

/**
 * 查询预备生详情
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryGuardPreparatoryById ({ childId }) {
  return request({
    url: `/newdaycare/guard/child/${childId}/preparatory`,
    method: 'get'

  })
}

/**
 * 保存预备生
 * @param childName 姓名
 * @param currentAreaCode 现住址地区编码
 * @param currentAddress 现住址详细地址
 * @param householdRegisterAreaCode 户籍所在地地区编码
 * @param birthday 出生日期
 * @param gender 性别
 * @param contactList 联系人列表
 * @param faceImageList 脸部图片列表
 * @param earnestMoney 订金
 * @returns {AxiosPromise}
 */
export function createGuardPreparatory ({ childName, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, contactList, faceImageList, earnestMoney }) {
  return request({
    url: '/newdaycare/guard/child/preparatory',
    method: 'post',
    data: { childName, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, contactList, faceImageList, earnestMoney }
  })
}

/**
 * 修改预备生
 * @param childId
 * @param childName 姓名
 * @param currentAreaCode 现住址地区编码
 * @param currentAddress 现住址详细地址
 * @param householdRegisterAreaCode 户籍所在地地区编码
 * @param birthday 出生日期
 * @param gender 性别
 * @param contactList 联系人列表
 * @param faceImageList 脸部图片列表
 * @returns {AxiosPromise}
 */
export function updateGuardPreparatory ({ childId, childName, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, contactList, faceImageList }) {
  return request({
    url: `/newdaycare/guard/child/${childId}/preparatory`,
    method: 'put',
    data: { childName, currentAreaCode, currentAddress, householdRegisterAreaCode, birthday, gender, contactList, faceImageList }
  })
}

/**
 * 查询全部幼儿列表并分页
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param telephone 联系电话
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param status 状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :退园
 DELETED :已删除
 PREPARATORY_STUDENT :预备生
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryAllGuardChild ({ childName, parentName, telephone, startDate, endDate, status, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/child/page/all',
    method: 'get',
    params: { childName, parentName, telephone, startDate, endDate, status, pageNum, pageSize, paged }
  })
}
