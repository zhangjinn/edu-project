import request from '@/utils/request'
// import axios from 'axios'
//
// const request = axios.create({
//   baseURL: 'http://192.168.7.54:3000/mock/18/'
// })
//
// request.interceptors.request.use(req => {
//   return req
// })
//
// request.interceptors.response.use(res => {
//   return res.data
// })

/**
 * 提交登录信息（账号登录形式）
 * @param data
 * @required type {string} 凭证类型 PASSWORD :账号密码 WECHAT :微信 ALIPAY :支付宝 DINGTALK :钉钉 SMS_CAPTCHA :短信验证码
 * @param code
 * @param telephone
 * @param password
 * @param smsCaptcha
 * @returns {AxiosPromise}
 */
export function login ({ type, code, telephone, password, smsCaptcha }) {
  return request({
    url: '/basic/auth/login',
    method: 'post',
    data: { type, code, telephone, password, smsCaptcha }
  })
}

/**
 * 获取用户的信息
 * @returns {AxiosPromise}
 */
export function queryUserInfoOfEnterprise () {
  return request({
    url: '/basic/v2/account/employee',
    method: 'get',
    params: {}
  })
}

/**
 * 提交登录信息（短信登录形式）
 * @param phone
 * @param captcha
 * @returns {AxiosPromise}
 */
export function messageLogin ({ telephone, smsCaptcha }) {
  return request({
    url: '/basic/auth/login',
    method: 'post',
    data: {
      type: 'SMS_CAPTCHA',
      telephone: telephone,
      smsCaptcha: smsCaptcha
    }
  })
}

// 获取图片验证码
export function getCaptcha () {
  return request({
    url: '/basic/auth/captcha',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 获取手机短信验证码
 * @param {string} telephone
 * @param {string} captcha
 * @param {any} token
 * @param {string} type
 */
export function getPhoneVerifyCode ({ telephone, captcha, token, type = 'LOGIN' }) {
  return request({
    url: `/basic/auth/sendSms/${telephone}`,
    method: 'get',
    params: { captcha, telephone, type, token }
  })
}

/**
 * 重置密码时获取验证码
 * @param phone
 * @param token
 * @param captcha {string}
 * @param type {string}
 * @returns {AxiosPromise}
 */
export function queryPhoneVerifyCodeOfResetPassword ({ phone, token, captcha, type = 'RESET_PASSWORD' }) {
  return request({
    url: `/basic/auth/sendSms/${phone}`,
    method: 'get',
    params: { captcha, token, type }
  })
}

/**
 * 更新密码

 * @param telephone
 * @param smsCaptcha
 * @param newPassword
 * @returns {AxiosPromise}
 */
export function updateResetPassword ({ telephone, smsCaptcha, newPassword }) {
  return request({
    url: '/basic/account/password/reset',
    method: 'put',
    data: { telephone, smsCaptcha, newPassword }
  })
}

// 获取个人账号信息
export function getInfo (organId, accountId) {
  return request({
    url: '/basic/account/basic',
    method: 'get'
  })
}

/**
 * @description 获取个人信息
 * @returns {*}
 */
export function getUserInfo () {
  return request({
    url: '/basic/account/personnel',
    method: 'get'
  })
}

// 修改个人账号信息
export function setInfo () {
  return request({
    url: '/basic/account/2',
    method: 'put'
  })
}

// 获取该员工所在企业的信息和总部信息
export function orgAccount (data) {
  return request({
    url: '/basic/organization/organization_info',
    method: 'get',
    params: data
  })
}

// 修改密码时获取手机验证码
export function editPhoneVerifyCode (phone, data) {
  return request({
    url: `/basic/auth/sendSms/${phone}`,
    method: 'get',
    params: data
  })
}

// 个人中心修改
export function savePersonId (accountId, data) {
  return request({
    url: `/basic/account/personnel/${accountId}`,
    method: 'put',
    data
  })
}

// 设置密码
export function setPassword (phone, data) {
  return request({
    url: `/basic/account/${phone}/password`,
    method: 'post',
    data
  })
}

export function logout (token) {
  return request({
    url: '/basic/auth/logout',
    method: 'put',
    params: { token }
  })
}

export function activation (data) {
  return request({
    url: '/basic/account/password',
    method: 'post',
    data
  })
}

/**
 * @description 更新用户信息
 * @param avatar
 * @param accountName
 * @returns {AxiosPromise}
 */
export function updateUserInfo ({ avatar, accountName }) {
  return request({
    url: '/basic/account/personnel',
    method: 'put',
    data: { avatar, accountName }
  })
}

/**
 * @description 更新密码
 * @param oldPassword
 * @param newPassword
 * @param newPasswordTwice
 * @returns {AxiosPromise}
 */
export function updatePassword ({ oldPassword, newPassword, newPasswordTwice }) {
  return request({
    url: '/basic/account/password',
    method: 'put',
    data: { oldPassword, newPassword, newPasswordTwice }
  })
}
