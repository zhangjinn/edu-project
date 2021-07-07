import attendance from './attendance'
import bodyCheck from './bodyCheck'
import base from '@/enums/base'

const enumData = {
  ...base,
  ...attendance,
  ...bodyCheck
}

/**
 * @description 通过key获取value {key: value}
 * @param key
 * @returns {null|value}
 */
export function getEnumValueByKey(key) {
  return enumData[key] || ''
}

/**
 * @description 通过value获取key {key: value}
 * @param value
 * @returns {string}
 */
export function getEnumKeyByValue(value) {
  let result = null
  for (const enumDataKey in enumData) {
    if (enumData[enumDataKey] === value) {
      result = enumDataKey
    }
  }
  return result || ''
}
