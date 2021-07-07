import request from '@/utils/request'
// import request from '@/api/newdaycare/mockRequest'
import { downloadFile } from '@/api/base/base'

/**
 * 查询云视频订单列表
 * @param orderNo 订单编号
 * @param contactName 联系人姓名
 * @param contactPhone 联系人电话
 * @param childName 学员姓名
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
export function queryCloudVideoOrder({ orderNo, contactName, contactPhone, childName, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/camera_order`,
    method: 'get',
    params: { orderNo, contactName, contactPhone, childName, pageNum, pageSize, paged, sort }
  })
}

/**
 * 获取云视频订单
 * @param cameraOrderId 云视频订单 ID
 * @returns {AxiosPromise}
 */
export function queryCloudVideoOrderDetail({ cameraOrderId }) {
  return request({
    url: `/newdaycare/camera_order/${cameraOrderId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 导出云视频订单列表
 * @param orderNo 订单编号
 * @param contactName 联系人姓名
 * @param contactPhone 联系人电话
 * @param childName 学员姓名
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
export function downExcel({ orderNo, contactName, contactPhone, childName, sort }) {
  return downloadFile({
    url: `/newdaycare/camera_order/export`,
    method: 'post',
    params: { orderNo, contactName, contactPhone, childName, sort }
  })
}

/* ----------------------幼儿园订单---------------------- */

/**
 * 导出云视频订单列表
 * @param orderNumber 订单编号
 * @param parentName 家长姓名
 * @param clazzId 班级id
 * @param parentPhone 家长电话
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function downExcel_child({ orderNumber, parentName, clazzId, parentPhone, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/guard/device_order/export`,
    method: 'get',
    params: { orderNumber, parentName, clazzId, parentPhone, pageNum, pageSize }
  })
}

/**
 * 查询云视频订单列表
 * @param orderNumber 订单编号
 * @param parentName 家长姓名
 * @param clazzId 班级id
 * @param parentPhone 家长电话
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryCloudList({ orderNumber, parentName, clazzId, parentPhone, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/guard/device_order`,
    method: 'get',
    params: { orderNumber, parentName, clazzId, parentPhone, pageNum, pageSize }
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
export function queryClazzList({ gradeId, clazzId, clazzName, pageNum, pageSize, paged = false }) {
  return request({
    url: `/newdaycare/guard/educational/clazz`,
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged }
  })
}
