import { parseTime } from '@/utils/index'

/**
 * 生成批次号/合同号等规则
 * 生成规则: 年月日时分秒+4位
 * @returns {string}
 */
export function createBatchNumber() {
  let num = Date.now() + ''
  num = num.substring(num.length - 4, num.length)
  return parseTime(new Date(), '{y}{m}{d}{h}{i}{s}') + num
}

/**
 * 获取URL参数
 * @param name
 * @returns {string|null}
 */
export function getQueryVariable(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }

  return null
}

