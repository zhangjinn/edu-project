import request from '@/utils/request'
// import request from '@/api/daycare/mockRequest'
import { downloadFile } from '@/api/base/base'
/**
 * 查询云视频订单列表
 * @param orderNumber 订单编号
 * @param parentName 家长姓名
 * @param parentPhone 家长电话
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryCloudList({ orderNumber, parentName, parentPhone, pageNum, pageSize, paged }) {
  return request({
    url: `/guardcare/device_order`,
    method: 'get',
    params: { orderNumber, parentName, parentPhone, pageNum, pageSize, paged }
  })
}

export function downExcel(params) {
  return downloadFile({
    url: '/guardcare/device_order/export',
    method: 'get',
    params
  })
}
