import request from '@/utils/request'
import { downloadFile, uploadFileForUrlAndFile } from '@/api/base/base'

/**
 * 查询批次号列表
 * @returns {AxiosPromise}
 */
export function queryBatchNoList() {
  return request({
    url: `/customer/customer_portrait_batch/no`,
    method: 'get'

  })
}

/**
 * 获取指定批次号的批次
 * @param batchNo 批次号
 * @returns {AxiosPromise}
 */
export function queryBatchNo({ batchNo }) {
  return request({
    url: `/customer/customer_portrait_batch/no/${batchNo}`,
    method: 'get'

  })
}

/**
 * 开始碰客
 * @param doTouchTotal 画像数量
 * @param batchId 批次id
 * @returns {AxiosPromise}
 */
export function startAiCrash({ doTouchTotal, batchId }) {
  return request({
    url: `/customer/customer_contact/touch_customer`,
    method: 'post',
    data: { doTouchTotal, batchId }
  })
}

/**
 * 下载模板文件
 * @param template 模板枚举  UN_PORTRAYED_CUSTOMER :待画像客户导入模版
 NOT_DEAL_CUSTOMER :未签单客户导入模板
 * @returns {AxiosPromise}
 */
export function downloadTemplate({ template }) {
  const url = `/customer/template/${template}`
  return downloadFile({
    url: url,
    method: 'get'
  })
}

/**
 * 导入客户画像
 * @returns {AxiosPromise}
 */
export function exportTemplate({ file }) {
  const url = `/customer/customer_portrait/excel`
  return uploadFileForUrlAndFile({
    url,
    file
  })
}

/**
 * 获取AI碰客统计
 * @returns {AxiosPromise}
 */
export function queryAICrashStatistics() {
  return request({
    url: `/customer/customer_contact/touch_customer/statistical`,
    method: 'get'

  })
}
