import axios from 'axios'
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_API

/**
 * 获取验证码
 * @returns {AxiosPromise}
 */
export function queryCaptchaImg () {
  return axios({
    url: BASE_URL + '/basic/auth/captcha',
    method: 'get',
    responseType: 'arraybuffer',
    headers: {
      'etm-terminal-platform': 'PC'
    }
  }).then(response => {
    const data = 'data:image/jpeg;base64,' + btoa(
      new Uint8Array(response.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    const token = response.headers.token
    return {
      data,
      token
    }
  })
}

/**
 * 获取生成授权码的参数
 * @param oAuthType 免登授权的方式 WECHAT :微信公众号
 * @returns {*}
 */
export function queryWechatLoginInfo ({ oAuthType }) {
  return request({
    url: '/basic/auth/oauth_parameter',
    method: 'get',
    params: { oAuthType }
  })
}
