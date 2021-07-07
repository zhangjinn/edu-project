// import request from './mockRequest'
import request from '../http.js'

/**
 * 查询老师所在全部课程
 * @returns {AxiosPromise}
 */
export function queryTeachAllClazz() {
  return request({
    url: `/daycare/notice/find_course`,
    method: 'get'

  })
}

/**
 * 查询全部通知
 * @param courseId 课程id 如果查询全部 则给 -1
 * @param teachOrCare 课程类型
 TEACH :早教
 CARE :托育
 * @param notificationTitle 标题
 * @param notificationContent 发布内容
 * @param postStatus 发布状态
 PUBLISHED :已发布
 UNPUBLISHED :未发布
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
export function queryNoticeLists({ courseId, teachOrCare, notificationTitle, notificationContent, postStatus, sort }) {
  return request({
    url: `/daycare/notice/find_all_notice`,
    method: 'get',
    params: { courseId, teachOrCare, notificationTitle, notificationContent, postStatus, sort }
  })
}

/**
 * 通知详情接口
 * @param noticeId 通知 ID
 * @returns {AxiosPromise}
 */
export function queryNoticeDetail(noticeId) {
  return request({
    url: `/daycare/notice/${noticeId}`,
    method: 'get'

  })
}

/**
 * 通知详情接口 / pc 预览接口
 * @param noticeId
 * @returns {AxiosPromise}
 */
export function queryNonticeSingeDetail(noticeId) {
  return request({
    url: `/daycare/notice/details/${noticeId}`,
    method: 'get'

  })
}

/**
 * 阅读统计
 * @param noticeId
 * @returns {AxiosPromise}
 */
export function queryReadList(noticeId) {
  return request({
    url: `/daycare/notice/reading/course_statistics/${noticeId}`,
    method: 'get'

  })
}

/**
 * 统计详情接口
 * @param id 阅读 id
 * @param courseId 课程id 当类型为早教时 则课程-班级的形式传过来
 * @param teachOrCare 课程类型
 TEACH :早教
 CARE :托育
 * @returns {AxiosPromise}
 */
export function queryReadDetail({ id, courseId, teachOrCare }) {
  return request({
    url: `/daycare/notice/statistics/details`,
    method: 'get',
    params: { id, courseId, teachOrCare }
  })
}
