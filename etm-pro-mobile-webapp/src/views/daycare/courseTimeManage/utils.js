export const dataType = data => {
  const result = Object.prototype.toString.call(data).slice(8, -1)
  return result.toLowerCase()
}

export const differ = (step = 0, date) => {
  let newDate
  let strFormat = ''
  const res = {}
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  switch (dataType(date)) {
    case 'undefined' :
      newDate = new Date()

      break
    case 'string' :
      if (/^\d+$/.test(date)) {
        date = Number(date)
        newDate = new Date(date)
      } else {
        newDate = new Date(date)
      }
      break
    case 'number' :
      if (date.toString().length === 10) date *= 1000
      newDate = new Date(date)

      break
    case 'date':
      newDate = date

      break
    default :
      console.log('请输入正确的时间格式')
      return false
  }

  newDate.setTime(newDate.getTime() + (step * 3600 * 24 * 1000))

  res.year = newDate.getFullYear()
  res.month = newDate.getMonth() + 1
  res.day = newDate.getDate()
  res.hours = newDate.getHours()
  res.seconds = newDate.getSeconds()
  res.minutes = newDate.getMinutes()
  const week = newDate.getDay()

  if (res.month < 10) res.month = '0' + res.month
  if (res.day < 10) res.day = '0' + res.day

  strFormat += res.month + '月' + res.day + '日'

  res.dateFormat = res.year + '-' + res.month + '-' + res.day
  res.cnFormat = strFormat
  res.cnDate = strFormat + ' ' + weekArr[week]
  res.week = weekArr[week]
  res.weekNum = week
  res.date = newDate

  return res
}

export const deepClone = (obj) => {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (typeof obj !== 'object') return obj
  const cloneObj = new obj.constructor()
  for (const key in obj) {
    if (obj[key]) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj
}

export const debounce = (fn, delay) => {
  let timer = null // 借助闭包
  return function() {
    if (timer) {
      clearTimeout(timer) // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
      timer = setTimeout(fn, delay)
    } else {
      timer = setTimeout(fn, delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
    }
  }
}
