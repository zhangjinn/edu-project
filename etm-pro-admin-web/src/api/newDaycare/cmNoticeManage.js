// import request from '@/api/newdaycare/mockRequest'
import request from '@/utils/request'

/**
 * 查询通知列表
 * @param notificationTitle 发布内容
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
export function queryNotificationList({ notificationTitle, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/notice`,
    method: 'get',
    params: { notificationTitle, pageNum, pageSize, paged, sort }
  })
}

/**
 * 删除通知
 * @param noticeId 通知 ID
 * @returns {AxiosPromise}
 */
export function removeNotification({ noticeId }) {
  return request({
    url: `/newdaycare/notice/${noticeId}`,
    method: 'delete',
    params: {}
  })
}

/**
 * 通知详情接口/pc端预览
 * @param noticeId
 * @returns {AxiosPromise}
 */
export function queryPreview({ noticeId }) {
  return request({
    url: `/newdaycare/notice/details/${noticeId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 发布通知接口
 * @param noticeId 通知 ID
 * @returns {AxiosPromise}
 */
export function updateNotification({ noticeId }) {
  return request({
    url: `/newdaycare/notice/release_notice/${noticeId}`,
    method: 'put',
    data: {}
  })
}

/**
 * 查询全部课程
 * @returns {AxiosPromise}
 */
export function queryAllLesson() {
  return request({
    url: `/newdaycare/notice/find_course`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增通知
 * @param notificationTitle 通知标题
 * @param notificationContent 通知内容
 * @param authorizationDTOList 发布范围
 * @param postStatus 发布状态
 * @returns {AxiosPromise}
 */
export function createNewNotification({ notificationTitle, notificationContent, authorizationDTOList, postStatus }) {
  return request({
    url: `/newdaycare/notice`,
    method: 'post',
    data: { notificationTitle, notificationContent, authorizationDTOList, postStatus }
  })
}

/**
 * 通知详情接口 --》 重构
 * @param noticeId 通知 ID
 * @returns {AxiosPromise}
 */
export function getNotification({ noticeId }) {
  return request({
    url: `/newdaycare/notice/${noticeId}`,
    method: 'get'

  })
}

/**
 * 更新通知
 * @param noticeId
 * @param notificationTitle 通知标题
 * @param notificationContent 通知内容
 * @param dynamicReleaseScopeDTOList 发布范围
 * @param postStatus 发布状态
 * @returns {AxiosPromise}
 */
export function updateNotificationEdit({ noticeId, notificationTitle, notificationContent, dynamicReleaseScopeDTOList, postStatus }) {
  return request({
    url: `/newdaycare/notice/${noticeId}`,
    method: 'put',
    data: { notificationTitle, notificationContent, dynamicReleaseScopeDTOList, postStatus }
  })
}

/**
 * 阅读统计 true 已读 false 未读
 * @param noticeId 通知 ID
 * @returns {AxiosPromise}
 */
export function queryReadCount({ noticeId }) {
  return request({
    url: `/newdaycare/notice/reading_statistics/${noticeId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 查询通知是否发布
 * @param noticeId 更新实体对象
 * @returns {AxiosPromise}
 */
export function queryIsNotification({ noticeId }) {
  return request({
    url: `/newdaycare/notice/release_or_not/${noticeId}`,
    method: 'get',
    params: {}
  })
}
