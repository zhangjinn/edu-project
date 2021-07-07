const parseTime = (time, cFormat) => {
  // if (!arguments || arguments.length === 0) {
  //   return null
  // }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 根据传入的时间计算出与今天相距几天，按日期算，不按小时算
 * @param time {string}
 * @returns {number}
 */
export function diffDay(time) {
  const paramTime = parseTime(time, '{y}-{m}-{d}')
  const prevTime = new Date(paramTime)
  const curTime = new Date(parseTime(new Date(), '{y}-{m}-{d}'))
  const subTime = Math.abs(curTime - prevTime)
  return Number.parseInt(subTime / (1000 * 60 * 60 * 24))
}

/**
 * 生成明天的日期
 * @returns {Date}
 */
export function getTomorrow() {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}
