import request from '../http.js'

/**
 *验证码登录、密码登录
 * */
export function login(data) {
  return request({
    url: '/basic/auth/login',
    method: 'post',
    data
  })
}

/**
 * 获取图片验证码
 */
export function getImgCaptcha() {
  return request({
    url: '/basic/auth/captcha?' + new Date(),
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 获取短信验证码
 */
export function getSmsCaptcha(phone, param) {
  return request({
    url: '/basic/auth/sendSms/' + phone,
    method: 'get',
    params: param
  })
}

/**
 * 注销
 * */
export function logout(token) {
  return request({
    url: '/basic/auth/logout',
    method: 'put',
    token
  })
}

/**
 * 新增密码并激活
 * */
export function addPassword(data) {
  return request({
    url: '/basic/account/password',
    method: 'post',
    data
  })
}

/**
 * 获取oauth免登授权地址
 */
export function weChatAuth(param) {
  return request({
    url: '/basic/auth/oauth_url',
    method: 'get',
    params: param
  })
}

/**
 * 微信登录
 */
export function authLogin(data) {
  return request({
    url: '/basic/auth/login',
    method: 'post',
    data
  })
}

/**
 * token续期
 */
export function updateToken() {
  return request({
    url: '/basic/auth/token/renew',
    method: 'put'
  })
}
