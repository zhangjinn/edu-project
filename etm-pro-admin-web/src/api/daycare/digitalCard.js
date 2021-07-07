import request from '@/utils/request'

// import request from '@/api/daycare/mockRequest'

/**
 * 更新数字名片
 * @param businessCardId
 * @param avatar 头像
 * @param businessCardName 姓名
 * @param organizationName 企业名
 * @param organizationAddress 企业地址
 * @param organizationDetailedAddress 详细地址
 * @param position 岗位
 * @param telephone 手机号
 * @param wechatNumber 微信号
 * @param introduction 介绍
 * @returns {AxiosPromise}
 */
export function updateDigitalCard({ businessCardId, avatar, businessCardName, organizationName, organizationAddress, organizationDetailedAddress, position, telephone, wechatNumber, introduction }) {
  return request({
    url: `/basic/business_card/${businessCardId}`,
    method: 'put',
    data: {
      avatar,
      businessCardName,
      organizationName,
      organizationAddress,
      organizationDetailedAddress,
      position,
      telephone,
      wechatNumber,
      introduction
    }
  })
}

/**
 * 获取数字名片
 * @returns {AxiosPromise}
 */
export function queryDigitalCard() {
  return request({
    url: `/basic/business_card`,
    method: 'get'

  })
}

/**
 * 新增数字名片
 * @param avatar 头像
 * @param businessCardName 姓名
 * @param organizationName 企业名
 * @param organizationAddress 企业地址
 * @param organizationDetailedAddress 详细地址
 * @param position 岗位
 * @param telephone 手机号
 * @param wechatNumber 微信号
 * @param introduction 介绍
 * @returns {AxiosPromise}
 */
export function createDigitalCard({ avatar, businessCardName, organizationName, organizationAddress, organizationDetailedAddress, position, telephone, wechatNumber, introduction }) {
  return request({
    url: `/basic/business_card`,
    method: 'post',
    data: {
      avatar,
      businessCardName,
      organizationName,
      organizationAddress,
      organizationDetailedAddress,
      position,
      telephone,
      wechatNumber,
      introduction
    }
  })
}

