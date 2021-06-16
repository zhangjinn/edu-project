import request from '@/utils/request'

/**
 * 查询意见反馈表列表
 * @param feedbackType 查询类型
HEADQUARTERS :总部
EMPLOYEE :员工
MINE :我的
PARENT :家长
 * @param enterpriseIdList 园所ids -- 总部查询条件
 * @param feedbackStatus 状态
PENDING :待处理
PROCESSED :已处理
REVOKED :已撤销
 * @param startDate 反馈开始日期
 * @param endDate 反馈结束日期
 * @param confirmStartDate 处理开始日期
 * @param confirmEndDate 处理结束日期
 * @param employeeName 反馈人姓名 --员工反馈
 * @param childName 反馈人姓名 --家长反馈
 * @param areaObject 前端不用传
 * @param employeeId 前端不用传
 * @param type 前端不用传
EMPLOYEE :员工
PARENT :家长
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
export function queryFeedbackList ({ feedbackType, enterpriseIdList, feedbackStatus, startDate, endDate, confirmStartDate, confirmEndDate, employeeName, childName, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/feedback',
    method: 'post',
    data: { feedbackType, enterpriseIdList, feedbackStatus, startDate, endDate, confirmStartDate, confirmEndDate, employeeName, childName, pageNum, pageSize }
  })
}
