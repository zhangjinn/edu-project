import request from '@/utils/request'

/**
 * 获取当前登录账号的个人信息
 * @returns {AxiosPromise}
 */
export function queryCurrentUserInfo () {
  return request({
    url: '/basic/account/personal',
    method: 'get',
    params: {}
  })
}

/**
 * 更新当前登录账号的个人信息
 * @returns {AxiosPromise}
 */
export function updateCurrentUserInfo ({ avatar, accountName, gender }) {
  return request({
    url: '/basic/account/personal',
    method: 'put',
    data: { avatar, accountName, gender }
  })
}

/**
 *获取当前登录账号所对应的企业列表
 * @returns {AxiosPromise}
 */
export function queryCurrentUserEnterprise () {
  return request({
    url: '/basic/v2/account/employee',
    method: 'get',
    params: {}
  })
}

/**
 *更新当前登录账号的员工的部分信息
 * @param employeeId
 * @param name {object}
 * @returns {AxiosPromise}
 */
export function updateCurrentEnterpriseInfo ({ employeeId, name }) {
  return request({
    url: `/basic/v2/account/employee/${employeeId}`,
    method: 'patch',
    data: {
      name
    }
  })
}

/**
 *修改手机号码
 * @returns {AxiosPromise}
 */
export function updateUserPhone ({ password, telephone, smsCaptcha }) {
  return request({
    url: '/basic/account/telephone',
    method: 'put',
    data: { password, telephone, smsCaptcha }
  })
}

/**
 * 绑定手机号码
 * @param smsCaptcha
 * @param telephone
 * @returns {AxiosPromise}
 */
export function createBindWechatUserTelephone ({ smsCaptcha, telephone }) {
  return request({
    url: '/basic/account/telephone',
    method: 'post',
    data: { smsCaptcha, telephone }
  })
}

/**
 * 绑定微信
 * @returns {AxiosPromise}
 */
export function updateBindWechat ({ code }) {
  return request({
    url: '/basic/account/wechat',
    method: 'post',
    data: { code }
  })
}

/**
 * 解绑微信
 * @returns {AxiosPromise}
 */
export function updateUnbindWechat () {
  return request({
    url: '/basic/account/wechat',
    method: 'put',
    data: {}
  })
}
