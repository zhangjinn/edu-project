import request from '@/utils/request'

// import request from '@/api/newdaycare/mockRequest'

/**
 * 查询客户名单列表并分页
 * @param customerName 学员姓名
 * @param parentName 联系人姓名
 * @param parentPhone 联系人手机号码
 * @param sources 学员来源
 EVALUATION :观测
 * @param status 状态
 IMPORTED :已导入
 NOT_IMPORTED :未导入
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
export function queryCustomerOrderList({ customerName, parentName, parentPhone, sources, status, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/customer/page`,
    method: 'get',
    params: {
      customerName,
      parentName,
      parentPhone,
      sources,
      status,
      pageNum,
      pageSize,
      paged,
      sort
    }
  })
}

export function getCustomerOrderDetail({ customerId }) {
  return request({
    url: `/newdaycare/customer/${customerId}`,
    method: 'get'

  })
}

export function updateCustomerDetail({ customerId, customerName, parentName, parentPhone, gender, birthday, sources }) {
  return request({
    url: `/newdaycare/customer/${customerId}`,
    method: 'put',
    data: {
      customerName,
      parentName,
      parentPhone,
      gender,
      birthday,
      sources
    }
  })
}

/**
 * 导入客户名单
 * @param idList 学员id的列表
 * @returns {AxiosPromise}
 */
export function importCustomer({ idList }) {
  return request({
    url: `/newdaycare/customer/import`,
    method: 'post',
    data: { idList }
  })
}

