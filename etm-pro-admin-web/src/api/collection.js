import request from '@/utils/request'

/**
 *采宝支付进件
 **/
export function merchantConfig(data) {
  return request({
    url: '/basic/organization/pay_config/merchant',
    method: 'post',
    data
  })
}

/**
 *采宝图片上传
 **/
export function uploadSignPicture(data) {
  return request({
    url: '/basic/organization/pay_config/upload_caibao',
    method: 'post',
    data
  })
}

/**
 *采宝支付签约
 **/
export function merchantSign(data) {
  return request({
    url: '/basic/organization/pay_config/merchant_and_sign',
    method: 'post',
    data
  })
}

/**
 *签约请求回显
 **/
export function getMerchantData() {
  return request({
    url: '/basic/organization/pay_config/merchant_callback',
    method: 'get'
  })
}

/**
 *采宝支付进件银行列表
 **/
export function getBankList() {
  return request({
    url: '/basic/organization/pay_config/merchant/bank_name/list',
    method: 'get'
  })
}

/**
 *采宝支付进件联行号列表
 **/
export function getBankContactList(data) {
  return request({
    url: '/basic/organization/pay_config/merchant/bank_contact_line/list',
    method: 'get',
    params: data
  })
}

/**
 *获取采宝支付签约状态
 **/
export function getMerchantSignSate() {
  return request({
    url: '/basic/organization/pay_config/merchant/sign_state',
    method: 'get'
  })
}

/**
 *获取采宝支付签约状态
 **/
export function putMerchantSignSate() {
  return request({
    url: '/basic/organization/pay_config/merchant/sign_state',
    method: 'put'
  })
}
