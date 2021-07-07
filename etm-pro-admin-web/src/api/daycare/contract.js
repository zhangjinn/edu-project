import request from '@/utils/request'

// import request from '@/api/daycare/mockRequest'

// 定金列表

/**
 * 获取定金列表（分页）
 * @param childId
 * @param status
 * @param createTime
 * @param updateTime
 * @param pageNum
 * @param pageSize
 * @param paged
 * @returns {AxiosPromise}
 */
export function queryDepositList({ childName, status, createTime, updateTime, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/earnest_money`,
    method: 'get',
    params: { childName, status, createTime, updateTime, pageNum, pageSize, paged }
  })
}

/**
 * 修改定金
 * @param earnestMoneyId
 * @returns {AxiosPromise}
 */
export function updateDeposit({ earnestMoneyId, orderNo, money, paymentType, childId, remark, dateCharge }) {
  return request({
    url: `/daycare/earnest_money/${earnestMoneyId}`,
    method: 'put',
    data: { money, paymentType, orderNo, childId, remark, dateCharge }
  })
}

/**
 * 删除定金
 * @param earnestMoneyId
 * @returns {AxiosPromise}
 */
export function removeDeposit({ earnestMoneyId }) {
  return request({
    url: `/daycare/earnest_money/${earnestMoneyId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 获取订单详情
 * @param earnestMoneyId
 * @returns {AxiosPromise}
 */
export function queryDeposit({ earnestMoneyId }) {
  return request({
    url: `/daycare/earnest_money/${earnestMoneyId}`,
    method: 'get',
    params: {}
  })
}

// 托育合同接口

/**
 * 获取托育合同列表(分页)
 * @param contractEnum
 * @param childName
 * @param contactPhoneNumber
 * @param contractNo
 * @param contractStatusEnum
 * @param createName
 * @param startValidBeginTime
 * @param endValidBeginTime
 * @param pageNum
 * @param pageSize
 * @param paged
 * @returns {AxiosPromise}
 */
export function queryCareContractList({ contractEnum, childName, contactPhoneNumber, contractNo, contractStatusEnum, createName, startValidBeginTime, endValidBeginTime, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/cac_contract/find_page`,
    method: 'get',
    params: {
      contractEnum,
      childName,
      contactPhoneNumber,
      contractNo,
      contractStatusEnum,
      createName,
      startValidBeginTime,
      endValidBeginTime,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**

 * 获取托育合同列表
 * @param contractEnum
 * @param childName
 * @param contactPhoneNumber
 * @param contractNo
 * @param contractStatusEnum
 * @param createName
 * @param startValidBeginTime
 * @param endValidBeginTime
 * @param pageNum
 * @param pageSize
 * @param paged
 * @returns {AxiosPromise}
 */
export function queryCacPageLists({ contractEnum, childName, contactPhoneNumber, contractNo, contractStatusEnum, createName, startValidBeginTime, endValidBeginTime, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/cac_contract/find_page`,
    method: 'get',
    params: {
      contractEnum,
      childName,
      contactPhoneNumber,
      contractNo,
      contractStatusEnum,
      createName,
      startValidBeginTime,
      endValidBeginTime,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 获取合同是否续约
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryIsRenewal(childId) {
  return request({
    url: `/daycare/cac_contract/find_child_contract/${childId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取托育合同详情
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function queryCacContractDetail(cacContractId) {
  return request({
    url: `/daycare/cac_contract/${cacContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 删除托育合同
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function removeCacContract(cacContractId) {
  return request({
    url: `/daycare/cac_contract/${cacContractId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 更新托育合同
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function updateCacContract(cacContractId) {
  return request({
    url: `/daycare/cac_contract/${cacContractId}`,
    method: 'put',
    data: {}
  })
}

/* 新增定金
* @param money
* @param paymentType
* @param childId
* @param dateCharge
* @param remark
* @returns {AxiosPromise}
*/
export function createDeposit({ money, paymentType, childId, dateCharge, remark }) {
  console.log('childId: ', childId)
  return request({
    url: `/daycare/earnest_money`,
    method: 'post',
    data: { money, paymentType, childId, dateCharge, remark }
  })
}

/**

 * 获取支付方式
 * @returns {AxiosPromise}
 */
export function queryPayType() {
  return request({
    url: `/daycare/finance_pay_type`,
    method: 'get',
    params: {}
  })
}

/**
 * 更新合同信息
 * @param cacContractId
 * @param receivable
 * @param paid
 * @param paymentId
 * @param date
 * @param validBeginTime
 * @param validEndTime
 * @param mainPerformanceId
 * @param mainPercentage
 * @param secondaryPerformanceId
 * @param secondaryPercentage
 * @param remake
 * @param earnestMoneyId
 * @param listPurchaseItemsDTO
 * @returns {AxiosPromise}
 */
export function updateContract({ cacContractId, contractType, contractNo, receivable, paid, paymentId, date, validBeginTime, validEndTime, mainPerformanceId, mainPercentage, secondaryPerformanceId, secondaryPercentage, remake, earnestMoneyId, listPurchaseItemsDTO }) {
  return request({
    url: `/daycare/cac_contract/${cacContractId}`,
    method: 'put',
    data: {
      receivable,
      paid,
      paymentId,
      contractNo,
      contractType,
      date,
      validBeginTime,
      validEndTime,
      mainPerformanceId,
      mainPercentage,
      secondaryPerformanceId,
      secondaryPercentage,
      remake,
      earnestMoneyId,
      listPurchaseItemsDTO
    }
  })
}

/**
 * 托育审核合同
 * @param id
 * @param toExamineState
 * @param reason
 * @returns {AxiosPromise}
 */
export function updateVerifContract({ id, toExamineState, reason }) {
  return request({
    url: `/daycare/cac_contract/to_examine`,
    method: 'put',
    data: { id, toExamineState, reason }
  })
}

/**
 * 托育退费详情
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function queryExitDetail(cacContractId) {
  return request({
    url: `/daycare/cac_contract/find_refund/${cacContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 托育合同退费
 * @param refund
 * @param refundId
 * @param refundDate
 * @param refundRemake
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function exitContract({ refund, refundId, refundDate, refundRemake, cacContractId }) {
  return request({
    url: `/daycare/cac_contract/save_refund/${cacContractId}`,
    method: 'put',
    data: { refund, refundId, refundDate, refundRemake }
  })
}

/**
 * 获取托育转出课程项
 * @param cacContractItemId
 * @returns {AxiosPromise}
 */
export function queryTransClass(cacContractId) {
  return request({
    url: `/daycare/cac_contract/transfer/item/${cacContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取转出课程
 * @param cacContractItemId
 * @returns {AxiosPromise}
 */
export function queryInClassItem(cacContractItemId) {
  return request({
    url: `/daycare/cac_contract/transfer/detail_item/${cacContractItemId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 转出课程
 * @param teachOrCare
 * @param contractId
 * @param contractNo
 * @param childId
 * @param type
 * @param listTransferOutPurchaseItemsDTO
 * @param totalTransferOut
 * @param listTransferInPurchaseItemsDTO
 * @param totalTransferIn
 * @param transferDate
 * @param transferRemake
 * @returns {AxiosPromise}
 */
export function createTransformOut({ teachOrCare, contractId, contractNo, childId, type, listTransferOutPurchaseItemsDTO, totalTransferOut, listTransferInPurchaseItemsDTO, totalTransferIn, transferDate, transferRemake }) {
  return request({
    url: `/daycare/cac_contract/save_transfer`,
    method: 'post',
    data: {
      teachOrCare,
      contractId,
      contractNo,
      childId,
      type,
      listTransferOutPurchaseItemsDTO,
      totalTransferOut,
      listTransferInPurchaseItemsDTO,
      totalTransferIn,
      transferDate,
      transferRemake
    }
  })
}

/*
* 查询支付方式下拉列表
* @returns {AxiosPromise}
*/
export function queryPaymentType() {
  return request({
    url: `/daycare/finance_pay_type`,
    method: 'get',
    params: {}

  })
}

/**
 * 新增托育合同
 * @param contractNo
 * @param childId
 * @param contractType
 * @param receivable
 * @param paid
 * @param paymentId
 * @param date
 * @param validBeginTime
 * @param validEndTime
 * @param mainPerformanceId
 * @param mainPercentage
 * @param secondaryPerformanceId
 * @param secondaryPercentage
 * @param remake
 * @param earnestMoneyId
 * @param listPurchaseItemsDTO
 * @returns {AxiosPromise}
 */
export function createNurseContract({ contractNo, childId, contractType, receivable, paid, paymentId, date, validBeginTime, validEndTime, mainPerformanceId, mainPercentage, secondaryPerformanceId, secondaryPercentage, remake, earnestMoneyId, listPurchaseItemsDTO }) {
  return request({
    url: `/daycare/cac_contract`,
    method: 'post',
    data: {
      contractNo,
      childId,
      contractType,
      receivable,
      paid,
      paymentId,
      date,
      validBeginTime,
      validEndTime,
      mainPerformanceId,
      mainPercentage,
      secondaryPerformanceId,
      secondaryPercentage,
      remake,
      earnestMoneyId,
      listPurchaseItemsDTO
    }
  })
}

/**
 * 新增托育合同
 * @param contractNo
 * @param childId
 * @param contractType
 * @param receivable
 * @param paid
 * @param paymentId
 * @param date
 * @param validBeginTime
 * @param validEndTime
 * @param mainPerformanceId
 * @param mainPercentage
 * @param secondaryPerformanceId
 * @param secondaryPercentage
 * @param remake
 * @param earnestMoneyId
 * @param listPurchaseItemsDTO
 * @returns {AxiosPromise}
 */
export function createEarlyContract({ contractNo, childId, contractType, receivable, paid, paymentId, date, validBeginTime, validEndTime, mainPerformanceId, mainPercentage, secondaryPerformanceId, secondaryPercentage, remake, earnestMoneyId, listPurchaseItemsDTO }) {
  return request({
    url: `/daycare/tc_contract`,
    method: 'post',
    data: {
      contractNo,
      childId,
      contractType,
      receivable,
      paid,
      paymentId,
      date,
      validBeginTime,
      validEndTime,
      mainPerformanceId,
      mainPercentage,
      secondaryPerformanceId,
      secondaryPercentage,
      remake,
      earnestMoneyId,
      listPurchaseItemsDTO
    }
  })
}

/**
 * 根据学员获取定金列表
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryMoneyLists(childId, earnestMoneyId) {
  let url = `/daycare/earnest_money/child/${childId}`

  if (earnestMoneyId) {
    url += `?earnestMoneyId=${earnestMoneyId}`
  }

  return request({
    url,
    method: 'get',
    params: {}
  })
}

// 早教合同接口

/**
 * 获取早教合同列表(分页)
 * @param contractEnum
 * @param childName
 * @param contactPhoneNumber
 * @param contractNo
 * @param contractStatusEnum
 * @param createName
 * @param startValidBeginTime
 * @param endValidBeginTime
 * @param pageNum
 * @param pageSize
 * @param paged
 * @returns {AxiosPromise}
 */
export function queryTeachContractList({ contractEnum, childName, contactPhoneNumber, contractNo, contractStatusEnum, createName, startValidBeginTime, endValidBeginTime, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/tc_contract/find_page`,
    method: 'get',
    params: {
      contractEnum,
      childName,
      contactPhoneNumber,
      contractNo,
      contractStatusEnum,
      createName,
      startValidBeginTime,
      endValidBeginTime,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 删除早教合同
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function removeTeachContract(tcContractId) {
  return request({
    url: `/daycare/tc_contract/${tcContractId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 获取早教合同详情
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function queryTeachContractDetail(tcContractId) {
  return request({
    url: `/daycare/tc_contract/${tcContractId}`,
    method: 'get',
    params: {}
  })
}

export function updateTeachContract({ tcContractId, contractType, receivable, paid, paymentId, date, validBeginTime, validEndTime, mainPerformanceId, contractNo, mainPercentage, secondaryPerformanceId, secondaryPercentage, remake, earnestMoneyId, listPurchaseItemsDTO }) {
  return request({
    url: `/daycare/tc_contract/${tcContractId}`,
    method: 'put',
    data: {
      receivable,
      paid,
      contractType,
      paymentId,
      contractNo,
      date,
      validBeginTime,
      validEndTime,
      mainPerformanceId,
      mainPercentage,
      secondaryPerformanceId,
      secondaryPercentage,
      remake,
      earnestMoneyId,
      listPurchaseItemsDTO
    }
  })
}

/**
 * 早教退费详情
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function queryTeachExitDetail(tcContractId) {
  return request({
    url: `/daycare/tc_contract/find_refund/${tcContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 早教合同退费
 * @param refund
 * @param refundId
 * @param refundDate
 * @param refundRemake
 * @param cacContractId
 * @returns {AxiosPromise}
 */
export function exitTeachContract({ refund, refundId, refundDate, refundRemake, tcContractId }) {
  return request({
    url: `/daycare/tc_contract/save_refund/${tcContractId}`,
    method: 'put',
    data: { refund, refundId, refundDate, refundRemake }
  })
}

/**
 * 早教审核合同
 * @param id
 * @param toExamineState
 * @param reason
 * @returns {AxiosPromise}
 */
export function updateTeachVerifContract({ id, toExamineState, reason }) {
  return request({
    url: `/daycare/tc_contract/to_examine`,
    method: 'put',
    data: { id, toExamineState, reason }
  })
}

/**
 * 获取转出课程
 * @param cacContractItemId
 * @returns {AxiosPromise}
 */
export function queryTeachInClassItem(tcContractItemId) {
  return request({
    url: `/daycare/tc_contract/transfer/detail_item/${tcContractItemId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取早教转出课程项
 * @param cacContractItemId
 * @returns {AxiosPromise}
 */
export function queryTeachTransClass(tcContractId) {
  return request({
    url: `/daycare/tc_contract/transfer/item/${tcContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 早教合同作废
 * @param cacContractId
 * @param reason
 * @returns {AxiosPromise}
 */
export function updateTeachScrap({ teContractId, reason }) {
  return request({
    url: `/daycare/tc_contract/to_void/${teContractId}`,
    method: 'put',
    data: { reason }
  })
}

/**
 * 早教合同作废
 * @param cacContractId
 * @param reason
 * @returns {AxiosPromise}
 */
export function updateScrap({ cacContractId, reason, type }) {
  return request({
    url: `/daycare/cac_contract/to_void/${cacContractId}?reason=${reason}&type=${type}`,
    method: 'put',
    data: { reason, type }
  })
}

/**
 * 查询会员卡列表
 * @param cardNumber 卡号
 * @param childName 学员名称
 * @param parentPhone 联系人电话
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryCardLists({ cardNumber, childName, parentPhone, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/membership_card`,
    method: 'get',
    params: { cardNumber, childName, parentPhone, pageNum, pageSize, paged }
  })
}

/**
 * 获取会员卡
 * @param membershipCardId 会员卡 ID
 * @returns {AxiosPromise}
 */
export function queryMemberDetail({ membershipCardId }) {
  return request({
    url: `/daycare/membership_card/${membershipCardId}`,
    method: 'get'

  })
}

/**
 * 更新会员卡
 * @param membershipCardId
 * @param personRelationId 人际关系id
 * @param cardTypeId 卡的类型
 * @param cardNumber 卡号
 * @param childId 学员id
 * @returns {AxiosPromise}
 */
export function updateMemberCard({ membershipCardId, childId, cardNumber, personRelationId, cardTypeId }) {
  return request({
    url: `/daycare/membership_card/${membershipCardId}`,
    method: 'put',
    data: { personRelationId, cardNumber, cardTypeId, childId }
  })
}

/**
 * 删除会员卡
 * @param membershipCardId 会员卡 ID
 * @returns {AxiosPromise}
 */
export function removeMemberCard({ membershipCardId }) {
  return request({
    url: `/daycare/membership_card/${membershipCardId}`,
    method: 'delete'

  })
}

/**
 * 开启会员卡
 * @param membershipCardId 会员卡 ID
 * @param status 是否开启
 * @returns {AxiosPromise}
 */
export function updateTriggerMember({ membershipCardId, status }) {
  return request({
    url: `/daycare/membership_card/open/${membershipCardId}`,
    method: 'put',
    data: { status }
  })
}

/**
 * 查询会员卡详情
 * @param membershipCardId {number}
 * @returns {AxiosPromise}
 */
export function queryCardDetailByCardId({ membershipCardId }) {
  return request({
    url: `/daycare/membership_card/details/${membershipCardId}`,
    method: 'get',
    params: { membershipCardId }
  })
}

/**
 * 查询会员卡类型列表
 * @returns {AxiosPromise}
 */
export function queryCardSetting() {
  return request({
    url: `/daycare/membership_card_type`,
    method: 'get'

  })
}

/**
 * 新增会员卡类型
 * @param membershipCardTypeName 名称
 * @returns {AxiosPromise}
 */
export function createCardSetting({ membershipCardTypeName }) {
  return request({
    url: `/daycare/membership_card_type`,
    method: 'post',
    data: { membershipCardTypeName }
  })
}

/**
 * 更新会员卡类型
 * @param membershipCardTypeId
 * @param membershipCardTypeName 名称
 * @returns {AxiosPromise}
 */
export function updateCardSetting({ membershipCardTypeId, membershipCardTypeName }) {
  return request({
    url: `/daycare/membership_card_type/${membershipCardTypeId}`,
    method: 'put',
    data: { membershipCardTypeName }
  })
}

/**
 * 删除会员卡类型
 * @param membershipCardTypeId 会员卡类型 ID
 * @returns {AxiosPromise}
 */
export function removeCardSetting(membershipCardTypeId) {
  return request({
    url: `/daycare/membership_card_type/${membershipCardTypeId}`,
    method: 'delete'

  })
}

/**
 * 排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function createCradSort(ids) {
  return request({
    url: `/daycare/membership_card_type/sort`,
    method: 'post',
    data: { ids }
  })
}
