import request from '@/utils/request'
// import request from '@/api/newDaycare/mockRequest'

/**
 * 渠道类型 -- 查询列表
 * @returns {AxiosPromise}
 */
export function queryChannelTypeList () {
  return request({
    url: '/newdaycare/channel_type',
    method: 'get'

  })
}

/**
 * 渠道类型 -- 新增
 * @param channelTypeName 渠道类型名称
 * @returns {AxiosPromise}
 */
export function createChannelType ({ channelTypeName }) {
  return request({
    url: '/newdaycare/channel_type',
    method: 'post',
    data: { channelTypeName }
  })
}

/**
 * 渠道类型 -- 更新
 * @param channelTypeId
 * @param channelTypeName 渠道类型名称
 * @returns {AxiosPromise}
 */
export function updateChannelType ({ channelTypeId, channelTypeName }) {
  return request({
    url: `/newdaycare/channel_type/${channelTypeId}`,
    method: 'put',
    data: { channelTypeName }
  })
}

/**
 * 渠道类型 -- 删除
 * @param channelTypeId 渠道管理类型 ID
 * @returns {AxiosPromise}
 */
export function removeChannelType ({ channelTypeId }) {
  return request({
    url: `/newdaycare/channel_type/${channelTypeId}`,
    method: 'delete'

  })
}

/**
 * 渠道类型 -- 排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function sortChannelTypeList ({ ids }) {
  return request({
    url: '/newdaycare/channel_type/sort',
    method: 'post',
    data: { ids }
  })
}

/**
 * 渠道 -- 查询列表
 * @param provinceCode 省(地区)
 * @param cityCode 市(地区)
 * @param channelName 渠道名称
 * @param channelTypeId 渠道类型, INT
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
export function queryChannelList ({ provinceCode, cityCode, name, channelTypeId, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/newdaycare/channel',
    method: 'get',
    params: { provinceCode, cityCode, name, channelTypeId, pageNum, pageSize, paged, sort }
  })
}

/**
 * 渠道 -- 新增
 * @param channelName 渠道名称
 * @param channelTypeId 渠道类型, INT
 * @param employeeId 渠道负责人
 * @param telephone 联系电话
 * @param provinceCode 省(地区)
 * @param cityCode 市(地区)
 * @param remark 备注
 * @returns {AxiosPromise}
 */
export function createChannel ({ channelName, channelTypeId, employeeId, channelPeople, telephone, provinceCode, cityCode, remark }) {
  return request({
    url: '/newdaycare/channel',
    method: 'post',
    data: { channelName, channelTypeId, employeeId, telephone, provinceCode, channelPeople, cityCode, remark }
  })
}

/**
 * 渠道 -- 更新
 * @param channelId
 * @param channelName 渠道名称
 * @param channelTypeId 渠道类型
 * @param employeeId 渠道负责人
 * @param telephone 联系电话
 * @param provinceCode 省(地区)
 * @param cityCode 市(地区)
 * @param remark 备注
 * @returns {AxiosPromise}
 */
export function updateChannel ({ channelId, channelName, channelTypeId, channelPeople, employeeId, telephone, provinceCode, cityCode, remark }) {
  return request({
    url: `/newdaycare/channel/${channelId}`,
    method: 'put',
    data: { channelName, channelTypeId, employeeId, telephone, provinceCode, channelPeople, cityCode, remark }
  })
}

/**
 * 渠道 -- 删除
 * @param channelId 渠道管理 ID
 * @returns {AxiosPromise}
 */
export function removeChannel ({ channelId }) {
  return request({
    url: `/newdaycare/channel/${channelId}`,
    method: 'delete'

  })
}

/**
 * 渠道 -- 获取详情
 * @param channelId 渠道管理 ID
 * @returns {AxiosPromise}
 */
export function queryChannel ({ channelId }) {
  return request({
    url: `/newdaycare/channel/${channelId}`,
    method: 'get'

  })
}

/**
 * 查询员工列表
 * @param organizationId 组织的ID
 * @param positionId 岗位的ID，岗位ID不为空时会根据岗位ID进行查询
 * @param recursiveSearch 是否递归查询
 true：查询指定组织（和子孙组织）或岗位（和子孙岗位）下的员工
 false：则查询指定组织或岗位下的员工
 默认为true
 * @param keyword 筛选的关键词
 支持员工姓名和员工手机号码模糊查询
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryEmployeeList ({ organizationId, positionId, recursiveSearch, keyword, pageNum, pageSize, paged }) {
  return request({
    url: '/basic/v2/employee',
    method: 'get',
    params: { organizationId, positionId, recursiveSearch, keyword, pageNum, pageSize, paged }
  })
}

/**
 * 查询地区详情
 * @param code 地区编码
 * @returns {AxiosPromise}
 */
export function queryAreaByCode ({ code }) {
  return request({
    url: `/basic/area/${code}`,
    method: 'get'

  })
}
