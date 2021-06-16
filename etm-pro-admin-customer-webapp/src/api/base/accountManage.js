import request from '@/utils/request'

/**
 * 保存支付商户基础信息
 * @param id
 * @param subscribeAppid 公众号appid
 * @param abbreviation 商家简称(必填)
 * @param merchantName 商家名称(必填)
 * @returns {AxiosPromise}
 */
export function updateBasicData ({ id, subscribeAppid, abbreviation, merchantName }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/basic/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/basic/info`,
    method: 'put',
    data: { subscribeAppid, abbreviation, merchantName }
  })
}

/**
 * 保存支付商户联系人信息
 * @param id
 * @param phone 手机
 * @param name 名称
 * @param email 邮箱
 * @returns {AxiosPromise}
 */
export function updateContactData ({ id, phone, name, email }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/contact/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/contact/info`,
    method: 'put',
    data: { phone, name, email }
  })
}

/**
 * 保存支付商户门店信息
 * @param id
 * @param areaCode 区编号
 * @param provinceCode 省编号
 * @param cityCode 市编号
 * @param businessPlaceInterior undefined
 * @param businessType 商户类别         @NotNull(message = "商户类别不能为空")
 * @param businessAddress 详细经营地址
 * @param businessPlaceDoorHead undefined
 * @param businessServiceTel 客服电话
 * @returns {AxiosPromise}
 */
export function updateBusinessData ({ id, areaCode, provinceCode, cityCode, businessPlaceInterior, businessType, businessAddress, businessPlaceDoorHead, businessServiceTel }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/business/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/business/info`,
    method: 'put',
    data: { areaCode, provinceCode, cityCode, businessPlaceInterior, businessType, businessAddress, businessPlaceDoorHead, businessServiceTel }
  })
}

/**
 * 保存支付商户营业执照信息
 * @param id
 * @param licensePhoto 营业执照 照片
 * @param licenseLimit 经营范围
 * @param licenseNumber 机构编码
 * @param licenseName 机构名称
 * @param beginTime 有效开始时间
 * @param endTime 有效结束时间 长期
 * @param licenseAddress 营业执照注册地址
 * @returns {AxiosPromise}
 */
export function updateLicenseData ({ id, licensePhoto, licenseLimit, licenseNumber, licenseName, beginTime, endTime, licenseAddress }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/business_license/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/business_license/info`,
    method: 'put',
    data: { licensePhoto, licenseLimit, licenseNumber, licenseName, beginTime, endTime, licenseAddress }
  })
}

/**
 * 保存支付商户法人身份信息
 * @param id
 * @param idCardFrontPhoto 身份证正面照
 * @param idCardBackPhoto 身份证反面照
 * @param idCardName 姓名
 * @param idCardNumber 身份证号码
 * @param beginTime 身份证有效期开始时间
 * @param endTime 身份证有效期结束时间
 * @returns {AxiosPromise}
 */
export function updateRegisterData ({ id, idCardFrontPhoto, idCardBackPhoto, idCardName, idCardNumber, beginTime, endTime }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/id_card/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/id_card/info`,
    method: 'put',
    data: { idCardFrontPhoto, idCardBackPhoto, idCardName, idCardNumber, beginTime, endTime }
  })
}

/**
 * 保存支付商户结算信息
 * @param id
 * @param bankContactLine 银行联行号
 * @param openAccountLicensePhoto 开户人证明 / 对公账户证明文件
 * @param openAccountName 开户名称
 * @param branchBankName 开户银行
 * @param bankAccountNumber 银行卡卡号
 * @param openAccountBank 开户支行
 * @returns {AxiosPromise}
 */
export function updateSettleData ({ id, bankContactLine, openAccountLicensePhoto, openAccountName, branchBankName, bankAccountNumber, openAccountBank }) {
  return request({
    url: `/basic/organization/pay_config/etm/merchant/${id}/settlement/info`,
    // url: `/basic/payment/efps/pay_config/merchant/${id}/settlement/info`,
    method: 'put',
    data: { bankContactLine, openAccountLicensePhoto, openAccountName, branchBankName, bankAccountNumber, openAccountBank }
  })
}

/**
 * 支付商户提交申请
 * @param id 主键
 * @param type etm供应商户类型
 * @param merchantType 商户类型
 * @returns {AxiosPromise}
 */
export function submitMerchantData ({ id, type, merchantType }) {
  return request({
    url: '/basic/organization/pay_config/etm/merchant',
    // url: `/basic/payment/efps/pay_config/merchant`,
    method: 'put',
    data: { id, type, merchantType }
  })
}
