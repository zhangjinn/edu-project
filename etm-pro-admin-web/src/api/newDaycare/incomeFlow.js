import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// import request from '@/api/newdaycare/mockRequest'

// /**
//  * 查询收入支出流水列表
//  * @param incomeExpenditureTypeId 支出类型id
//  * @param reconciliationStatus  对账类型 RECONCILED :已对账 UNRECONCILED :未对账
//  * @param incomeOrExpensesType  流水类型 INCOME :收入 EXPENDITURE :支出
//  * @param startPayOutDate       签约开始日期
//  * @param endPayOutDate         签约结束日期
//  * @param createName            经办人
//  * @param startManageDate       经办开始日期
//  * @param endManageDate         经办结束日期
//  * @param pageNum               当前页码
//  * @param pageSize              每页记录数
//  * @returns {AxiosPromise}
//  */
// export function queryIncomeAndExpenditureFlow({ incomeExpenditureTypeId, reconciliationStatus, incomeOrExpensesType, startPayOutDate, endPayOutDate, createName, startManageDate, endManageDate, pageNum, pageSize }) {
//   return request({
//     url: '/newdaycare/income_and_expenses_flow',
//     method: 'get',
//     params: {
//       incomeExpenditureTypeId,
//       reconciliationStatus,
//       incomeOrExpensesType,
//       startPayOutDate,
//       endPayOutDate,
//       createName,
//       startManageDate,
//       endManageDate,
//       pageNum,
//       pageSize
//     }
//   })
// }

/**
 * 查询收入支出流水列表
 * @param type 收入/支出 类型  true记一笔 |  false系统生成
 * @param subjectName 收入/支出科目, INT
 * @param reconciliationStatus 对账类型
 RECONCILED :已对账
 UNRECONCILED :未对账
 * @param startPayOutDate 签约日期
 * @param endPayOutDate 签约日期
 * @param createName 经办人
 * @param startManageDate 经办日期
 * @param endManageDate 经办日期
 * @param incomeOrExpensesType 流水类型
 INCOME :收入
 NET_CASH_FLOW :净现金流
 EXPENDITURE :支出
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryIncomeAndExpenditureFlow({ type, subjectName, reconciliationStatus, startPayOutDate, endPayOutDate, createName, startManageDate, endManageDate, incomeOrExpensesType, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow`,
    method: 'get',
    params: {
      type,
      subjectName,
      reconciliationStatus,
      startPayOutDate,
      endPayOutDate,
      createName,
      startManageDate,
      endManageDate,
      incomeOrExpensesType,
      pageNum,
      pageSize
    }
  })
}

/**
 * 查询收入支出类型
 * @param type  收支类型 INCOME :收入 EXPENDITURE :支出
 * @returns {AxiosPromise}
 */
export function queryIncomeOrExpenditureType({ type }) {
  return request({
    url: '/newdaycare/income_and_expenditure_type/type',
    method: 'get',
    params: {
      type
    }
  })
}

/**
 * 对账
 * @param incomeAndExpensesFlowId 收入支出流水 ID
 * @returns {AxiosPromise}
 */
export function reconciliation({ incomeAndExpensesFlowId }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow/reconciliation/${incomeAndExpensesFlowId}`,
    method: 'put',
    data: {
      incomeAndExpensesFlowId
    }
  })
}

/**
 * 查询支付方式
 * @returns {AxiosPromise}
 */
export function financePayType() {
  return request({
    url: '/newdaycare/finance_pay_type',
    method: 'get'
  })
}

/**
 * 新增收入支出流水
 * @param incomeExpenditureTypeId 支出/收入类型id
 * @param subjectName 收入/支出科目, INT
 * @param amountOfPayout 支出/收入金额
 * @param associatedSingleNumber 关联单号
 * @param payTypeId 支付/收入方式id
 * @param payOutDate 出账日期
 * @param remarks 备注
 * @param sourceType 来源类型（早教/托育/订金/记一笔）
 * @param sourceId 来源id
 * @param incomeOrExpensesType 流水类型
 * @param employeeId 员工id
 * @param enterpriseId 组织id
 * @param childId 学员id
 * @param type 业务类型
 * @returns {AxiosPromise}
 */
export function addIncomeAndExpensesFlow({ incomeExpenditureTypeId, subjectName, amountOfPayout, associatedSingleNumber, payTypeId, payOutDate, remarks, sourceType, sourceId, incomeOrExpensesType, employeeId, enterpriseId, childId, type }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow`,
    method: 'post',
    data: { incomeExpenditureTypeId, subjectName, amountOfPayout, associatedSingleNumber, payTypeId, payOutDate, remarks, sourceType, sourceId, incomeOrExpensesType, employeeId, enterpriseId, childId, type }
  })
}

/**
 * 删除记一笔
 * @param incomeAndExpensesFlowId 收入支出流水 ID
 * @returns {AxiosPromise}
 */
export function delIncomeAndExpensesFlow({ incomeAndExpensesFlowId }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
    method: 'delete',
    data: {
      incomeAndExpensesFlowId
    }
  })
}

/**
 * 查询编辑的详情
 * @param incomeAndExpensesFlowId 收入支出流水 ID
 * @returns {AxiosPromise}
 */
export function queryEditIncomeAndExpensesFlow({ incomeAndExpensesFlowId }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
    get: 'get',
    params: {}
  })
}

/**
 * 更新收入支出流水
 * @param incomeAndExpensesFlowId
 * @param incomeExpenditureTypeId 支出 / 支出类型id
 * @param amountOfPayout 支出金额
 * @param payTypeId 支付方式id
 * @param remarks 备注
 * @param type 业务类型
 * @returns {AxiosPromise}
 */
export function updateIncomeAndExpensesFlow({ incomeAndExpensesFlowId, incomeExpenditureTypeId, amountOfPayout, payTypeId, remarks, type }) {
  return request({
    url: `/newdaycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
    method: 'put',
    data: { incomeExpenditureTypeId, amountOfPayout, payTypeId, remarks, type }
  })
}

/**
 * 查询托育合同
 * @param sourceId  托育合同 ID
 * @returns {AxiosPromise}
 */
export function queryCacContract({ cacContractId }) {
  return request({
    url: `/newdaycare/cac_contract/${cacContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取早教合同
 * @param sourceId  早教合同 ID
 * @returns {AxiosPromise}
 */
export function queryTcContract({ tcContractId }) {
  return request({
    url: `/newdaycare/tc_contract/${tcContractId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增 / 修改支付方式
 * @param financePayTypeId  {integer} id 传id’就是修改，不传id就增加
 * @param financePayTypeName  {String} 名称
 * @returns {AxiosPromise}
 * @constructor
 */
export function UFinancePayType({ financePayTypeId, financePayTypeName }) {
  return request({
    url: `/newdaycare/finance_pay_type`,
    method: 'post',
    data: {
      financePayTypeId,
      financePayTypeName
    }
  })
}

/**
 * 删除支付方式
 * @param financePayTypeId  支付方式 ID
 * @returns {AxiosPromise}
 * @constructor
 */
export function DelFinancePayType({ financePayTypeId }) {
  return request({
    url: `/newdaycare/finance_pay_type/${financePayTypeId}`,
    method: 'delete',
    data: {
      financePayTypeId
    }
  })
}

/**
 * 更新 / 增加收支类型
 * @param id {integer}  id 给id就修改 不给就增加
 * @param name  {String} 名称
 * @param type  {String} 收入支出类型 INCOME :收入 EXPENDITURE :支出
 * @returns {AxiosPromise}
 * @constructor
 */
export function UIncomeAndExpenditureType({ id, name, type }) {
  return request({
    url: `/newdaycare/income_and_expenditure_type`,
    method: 'put',
    data: {
      id,
      name,
      type
    }
  })
}

/**
 * 删除收支类型
 * @param incomeAndExpenditureTypeId  收支类型 ID
 * @returns {AxiosPromise}
 * @constructor
 */
export function DelIncomeAndExpenditureType({ incomeAndExpenditureTypeId }) {
  return request({
    url: `/newdaycare/income_and_expenditure_type/${incomeAndExpenditureTypeId}`,
    method: 'delete',
    data: {
      incomeAndExpenditureTypeId
    }
  })
}

/**
 * 根据订金id查询订金
 * @param earnestMoneyId  订金 ID
 * @returns {AxiosPromise}
 */
export function queryEarnestMoney({ earnestMoneyId }) {
  return request({
    url: `/newdaycare/earnest_money/${earnestMoneyId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 导出excel表格
 * @param params {obejct} 请求url所需的参数
 * @returns {AxiosPromise<*>}
 */
export function downExcel(params) {
  return downloadFile({
    url: `/newdaycare/income_and_expenses_flow/excel_revenue_stream`,
    method: 'get',
    params
  })
}
// 根据账单号获取账单
export function getOrderByCode(code) {
  return request({
    url: `/newdaycare/guard/order/code/${code}`,
    method: 'get'
  })
}

// 根据云视频订单号获取订单
export function getDeviceOrderByCode(code) {
  return request({
    url: `/newdaycare/guard/device_order/code/${code}`,
    method: 'get'
  })
}
