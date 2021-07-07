import request from '@/utils/request'
/**
 * 查询员工平均数
 * @param resignStatus 离职状态, true是离职
 * @param employeeName 员工姓名
 * @param telephone 手机号码
 * @param positionId 岗位id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryStaffAverage({ resignStatus, employeeName, telephone, positionId, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/employee_record/average`,
    method: 'get',
    params: { resignStatus, employeeName, telephone, positionId, pageNum, pageSize, paged }
  })
}

/**
 * 查询员工档案列表
 * @param resignStatus 离职状态, true是离职
 * @param employeeName 员工姓名
 * @param telephone 手机号码
 * @param positionId 岗位id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryStaffList({ resignStatus, employeeName, telephone, positionId, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/employee_record`,
    method: 'get',
    params: { resignStatus, employeeName, telephone, positionId, pageNum, pageSize, paged }
  })
}

/**
 * 获取员工档案
 * @param employeeRecordId 员工档案 ID
 * @returns {AxiosPromise}
 */
export function queryStaffDetail({ employeeRecordId }) {
  return request({
    url: `/newdaycare/employee_record/${employeeRecordId}`,
    method: 'get'
  })
}

/**
 * 新增员工档案
 * @param employeeRecordName 姓名
 * @param telephone 联系电话
 * @param avatar 员工照片
 * @param birthday 出生日期
 * @param gender 性别
 * @param certificateNumber 证件号码
 * @param certificateType 证件类型
 * @param hometown 籍贯
 * @param marriage 婚育情况
 * @param hukouType 户口类型
 * @param areaCode 地区编码
 * @param address 家庭地址
 * @param clan 民族
 * @param education 学历
 * @param graduatedSchool 毕业院校
 * @param profession 专业
 * @param positionId 岗位
 * @param vocationalCertificate 职业证书
 * @param professionId 职称
 * @param entryTime 入职时间
 * @param contractStartTime 合同开始时间
 * @param contractEndTime 合同结束时间
 * @param contractType 合同类型
 * @param contractCount 签合同次数
 * @param compilationStatus 编制情况
 * @param remarks 备注
 * @param annex 附件
 * @returns {AxiosPromise}
 */
export function createStaff({ employeeRecordName, telephone, avatar, birthday, gender, certificateNumber, certificateType, hometown, marriage, hukouType, areaCode, address, clan, education, graduatedSchool, profession, positionId, vocationalCertificate, professionId, entryTime, contractStartTime, contractEndTime, contractType, contractCount, compilationStatus, remarks, annex }) {
  return request({
    url: `/newdaycare/employee_record`,
    method: 'post',
    data: { employeeRecordName, telephone, avatar, birthday, gender, certificateNumber, certificateType, hometown, marriage, hukouType, areaCode, address, clan, education, graduatedSchool, profession, positionId, vocationalCertificate, professionId, entryTime, contractStartTime, contractEndTime, contractType, contractCount, compilationStatus, remarks, annex }
  })
}

/**
 * 删除员工档案
 * @param employeeRecordId 员工档案 ID
 * @returns {AxiosPromise}
 */
export function removeStaff({ employeeRecordId }) {
  return request({
    url: `/newdaycare/employee_record/${employeeRecordId}`,
    method: 'delete'
  })
}

/**
 * 更新员工档案
 * @param employeeRecordId
 * @param employeeRecordName 姓名
 * @param telephone 联系电话
 * @param avatar 员工照片
 * @param birthday 出生日期
 * @param gender 性别
 * @param certificateNumber 证件号码
 * @param certificateType 证件类型
 * @param hometown 籍贯
 * @param marriage 婚育情况
 * @param hukouType 户口类型
 * @param areaCode 地区编码
 * @param address 家庭地址
 * @param clan 民族
 * @param education 学历
 * @param graduatedSchool 毕业院校
 * @param profession 专业
 * @param positionId 岗位
 * @param vocationalCertificate 职业证书
 * @param professionId 职称
 * @param entryTime 入职时间
 * @param contractStartTime 合同开始时间
 * @param contractEndTime 合同结束时间
 * @param contractType 合同类型
 * @param contractCount 签合同次数
 * @param compilationStatus 编制情况
 * @param remarks 备注
 * @param annex 附件
 * @returns {AxiosPromise}
 */
export function updateStaff({ employeeRecordId, employeeRecordName, telephone, avatar, birthday, gender, certificateNumber, certificateType, hometown, marriage, hukouType, areaCode, address, clan, education, graduatedSchool, profession, positionId, vocationalCertificate, professionId, entryTime, contractStartTime, contractEndTime, contractType, contractCount, compilationStatus, remarks, annex }) {
  return request({
    url: `/newdaycare/employee_record/${employeeRecordId}`,
    method: 'put',
    data: { employeeRecordName, telephone, avatar, birthday, gender, certificateNumber, certificateType, hometown, marriage, hukouType, areaCode, address, clan, education, graduatedSchool, profession, positionId, vocationalCertificate, professionId, entryTime, contractStartTime, contractEndTime, contractType, contractCount, compilationStatus, remarks, annex }
  })
}

/**
 * 查询岗位职称离职设置列表
 * @param type 设置类型, VARCHAR
 PROFESSION :职称
 POSITION :岗位
 RESIGN :离职原因
 * @returns {AxiosPromise}
 */
export function queryStaffSettingsList({ type }) {
  return request({
    url: `/newdaycare/headquarters_setting`,
    method: 'get',
    params: { type }
  })
}

/**
 * 新增岗位职称离职设置
 * @param headquartersSettingName 设置名
 * @param type 设置类型
 * @returns {AxiosPromise}
 */
export function createSettingTabView({ headquartersSettingName, type }) {
  return request({
    url: `/newdaycare/headquarters_setting`,
    method: 'post',
    data: { headquartersSettingName, type }
  })
}

/**
 * 更新岗位职称离职设置
 * @param headquartersSettingId
 * @param headquartersSettingName 设置名
 * @param type 设置类型
 * @returns {AxiosPromise}
 */
export function updateSettingTabViews({ headquartersSettingId, headquartersSettingName, type }) {
  return request({
    url: `/newdaycare/headquarters_setting/${headquartersSettingId}`,
    method: 'put',
    data: { headquartersSettingName, type }
  })
}

/**
 * 删除岗位职称离职设置
 * @param headquartersSettingId 岗位职称离职设置 ID
 * @returns {AxiosPromise}
 */
export function removeSettingTabViews({ headquartersSettingId }) {
  return request({
    url: `/newdaycare/headquarters_setting/${headquartersSettingId}`,
    method: 'delete'
  })
}

/**
 * 排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function updateSorts({ ids }) {
  return request({
    url: `/newdaycare/headquarters_setting/sort`,
    method: 'post',
    data: { ids }
  })
}

/**
 * 员工离职
 * @param employeeRecordId
 * @param remarks 备注, VARCHAR
 * @param resignId 离职原因, INT
 * @returns {AxiosPromise}
 */
export function updateStaffResign({ employeeRecordId, remarks, resignId }) {
  return request({
    url: `/newdaycare/employee_record/resign/${employeeRecordId}`,
    method: 'put',
    data: { remarks, resignId }
  })
}

/**
 * 从组织架构同步
 * @returns {AxiosPromise}
 */
export function updateOrganization() {
  return request({
    url: `/newdaycare/employee_record/synchronize`,
    method: 'get'
  })
}

