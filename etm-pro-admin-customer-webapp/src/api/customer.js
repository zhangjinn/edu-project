import request from '@/utils/request'
import { uploadFileForUrlAndFile } from '@/api/base/base'
/**
 * 客户成交记录 查询
 * @param orderNo 单号
 * @param customerName 客户名称
 * @param startDate 签单开始时间 例如  2020-01-01 00:00:00
 * @param endDate 签单结束时间 例如 2020-01-01 23:59:59
 * @param customerId 客户ids -- 前端不用传
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function queryDealRecord ({ orderNo, customerName, startDate, endDate, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/customer/order',
    method: 'get',
    params: { orderNo, customerName, startDate, endDate, pageNum, pageSize, paged, sort }
  })
}

/**
 * 客户成交记录 详情
 * @param orderId 客户订单表 ID
 * @returns {AxiosPromise}
 */
export function queryDealRecordDetail (orderId) {
  return request({
    url: `/customer/order/${orderId}`,
    method: 'get'

  })
}

/**
 * 客户成交记录  统计
 * @returns {AxiosPromise}
 */
export function queryDealTotal () {
  return request({
    url: '/customer/order/statistics',
    method: 'get'

  })
}

/**
 * 导入批次列表
 * @param batchCode 批次号
 * @param cancel 是否已撤销
 * @param startTime 操作开始时间
 * @param endTime 操作结束时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @returns {AxiosPromise}
 */
export function queryImportBatchList ({ batchCode, cancel, startTime, endTime, pageNum, pageSize }) {
  return request({
    url: '/customer/customer/import/batch',
    method: 'get',
    params: { batchCode, cancel, startTime, endTime, pageNum, pageSize }
  })
}

/**
 * 分配批次列表
 * @param batchCode 批次号
 * @param cancel 是否已撤销
 * @param startTime 操作开始时间
 * @param endTime 操作结束时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @returns {AxiosPromise}
 */
export function queryAssignBatchList ({ batchCode, cancel, startTime, endTime, pageNum, pageSize }) {
  return request({
    url: '/customer/customer/assign/batch',
    method: 'get',
    params: { batchCode, cancel, startTime, endTime, pageNum, pageSize }
  })
}

/**
 * 分配批次详情
 * @param id 批次id
 * @returns {AxiosPromise}
 */
export function queryAssignDetail (id) {
  return request({
    url: `/customer/customer/assign/batch/${id}`,
    method: 'get'

  })
}

/**
 * 导入批次详情
 * @param batchId 批次号
 * @returns {AxiosPromise}
 */
export function queryImportDetail (batchId) {
  return request({
    url: `/customer/customer/import/batch/${batchId}`,
    method: 'get'
  })
}

/**
 * 撤销导入
 * @param batchId 批次id
 * @returns {AxiosPromise}
 */
export function createImportRevoke (batchId) {
  return request({
    url: '/customer/customer/import/revoke',
    method: 'post',
    data: { batchId }
  })
}

/**
 * 撤销分配
 * @param batchId 批次id
 * @returns {AxiosPromise}
 */
export function createAssignRevoke (batchId) {
  return request({
    url: '/customer/customer/assign/revoke',
    method: 'post',
    data: { batchId }
  })
}

/**
 * 查询产品类型列表
 * @returns {AxiosPromise}
 */
export function queryProductType () {
  return request({
    url: '/customer/product_type',
    method: 'get'

  })
}

/**
 * 查询产品目录列表 不分页
 * @param name 产品名称
 * @param productTypeId 产品类型id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function queryProduct ({ name, productTypeId }) {
  return request({
    url: '/customer/product/find_list',
    method: 'get',
    params: { name, productTypeId }
  })
}

/**
 * 查询客户列表
 * @param op 条件关系 AND OR
 * @param deal 是否成交列表
 * @param paged 是否分页
 默认为true
 * @param quickFindType 快捷筛选类型
 * @param pool 是否公海列表
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param minFollowTime 跟进时间筛选最小值
 * @param items 条件集合
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param maxFollowTime 跟进时间筛选最大值
 * @returns {AxiosPromise}
 */
export function queryCustomerLists ({ deal, paged, quickFindType, pool, pageSize, minFollowTime, items, pageNum, maxFollowTime }) {
  return request({
    url: '/customer/customer/v2/list',
    method: 'post',
    data: { deal, paged, quickFindType, pool, pageSize, minFollowTime, items, pageNum, maxFollowTime }
  })
}

/**
 * 获取员工客户列表显示设置
 * @param pool 是否公海
 * @returns {AxiosPromise}
 */
export function queryDisableSetting (pool) {
  return request({
    url: '/customer/customer/v2/employee_header',
    method: 'get',
    params: { pool }
  })
}

/**
 * 保存员工客户列表显示设置
 * @param keys undefined
 * @returns {AxiosPromise}
 */
export function createFieldSetting (keys) {
  return request({
    url: '/customer/customer/v2/employee_header',
    method: 'post',
    data: { keys }
  })
}

/**
 * 分配
 * @param employeeIds 选中分配的员工id列表
 * @param employeeIdsAndCount 分配员工id与分配数量的键值对
 * @param batchCode 批次号
 * @param assignType 分配方式:0-平均，1-追加，2-重新，3-取消
 * @param customerIds 选中分配的客户id列表
 * @returns {AxiosPromise}
 */
export function createAssignCustomer ({ employeeIds, employeeIdsAndCount, batchCode, assignType, customerIds }) {
  return request({
    url: '/customer/customer/assign',
    method: 'post',
    data: { employeeIds, employeeIdsAndCount, batchCode, assignType, customerIds }
  })
}

/**
 * 放弃客户
 * @param customerIds 客户Id集合
 * @returns {AxiosPromise}
 */
export function giveUpCustomer (customerIds) {
  return request({
    url: '/customer/customer/abandon',
    method: 'post',
    data: { customerIds }
  })
}

/**
 *
 * @param customerIds 客户id集合
 * @returns {AxiosPromise}
 */
export function removeCustomer (customerIds) {
  return request({
    url: '/customer/customer/',
    method: 'delete',
    data: { customerIds }
  })
}

/**
 * 新增客户订单表
 * @param orderNo 单号
 * @param customerId 客户id
 * @param customerName 客户名称
 * @param amount 订单总金额
 * @param orderItemList 产品
 * @param remarks 备注
 * @param annex 附件
 * @returns {AxiosPromise}
 */
export function createCustomerOrder ({ orderNo, customerId, customerName, amount, orderItemList, remarks, annex }) {
  return request({
    url: '/customer/order',
    method: 'post',
    data: { orderNo, customerId, customerName, amount, orderItemList, remarks, annex }
  })
}

/**
 * 测试报错
 * @param customerIds 客户id集合
 * @returns {AxiosPromise}
 */
export function createGiveUpCustomer (customerIds) {
  return request({
    url: '/customer/customer/acquire',
    method: 'post',
    data: { customerIds }
  })
}

/**
 * 获取客户列表筛选字段
 * @returns {AxiosPromise}
 */
export function queryCoutomerFields () {
  return request({
    url: '/customer/customer/v2/list/search_fields',
    method: 'get'

  })
}

/**
 * 保存客户
 * @param birthday 生日
 * @param qq QQ
 * @param address 详细地址
 * @param gender 性别
 * @param city 市地区编码
 * @param customFields 自定义字段
 * @param wechat 微信号
 * @param importantLevel 重要程度
 * @param telephone 客户手机号码
 * @param avatar 头像
 * @param source 来源
 * @param currentOrganizationId 用于导入 传入当前企业id
 * @param marketer 市场人员
 * @param counselor 跟进人员
 * @param currentEmployeeId 用于导入 传入当前员工id
 * @param province 省地区编码
 * @param name 客户名称
 * @param state 客户状态
 * @param region 区地区编码
 * @param contacts 联系人
 * @param mark 标签
 * @returns {AxiosPromise}
 */
export function createCustomer ({ deal, birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }) {
  return request({
    url: '/customer/customer/v2',
    method: 'post',
    data: { deal, birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }
  })
}

/**
 * 查询客户详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryCustomerDetail (id) {
  return request({
    url: `/customer/customer/v2/${id}`,
    method: 'get'

  })
}

/**
 * 获取应用设置系统字段选项
 * @param settingType 系统字段应用设置类型  MARK :客户标签
 NOT_DEAL_STATE :未成交客户状态
 DEAL_STATE :已成交客户状态
 RELATIONSHIP :联系人称呼
 SOURCE :来源
 IMPORTANT_LEVEL :重要程度
 SALES_STAGE :销售阶段
 FOLLOW_WAY :跟进方式
 * @returns {AxiosPromise}
 */
export function querySettingType (settingType) {
  return request({
    url: '/customer/customer/v2/setting',
    method: 'get',
    params: { settingType }
  })
}

/**
 * 更新客户
 * @param id
 * @param birthday 生日
 * @param qq QQ
 * @param address 详细地址
 * @param gender 性别
 * @param city 市地区编码
 * @param customFields 自定义字段
 * @param wechat 微信号
 * @param importantLevel 重要程度
 * @param telephone 客户手机号码
 * @param remark 备注
 * @param avatar 头像
 * @param source 来源
 * @param currentOrganizationId 用于导入 传入当前企业id
 * @param marketer 市场人员
 * @param counselor 跟进人员
 * @param currentEmployeeId 用于导入 传入当前员工id
 * @param province 省地区编码
 * @param name 客户名称
 * @param state 客户状态
 * @param region 区地区编码
 * @param contacts 联系人
 * @param mark 标签
 * @returns {AxiosPromise}
 */
export function updateCustomer ({ id, birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, remark, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }) {
  return request({
    url: `/customer/customer/v2/${id}`,
    method: 'put',
    data: { birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, remark, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }
  })
}

/**
 * 查询客户的通话记录
 * @param customerId 客户id
 * @param startDate 通话时间筛选开始时间
 * @param endDate 通话时间筛选结束时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryCallLog ({ customerId, startDate, endDate, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/new_follow/communication/call/record/by_customer',
    method: 'get',
    params: { customerId, startDate, endDate, pageNum, pageSize, paged }
  })
}

/**
 * 查询客户的短信记录
 * @param customerId 客户id
 * @param minSendTime 最早的发送时间
 * @param maxSendTime 最晚的发送时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryMessageLog ({ customerId, minSendTime, maxSendTime, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/new_follow/communication/sms/record/by_customer',
    method: 'get',
    params: { customerId, minSendTime, maxSendTime, pageNum, pageSize, paged }
  })
}

/**
 * 获取客户列表今天待跟进，今天已跟进，无跟进计划总数
 * @param op 条件关系 AND OR
 * @param deal 是否成交列表
 * @param paged 是否分页
 默认为true
 * @param quickFindType 快捷筛选类型
 * @param pool 是否公海列表
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param minFollowTime 跟进时间筛选最小值
 * @param items 条件集合
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param maxFollowTime 跟进时间筛选最大值
 * @returns {AxiosPromise}
 */
export function createFollowTotal ({ op, deal, paged, quickFindType, pool, pageSize, minFollowTime, items, pageNum, maxFollowTime }) {
  return request({
    url: '/customer/customer/v2/list/follow_count',
    method: 'post',
    data: { op, deal, paged, quickFindType, pool, pageSize, minFollowTime, items, pageNum, maxFollowTime }
  })
}

/**
 * 查询跟进记录
 * @param customerId 客户id
 * @param customerName 客户名称
 * @param followWay 跟进方式
 * @param operator 跟进人
 * @param followTime 跟进时间
 * @param nextFollowTime 下次跟进时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryFollowLog ({ customerId, customerName, followWay, operator, followTime, nextFollowTime, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/follow/v2/list',
    method: 'get',
    params: { customerId, customerName, followWay, operator, followTime, nextFollowTime, pageNum, pageSize, paged }
  })
}

/**
 * 获取客户订单
 * @param customerId 客户 ID
 * @returns {AxiosPromise}
 */
export function queryDealLog (customerId) {
  return request({
    url: `/customer/order/find_customer/${customerId}`,
    method: 'get'

  })
}

/**
 * 获取跟进规则列表
 * @returns {AxiosPromise}
 */
export function queryChoiceTem () {
  return request({
    url: '/customer/follow/v2/rule',
    method: 'get'

  })
}

/**
 * 查询跟进模版列表
 * @param keyWord 查询条件字段
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryFollowTemplate ({ keyWord, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/follow/v2/setting/content_template',
    method: 'get',
    params: { keyWord, pageNum, pageSize, paged }
  })
}

/**
 * 保存跟进
 * @param followContent 跟进内容
 * @param followImg 跟进图片
 * @param nextFollowTime 下次跟进时间
 * @param customerId 客户id
 * @param followWay 跟进方式
 * @param customerSalesStage 客户销售阶段
 * @param bookExperienceTime 预约体验时间
 * @param customerMark 客户标签
 * @param customerImportantLevel 客户重要程度
 * @returns {AxiosPromise}
 */
export function createFollowSave ({ followContent, followImg, nextFollowTime, customerId, followWay, customerSalesStage, bookExperienceTime, customerMark, customerImportantLevel }) {
  return request({
    url: '/customer/follow/v2',
    method: 'post',
    data: { followContent, followImg, nextFollowTime, customerId, followWay, customerSalesStage, bookExperienceTime, customerMark, customerImportantLevel }
  })
}

/**
 * 获取跟进记录列表本日跟进，本周跟进，本月跟进总数
 * @returns {AxiosPromise}
 */
export function queryFollowTotal () {
  return request({
    url: '/customer/follow/v2/list/follow_count',
    method: 'get'

  })
}

/**
 * 获取客户加密信息规则列表
 * @returns {AxiosPromise}
 */
export function queryPassFields () {
  return request({
    url: '/customer/customer/v2/info_encrypt_rule',
    method: 'get'

  })
}

/**
 * 给客户打电话
 * @param customerId 客户id
 * @param phone 拨打的电话
 * @returns {AxiosPromise}
 */
export function createCall ({ customerId, phone }) {
  return request({
    url: '/customer/new_follow/communication/call/do_call',
    method: 'post',
    data: { customerId, phone }
  })
}

/**
 * 查询短信模版列表
 * @param keyword 关键字查询
 支持名称和内容的模糊匹配
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySmsTemplate ({ keyword, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/new_follow/communication/sms/template',
    method: 'get',
    params: { keyword, pageNum, pageSize, paged }
  })
}

/**
 * 发短信
 * @param customerId 客户id
 * @param telephoneList undefined
 * @param content undefined
 * @returns {AxiosPromise}
 */
export function createSms ({ customerId, telephoneList, content }) {
  return request({
    url: '/customer/new_follow/communication/sms/send',
    method: 'post',
    data: { customerId, telephoneList, content }
  })
}

/**
 * 获取跟进详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryFollowDetail (id) {
  return request({
    url: `/customer/follow/v2/${id}`,
    method: 'get'

  })
}

/**
 * 获取自定义字段列表
 * @returns {AxiosPromise}
 */
export function queryCustomerFields () {
  return request({
    url: '/customer/customer/v2/custom_fields',
    method: 'get'

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
 * 查询字段列表
 * @returns {AxiosPromise}
 */
export function queryFollowCustomFields () {
  return request({
    url: '/customer/new_follow/dict_type',
    method: 'get'

  })
}

/**
 * 获取跟进规则列表
 * @returns {AxiosPromise}
 */
export function queryFollowRule () {
  return request({
    url: '/customer/follow/v2/rule',
    method: 'get'

  })
}

export function importCustomerImport (file, options) {
  const url = '/customer/customer/v2/import'
  return uploadFileForUrlAndFile({ url, file, options })
}
