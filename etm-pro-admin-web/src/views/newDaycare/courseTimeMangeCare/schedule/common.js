// 获取今天是今年的第几周
const weekIndexInYear = function(timeStamp) {
  const nowDate = new Date(timeStamp !== '' ? timeStamp : new Date())
  const initTime = new Date(timeStamp !== '' ? timeStamp : new Date())

  initTime.setMonth(0) // 本年初始月份
  initTime.setDate(1) // 本年初始时间

  const defect = initTime.getDay() % 7 // 缺失的天数

  const differenceVal = nowDate - initTime // 今天的时间减去本年开始时间，获得相差的时间
  const todayYear = Math.ceil(differenceVal / (24 * 60 * 60 * 1000)) + defect // 获取今天是今年第几天
  const index = Math.ceil(todayYear / 7) // 获取今天是今年第几周
  return index
}

export { weekIndexInYear }
