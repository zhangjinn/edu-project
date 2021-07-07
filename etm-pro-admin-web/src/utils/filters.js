
/**
*vue 过滤--实现文字溢出显示...鼠标移入浮层展示全部
* */
const ellipsis = (value, num = 10) => {
  if (!value) return ''
  if (value.length > num) {
    return value.slice(0, num) + '...'
  }
  return value
}

/**
 *vue 过滤--根据不同的分配方式渲染不同的字段
 * */
const assignWayFilter = (value) => {
  if (!value) return ''
  const typeArr = [{ 'AVERAGE': '自由' }, { 'APPEND': '追加' }, { 'REDO': '重新' }]
  const result = typeArr.filter((item) => Object.keys(item)[0] === value)
  return result[0][value]
}
export {
  ellipsis,
  assignWayFilter
}
