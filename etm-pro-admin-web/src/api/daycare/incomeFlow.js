import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// import request from '@/api/daycare/mockRequest'

/**
 * 查询收入支出流水列表
 * @param incomeExpenditureTypeId 支出类型id
 * @param reconciliationStatus  对账类型 RECONCILED :已对账 UNRECONCILED :未对账
 * @param incomeOrExpensesType  流水类型 INCOME :收入 EXPENDITURE :支出
 * @param startPayOutDate       签约开始日期
 * @param endPayOutDate         签约结束日期
 * @param createName            经办人
 * @param startManageDate       经办开始日期
 * @param endManageDate         经办结束日期
 * @param pageNum               当前页码
 * @param pageSize              每页记录数
 * @returns {AxiosPromise}
 */
export function queryIncomeAndExpenditureFlow({ incomeExpenditureTypeId, reconciliationStatus, incomeOrExpensesType, startPayOutDate, endPayOutDate, createName, startManageDate, endManageDate, pageNum, pageSize }) {
  return request({
    url: '/daycare/income_and_expenses_flow',
    method: 'get',
    params: {
      incomeExpenditureTypeId,
      reconciliationStatus,
      incomeOrExpensesType,
      startPayOutDate,
      endPayOutDate,
      createName,
      startManageDate,
      endManageDate,
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
    url: '/daycare/income_and_expenditure_type/type',
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
    url: `/daycare/income_and_expenses_flow/reconciliation/${incomeAndExpensesFlowId}`,
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
    url: '/daycare/finance_pay_type',
    method: 'get'
  })
}

/**
 * 添加记一笔
 * @param incomeExpenditureTypeId 支出/收入类型id
 * @param amountOfPayout  支出/收入金额
 * @param associatedSingleNumber  关联单号
 * @param payTypeId 支付/收入方式id
 * @param payOutDate  出账日期
 * @param remarks 备注
 * @param sourceType  来源类型（早教/托育/订金/记一笔）
 * @param sourceId  来源id
 * @param incomeOrExpensesType  流水类型
 * @returns {AxiosPromise}
 */
export function addIncomeAndExpensesFlow({ incomeExpenditureTypeId, amountOfPayout, associatedSingleNumber, payTypeId, payOutDate, remarks, sourceType, sourceId, incomeOrExpensesType }) {
  return request({
    url: '/daycare/income_and_expenses_flow',
    method: 'post',
    data: {
      incomeExpenditureTypeId,
      amountOfPayout,
      associatedSingleNumber,
      payTypeId,
      payOutDate,
      remarks,
      sourceType,
      sourceId,
      incomeOrExpensesType
    }
  })
}

/**
 * 删除记一笔
 * @param incomeAndExpensesFlowId 收入支出流水 ID
 * @returns {AxiosPromise}
 */
export function delIncomeAndExpensesFlow({ incomeAndExpensesFlowId }) {
  return request({
    url: `/daycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
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
    url: `/daycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
    get: 'get',
    params: {
    }
  })
}

/**
 * 更新收入支出流水
 * @param incomeAndExpensesFlowId {integer} 流水支出id
 * @param incomeExpenditureTypeId {integer} 支出 / 支出类型id
 * @param amountOfPayout  {number} 支出金额
 * @param payTypeId {integer} 支付方式id
 * @param remarks {String} 备注
 * @returns {AxiosPromise}
 * @constructor
 */
export function UpdateIncomeAndExpensesFlow({ incomeAndExpensesFlowId, incomeExpenditureTypeId, amountOfPayout, payTypeId, remarks }) {
  return request({
    url: `/daycare/income_and_expenses_flow/${incomeAndExpensesFlowId}`,
    method: 'put',
    data: {
      incomeExpenditureTypeId,
      amountOfPayout,
      payTypeId,
      remarks
    }
  })
}

/**
 * 查询托育合同
 * @param sourceId  托育合同 ID
 * @returns {AxiosPromise}
 */
export function queryCacContract({ cacContractId }) {
  return request({
    url: `/daycare/cac_contract/${cacContractId}`,
    method: 'get',
    params: {
    }
  })
}

/**
 * 获取早教合同
 * @param sourceId  早教合同 ID
 * @returns {AxiosPromise}
 */
export function queryTcContract({ tcContractId }) {
  return request({
    url: `/daycare/tc_contract/${tcContractId}`,
    method: 'get',
    params: {
    }
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
    url: `/daycare/finance_pay_type`,
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
    url: `/daycare/finance_pay_type/${financePayTypeId}`,
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
    url: `/daycare/income_and_expenditure_type`,
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
    url: `/daycare/income_and_expenditure_type/${incomeAndExpenditureTypeId}`,
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
    url: `/daycare/earnest_money/${earnestMoneyId}`,
    method: 'get',
    params: {
    }
  })
}

/**
 * 导出excel表格
 * @param params {obejct} 请求url所需的参数
 * @returns {AxiosPromise<*>}
 */
export function downExcel(params) {
  return downloadFile({
    url: `/daycare/income_and_expenses_flow/excel_revenue_stream`,
    method: 'get',
    params
  })
}
