import axios from 'axios'
import { getPhone } from '@/utils/auth'
import request from '@/utils/request'
import { zipImage } from '@/utils/file'

/**
 * @description 获取上传token
 */
function getUploadToken (qiniuTypeEnum, params) {
  return request({
    url: '/basic/qiniu/upload_token',
    method: 'get',
    params: {
      qiniuTypeEnum,
      ...params
    }
  }).then(res => res.data)
}

/**
 * @description 获取上传文件的前缀
 * @returns {*}
 */
export async function getUploadFilePrefix () {
  return request({
    url: '/basic/qiniu/data_prefix',
    method: 'get'
  }).then(res => res.data)
}

const url = process.env.NODE_ENV === 'production' ? 'https' : 'http'

/**
 * 上传文件
 * @param file
 * @param resourceName required
 * @param qiniuTypeEnum
 * @param type
 * @param params
 * @returns {Promise<never>|AxiosPromise}
 */
export async function uploadFile (file, resourceName, type, qiniuTypeEnum = 'QINIU_NOT_CALLBACK', params = {}, tokenParams = {}) {
  if (!resourceName) {
    return Promise.reject(new Error('请填写resourceName, 格式: 服务名/实体名/实体ID/image|video'))
  }
  const token = await getUploadToken(qiniuTypeEnum, tokenParams)
  const formData = new FormData()
  // 服务名/实体名/实体ID/image或video/hash或时间戳.后缀
  const resultFile = ((type === 'image' && await zipImage(file.raw || file)) || (file.raw || file))
  formData.append('token', token)
  formData.append('file', resultFile)

  Object.keys(params).forEach(cur => {
    if (params[cur]) {
      formData.append(cur, params[cur])
    }
  })

  formData.append('key', resourceName + '/' + type + '/' + getPhone() + '/' + Date.now() + '/' + file.name)

  return axios({
    url: url + '://up-z2.qiniup.com',
    method: 'post',
    data: formData,
    headers: {
      'etm-terminal-platform': 'PC'
    }
  })
}

/**
 * 获取微信授权的地址
 * @deprecated
 * @param redirectUrl 带有授权信息的回调地址
 * @returns {AxiosPromise}
 */
export function getWechatAuthURL ({ redirectUrl }) {
  const url = `${process.env.VUE_APP_BASE_API}/basic/wechat/open/third_party/authorization?redirectUrl=${location.href}`
  location.href = url
  // return request({
  //   url: '/basic/wechat/open/third_party/authorization',
  //   method: 'get',
  //   params: { redirectUrl }
  // })
}

/**
 * 保存微信授权信息
 * @param authCode 微信授权码
 * @param organizationId 组织架构ID
 * @returns {AxiosPromise}
 */
export function saveWechatAuthInfo ({ authCode, organizationId }) {
  return request({
    url: '/basic/wechat/third_party/wechat_info_and_access_token',
    method: 'post',
    data: { authCode, organizationId }
  })
}
