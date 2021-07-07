// import request from '@/api/newdaycare/mockRequest'
import request from '@/utils/request'

/**
 * 借出管理分页查询
 * @param startDate 借阅开始日期
 * @param endDate 借阅结束日期
 * @param reviewStartDate 审核开始日期
 * @param reviewEndDate 审核结束日期
 * @param borrowingStatus 审核状态查询 TO_BE_CONFIRMED
 TO_BE_CONFIRMED :待确认
 CONFIRMED :已确认
 CANCELLED :已取消
 RETURNED :已归还
 * @param bookManageName 图书名称
 * @param childName 学员名称
 * @param bookLendStatus 借出状态
 TO_BE_CONFIRMED :待确认
 CONFIRMED :已确认
 CANCELLED :已取消
 RETURNED :已归还
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
export function queryBookLendingDetails({ startDate, endDate, reviewStartDate, reviewEndDate, borrowingStatus, bookManageName, childName, bookLendStatus, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/book_lending_details/lend`,
    method: 'get',
    params: { startDate, endDate, reviewStartDate, reviewEndDate, borrowingStatus, bookManageName, childName, bookLendStatus, pageNum, pageSize, paged, sort }
  })
}

/**
 * 获取图书管理
 * @param bookManageId 图书管理 ID
 * @returns {AxiosPromise}
 */
export function queryLibraryDetailPop({ bookManageId }) {
  return request({
    url: `/newdaycare/book_manage/${bookManageId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 根据书刊条码查询信息
 * @param bookBarcode
 * @returns {AxiosPromise}
 */
export function queryGiveBackDetail({ bookBarcode }) {
  return request({
    url: `/newdaycare/book_lending_details/find_barcode/${bookBarcode}`,
    method: 'get',
    params: {}
  })
}

/**
 * 归还图书
 * @param bookLendingDetailsId
 * @param bookBarcode 书刊条码
 * @param storageLocation 入库位置
 * @returns {AxiosPromise}
 */
export function updateGiveBackLibrary({ bookLendingDetailsId, bookBarcode, storageLocation }) {
  return request({
    url: `/newdaycare/book_lending_details/return/${bookLendingDetailsId}`,
    method: 'put',
    data: { bookBarcode, storageLocation }
  })
}

/**
 * 借出图书报损
 * @param bookLendingDetailsId 图书借出明细 ID
 * @returns {AxiosPromise}
 */
export function updateBreakage({ bookLendingDetailsId }) {
  return request({
    url: `/newdaycare/book_lending_details/damaged/${bookLendingDetailsId}`,
    method: 'put',
    data: {}
  })
}

/**
 * 借阅情况 / 详情查询
 * @param bookLendingDetailsId
 * @returns {AxiosPromise}
 */
export function queryRenewalDetail({ bookLendingDetailsId }) {
  return request({
    url: `/newdaycare/book_lending_details/${bookLendingDetailsId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 续借图书
 * @param bookLendingDetailsId
 * @param duration 续借时长
 * @param dateOfExpiry 续后到期
 * @returns {AxiosPromise}
 */
export function updateRenewalDuration({ bookLendingDetailsId, duration, dateOfExpiry }) {
  return request({
    url: `/newdaycare/book_lending_details/renew/${bookLendingDetailsId}`,
    method: 'put',
    data: { duration, dateOfExpiry }
  })
}

/**
 * 根据手机号查询学员信息
 * @param phone
 * @returns {AxiosPromise}
 */
export function childNameByPhone({ phone }) {
  return request({
    url: `/newdaycare/book_lending_details/find_child/${phone}`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增图书借出明细
 * @param bookBarcode 书刊条码
 * @param childId 学员id
 * @param phone 学员电话
 * @param createDate 借阅日期
 * @param duration 借阅时长（月）
 * @param endDate 到期日期
 * @returns {AxiosPromise}
 */
export function createLendRegister({ bookBarcode, childId, phone, createDate, duration, endDate }) {
  return request({
    url: `/newdaycare/book_lending_details`,
    method: 'post',
    data: { bookBarcode, childId, phone, createDate, duration, endDate }
  })
}

/**
 * 借阅情况 / 详情查询
 * @param bookLendingDetailsId
 * @returns {AxiosPromise}
 */
export function queryBorrowDetail({ bookLendingDetailsId }) {
  return request({
    url: `/newdaycare/book_lending_details/${bookLendingDetailsId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 借阅申请状态
 * @param id 图书明细id
 * @returns {AxiosPromise}
 */
export function updateLibraryBorrowStatus({ id }) {
  return request({
    url: `/newdaycare/book_lending_details/application`,
    method: 'put',
    data: { id }
  })
}

/**
 * 查询图书管理列表
 * @param name 图书名称
 * @param bookTypeId 图书分类
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
export function queryLibraryManageList({ name, bookTypeId, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/book_manage`,
    method: 'get',
    params: { name, bookTypeId, pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询库存明细列表
 * @param bookManageName 图书名称
 * @param bookTypeId 图书分类
 * @param bookStatus 状态
 TO_BE_CONFIRMED :待确认
 NOT_LENT :未借出
 LOANED_OUT :已借出
 REPORTED_LOSS :已报损
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
export function queryStoreDetailList({ bookManageName, bookTypeId, bookStatus, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/book_inventory_details`,
    method: 'get',
    params: { bookManageName, bookTypeId, bookStatus, pageNum, pageSize, paged, sort }
  })
}

/**
 * 获取统计数据
 * @returns {AxiosPromise}
 */
export function queryStoreDetailStatistics() {
  return request({
    url: `/newdaycare/book_inventory_details/statistics`,
    method: 'get',
    params: {}
  })
}

/**
 * 查询图书·类型列表
 * @returns {AxiosPromise}
 */
export function queryLibraryManageTypeList() {
  return request({
    url: `/newdaycare/book_type`,
    method: 'get',
    params: {}
  })
}

/**
 * 更新图书管理
 * @param bookManageId
 * @param cover 封面
 * @param coding 编码
 * @param bookNumber 图书ISBN
 * @param bookManageName 名称
 * @param bookTypeId 类型id
 * @param author 作者
 * @param publishingHouse 出版社
 * @param introduction 简介
 * @returns {AxiosPromise}
 */
export function updateBookDetail({ bookManageId, cover, coding, bookNumber, bookManageName, bookTypeId, author, publishingHouse, introduction }) {
  return request({
    url: `/newdaycare/book_manage/${bookManageId}`,
    method: 'put',
    data: { cover, coding, bookNumber, bookManageName, bookTypeId, author, publishingHouse, introduction }
  })
}

/**
 * 入库接口
 * @param bookManageId 图书id
 * @param storageLocation 入库位置
 * @param storageCount 入库数量
 * @returns {AxiosPromise}
 */
export function createStore({ bookManageId, storageLocation, storageCount }) {
  return request({
    url: `/newdaycare/book_manage/warehousing`,
    method: 'post',
    data: { bookManageId, storageLocation, storageCount }
  })
}

/**
 * 删除图书管理
 * @param bookManageId 图书管理 ID
 * @returns {AxiosPromise}
 */
export function removeStore({ bookManageId }) {
  return request({
    url: `/newdaycare/book_manage/${bookManageId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 新增图书管理
 * @param cover 封面
 * @param coding 编码
 * @param bookNumber 图书ISBN
 * @param bookManageName 名称
 * @param bookTypeId 类型id
 * @param author 作者
 * @param publishingHouse 出版社
 * @param storageLocation 入库位置
 * @param storageCount 入库数量
 * @param introduction 简介
 * @returns {AxiosPromise}
 */
export function createLibraryManage({ cover, coding, bookNumber, bookManageName, bookTypeId, author, publishingHouse, storageLocation, storageCount, introduction }) {
  return request({
    url: `/newdaycare/book_manage`,
    method: 'post',
    data: { cover, coding, bookNumber, bookManageName, bookTypeId, author, publishingHouse, storageLocation, storageCount, introduction }
  })
}

/**
 * 删除库存明细
 * @param id 删除书籍id
 * @returns {AxiosPromise}
 */
export function removeStoreDetail({ id }) {
  return request({
    url: `/newdaycare/book_inventory_details`,
    method: 'delete',
    params: { id }
  })
}

/**
 * 获取图书唯一编码
 * @returns {AxiosPromise}
 */
export function autoGenerateCoding() {
  return request({
    url: `/newdaycare/book_manage/coding`,
    method: 'get',
    params: {}
  })
}

/**
 * 更新图书·类型 / 新增 图书类型
 * @param id 图书类型id （传id 则修改 否则增加）
 * @param bookTypeName 图书类型名称
 * @returns {AxiosPromise}
 */
export function createOrUpdateBookType({ id, bookTypeName }) {
  return request({
    url: `/newdaycare/book_type`,
    method: 'put',
    data: { id, bookTypeName }
  })
}

/**
 * 删除图书·类型
 * @param bookTypeId 图书·类型 ID
 * @returns {AxiosPromise}
 */
export function removeBookType({ bookTypeId }) {
  return request({
    url: `/newdaycare/book_type/${bookTypeId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function bookTypeSort({ ids }) {
  return request({
    url: `/newdaycare/book_type/sort`,
    method: 'post',
    data: { ids }
  })
}

/**
 * 查询申请图书借阅日期
 * @param bookBarcode 书刊条码
 * @param childId 学员id
 * @returns {AxiosPromise}
 */
export function queryDuration({ bookBarcode, childId }) {
  return request({
    url: `/newdaycare/book_lending_details/find_borrowing_time`,
    method: 'get',
    params: { bookBarcode, childId }
  })
}

/**
 * 根据姓名查询已成交学员
 * @param childName
 * @returns {AxiosPromise}
 */
export function queryDealChild({ childName }) {
  return request({
    url: `/newdaycare/child/find_deal`,
    method: 'get',
    params: { childName }
  })
}
