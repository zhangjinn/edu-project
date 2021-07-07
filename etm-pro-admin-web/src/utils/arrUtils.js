/**
 * 数组对象去重
 * @param arr 数组
 * @param sign 标识符
 * @returns {Error|Array} arr
 */
export function unique(arr, sign) {
  if (!arr) {
    return new Error('arr参数不能为空')
  }
  if (!sign) {
    return new Error('sign参数不能为空')
  }
  if (!Array.isArray(arr)) {
    return arr
  }
  const hash = {}
  return arr.reduce((current, next) => {
    if (!hash[next[sign]]) {
      hash[next[sign]] = true
      return [...current, next]
    } else {
      return current
    }
  }, [])
}
