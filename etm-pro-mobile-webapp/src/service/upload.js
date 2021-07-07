import axios from 'axios'
import request from './http'
import { checkUploadRecoursePath } from '../utils/reg'
import { zipImage } from '../utils/file'
import { getLoginInfo, getToken } from '../js/localStore'
import { Toast } from 'vant'

const userEntity = getLoginInfo() || {}
const userKey = userEntity.id || getToken()

/**
 * 获取上传图片的token
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getUploadToken() {
  return request({
    url: '/basic/qiniu/upload_token',
    method: 'get'
  }).then(res => res.data.data)
}

const url = process.env.NODE_ENV === 'production' ? 'https' : 'http'
/**
 * 上传文件
 * @param file 文件
 * @param resourceName 服务名 格式: 服务名/实体名/实体ID/image|video
 * @param type 文件类型 [image||video]
 * @returns {Promise<never>|AxiosPromise}
 */
export async function uploadFile(file, resourceName, type) {
  if (!checkUploadRecoursePath(resourceName)) {
    return Promise.reject(new Error('请填写resourceName, 格式: 服务名/实体名/实体ID' + '当前格式: ' + resourceName))
  }
  const token = await getUploadToken()
  const resultFile = (type === 'image' && await zipImage(file) || file)
  const formData = new FormData()
  // 服务名/实体名/实体ID/image或video/hash或时间戳.后缀
  formData.append('token', token)
  formData.append('file', resultFile)
  formData.append('key', resourceName + '/' + type + '/' + userKey + '/' + Date.now() + '/' + file.name)

  Toast.loading({
    duration: 0,
    mask: false,
    message: '加载中...'
  })

  return axios({
    url: url + '://up-z2.qiniup.com',
    method: 'post',
    data: formData
  })
}
