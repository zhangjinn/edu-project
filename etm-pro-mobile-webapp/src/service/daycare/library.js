// import request from './mockRequest'
import request from '../http.js'

/**
 * 图书借阅
 * @returns {AxiosPromise}
 */
export function queryBorrowDetail() {
  return request({
    url: `/daycare/book_lending_details/statistics`,
    method: 'get',
    params: {}
  })
}

/**
 * 查询图书·类型列表
 * @returns {AxiosPromise}
 */
export function queryBookType() {
  return request({
    url: `/daycare/book_type`,
    method: 'get',
    params: {}
  })
}

/**
 * 图书管理
 * @param name 图书名称
 * @param bookTypeId 图书分类
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
export function queryLibrary({ name, bookTypeId, sort }) {
  return request({
    url: `/daycare/book_manage/find_all`,
    method: 'get',
    params: { name, bookTypeId, sort }
  })
}

/**
 * 在借图书 / 逾期图书
 * @param name 学员名称
 * @param bookTypeId 图书分类id
 * @param type 图书分类id true 查询正常， false 查询逾期
 * @param borrowingStatus 查询已确认的
 TO_BE_CONFIRMED :待确认
 CONFIRMED :已确认
 CANCELLED :已取消
 RETURNED :已归还
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
export function queryBorrowOrOverdueBook({ name, bookTypeId, type, borrowingStatus, sort }) {
  return request({
    url: `/daycare/book_lending_details/find_all`,
    method: 'get',
    params: { name, bookTypeId, type, borrowingStatus, sort }
  })
}

/**
 * 扫码查询图书借阅详情
 * @param bookBarcode
 * @returns {AxiosPromise}
 */
export function queryScanBorrowBook({ bookBarcode }) {
  return request({
    url: `/daycare/book_lending_details/find_book/${bookBarcode}`,
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
export function updateRenewalBook({ bookLendingDetailsId, duration, dateOfExpiry }) {
  return request({
    url: `/daycare/book_lending_details/renew/${bookLendingDetailsId}`,
    method: 'put',
    data: { duration, dateOfExpiry }
  })
}

/**
 * 扫码借书
 * @param bookBarcode 书刊条码
 * @param childId 学员id
 * @param phone 学员电话
 * @param createDate 借阅日期
 * @param duration 借阅时长（月）
 * @param endDate 到期日期
 * @returns {AxiosPromise}
 */
export function scanQRCodeBorrowBook({ bookBarcode, childId, phone, createDate, duration, endDate }) {
  return request({
    url: `/daycare/book_lending_details/borrow_books`,
    method: 'post',
    data: { bookBarcode, childId, phone, createDate, duration, endDate }
  })
}

/**
 * 根据手机号查询学员信息
 * @param phone
 * @returns {AxiosPromise}
 */
export function queryChildNameByPhone({ phone }) {
  return request({
    url: `/daycare/book_lending_details/find_child/${phone}`,
    method: 'get',
    params: {}
  })
}

/**
 * 借阅申请
 * @returns {AxiosPromise}
 */
export function queryApplicationList() {
  return request({
    url: `/daycare/book_lending_details/loan_application`,
    method: 'get',
    params: {}
  })
}

/**
 * 借阅申请状态
 * @param id 图书明细id
 * @returns {AxiosPromise}
 */
export function updateBorrowStatus({ id }) {
  return request({
    url: `/daycare/book_lending_details/application`,
    method: 'put',
    data: { id }
  })
}

/**
 * 扫码还书
 * @param bookBarcode
 * @returns {AxiosPromise}
 */
export function updateReturnBook({ bookBarcode }) {
  return request({
    url: `/daycare/book_lending_details/return_book/${bookBarcode}`,
    method: 'put',
    data: {}
  })
}
