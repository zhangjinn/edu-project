import request from '@/utils/request'
import { getToken, removeAllInfo } from '@/utils/auth'
import Axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})
axios.defaults.headers = {
  'content-type': 'application/x-www-form-urlencoded'
}

/**
 * 获取当前域名的相关设置
 * @param host
 * @returns {Promise}
 */
export function getHostSetting ({ host }) {
  return request({
    url: '/basic/host_theme',
    method: 'get',
    params: { host }
  })
}

/**
 *
 * 获取当前账号能看到的园区
 */
export function querySubOrganizationList () {
  return request({
    url: '/neuroo/organization',
    method: 'get'
  })
}

/**
 * 根据tagCode查询员工的名称列表
 * @param departmentId {string} 园区ID
 * @param tagCode {'TEACHER','HEAD_TEACHER','DEAN','REGIONAL_MANAGER','SCHOOL'} TEACHER-老师,HEAD_TEACHER-班主任','DEAN-教务主任','REGIONAL_MANAGER-区域经理','SCHOOL-园所'
 * @returns {AxiosPromise}
 */
export function queryEmployeeListByTagCode ({ departmentId, tagCode }) {
  return request({
    url: '/basic/organization/employee/names',
    method: 'get',
    params: { departmentId, tagCode }
  })
}

/**
 * 省市区三级联动接口
 * @param  {string=} code - 省市区ID, 不传返回省
 * @returns {AxiosPromise}
 */
export function queryAreaListByCode ({ code }) {
  return request({
    url: '/basic/area/sub',
    method: 'get',
    params: { code }
  })
}

/**
 * 通过areaID获取三级省市区信息
 * @param areaId
 * @returns {AxiosPromise}
 */
export function queryAreaInfoByAreaId ({ areaId }) {
  return request({
    url: `/basic/area/${areaId}`,
    method: 'get'
  })
}

/**
 * 查询当前登录的账户的解决方案列表 主要用于新增子企业时解决方案的勾选列表
 */
export function queryCurrentAccountHaveSolutionSelect () {
  return request({
    url: '/basic/solution',
    method: 'get'
  })
}

/**
 * 获取当前企业的信息
 * */
export function getEnterpriseCurrent () {
  return request({
    url: '/basic/v2/enterprise/current',
    method: 'get'
  })
}

/**
 * 统一导入文件上传
 * @param url
 * @param file
 * @param options
 * @returns {AxiosPromise}
 */
export function uploadFileForUrlAndFile ({ url, file, options }) {
  const formData = new FormData()
  for (const key in options) {
    formData.append(key, options[key])
  }
  formData.append('file', file)
  return axios.post(url, formData, {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: getToken()
    }
  }).then(response => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.detail || res.message || '服务器开小差了',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(res.detail)
    }
    return res
  }).catch(error => {
    if (!error.response) {
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      Message({
        message: '登陆超时, 请重新登陆',
        type: 'error',
        duration: 2 * 1000
      })
      removeAllInfo()
      router.push('/login')
      location.reload()
      return Promise.reject(error)
    }
    // 服务正在启动
    if (error.response.status === 503) {
      Message({
        message: '该功能升级中, 请稍后再试',
        type: 'info',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
    Message({
      message: '服务器繁忙, 请稍后再试',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  })
}

/**
 * 导出下载文件
 * @param method
 * @param url
 * @param params
 * @returns {AxiosPromise<any>}
 */
export function downloadFile ({ method = 'post', url, params }) {
  return axios({
    method: method,
    url: url,
    params,
    responseType: 'blob',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: getToken(),
      'etm-terminal-platform': 'PC'
    }
  }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    let fileName = 'unknown'
    const contentDisposition = res.headers['content-disposition']
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename=(.+)/)
      if (fileNameMatch.length === 2) {
        fileName = decodeURIComponent(fileNameMatch[1])
      }
    }
    return {
      url, fileName
    }
  }).catch(error => {
    if (!error.response) {
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      Message({
        message: '登陆超时, 请重新登陆',
        type: 'error',
        duration: 2 * 1000
      })
      removeAllInfo()
      router.push('/login')
      location.reload()
      return Promise.reject(error)
    }
    // 服务正在启动
    if (error.response.status === 503) {
      Message({
        message: '该功能升级中, 请稍后再试',
        type: 'info',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
    Message({
      message: '服务器繁忙, 请稍后再试',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  })
}

/**
 * 查询云视频接入
 * @returns {AxiosPromise}
 */
export function queryVideoSetting () {
  return request({
    url: '/basic/ys/open_platform',
    method: 'get',
    params: {}
  })
}

/**
 * 设置云视频信息
 * @param appKey
 * @param appSecret
 * @returns {AxiosPromise}
 */
export function updateVideoSetting ({ appKey, appSecret }) {
  return request({
    url: '/basic/ys/open_platform',
    method: 'put',
    data: { appKey, appSecret }
  })
}

/**
 * 查询推荐食谱
 */
export function queryWeekRecipe () {
  return request({
    url: '/basic/week_recipe',
    method: 'get'
  })
}
/**
 * 查询产品动态列表
 * @returns {AxiosPromise}
 */
export function queryProductDynamicList () {
  return request({
    url: '/basic/product_news',
    method: 'get'
  })
}

/**
 * 获取指定的推荐食谱
 */
export function queryWeekRecipeDetail (id) {
  return request({
    url: `/basic/week_recipe/${id}`,
    method: 'get'
  })
}
/**
 * 获取指定的产品动态
 * @returns {AxiosPromise}
 */
export function queryProductDynamicById ({ id }) {
  return request({
    url: `/basic/product_news/${id}`,
    method: 'get'
  })
}

/**
 * 查询组织的子部门列表
 * @returns {AxiosPromise}
 */
export function queryOrgDepartment ({ id }) {
  return request({
    url: `/basic/v2/organization/${id}/department`,
    method: 'get'
  })
}

/**
 * 查询指定组织下的员工列表
 * @returns {AxiosPromise}
 */
export function queryOrgEmployee ({ id }) {
  return request({
    url: `/basic/v2/organization/${id}/employee`,
    method: 'get'
  })
}

/**
 * 充值中心查询
 * @returns {AxiosPromise}
 */
export function queryPaymentStatistics () {
  return request({
    url: '/basic/communication/organization/recharge/statistics',
    method: 'get'

  })
}

/**
 * 查询充值中心的企业充值订单
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param orderNo 订单号
 * @param type 类型
 MESSAGE :短信
 CALL :电话
 CLOUD_DISK :云盘
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryRechargeOrder ({ startDate, endDate, orderNo, type, pageNum, pageSize, paged }) {
  return request({
    url: '/basic/communication/organization/recharge/order',
    method: 'get',
    params: { startDate, endDate, orderNo, type, pageNum, pageSize, paged }
  })
}

/**
 * 查询碰客充值订单列表
 * @param organizationId 组织id(前端不用传)
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @param orderNo 订单号
 * @param state 支付状态, VARCHAR
 HAVE_PAID :已支付
 UNPAID :待支付
 * @param chargeType 支付方式(人工,购买套餐)
 MANUAL :人工
 PAY :购买套餐
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
export function queryPortrayalLog ({ organizationId, startDate, endDate, orderNo, state, chargeType, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/customer/recharge_order',
    method: 'get',
    params: { organizationId, startDate, endDate, orderNo, state, chargeType, pageNum, pageSize, paged, sort }
  })
}

/**
 * @param type {("bpcLoginAgreement" | "bpcRechargeAgreement" | "bpcTelephoneAgreement" | "bpcMessageAgreement" | "bpcPromiseAgreement")} agreementType
 * @returns {*}
 */
export function queryAgreementByType (type) {
  const hostConfig = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config)
  console.log('type: ', type)
  return Axios({
    url: hostConfig[type],
    method: 'get'
  })
}
