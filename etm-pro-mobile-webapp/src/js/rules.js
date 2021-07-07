//  设置时间格式
// eslint-disable-next-line no-extend-native
export const DateFormat = Date.prototype.format = function (date, fmt) {
    date = new Date(date)

    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

// 判断手机号码格式
export const judgePhone = (phone) => {
    const valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
    return valid_rule.test(phone)
}

// JSON数据格式转化
export const parseData = (data) => {
    const newData = JSON.stringify(data)
    return JSON.parse(newData)
}

// 根据日期获取星期
export const getNowDate = (date) => {
    if (date.indexOf('.') !== -1) {
        date = date.replace(/\./g, '/')
    }
    if (date.indexOf('-') !== -1) {
        date = date.replace(/-/g, '/')
    }
    const nowDate = new Date(date)
    const day = nowDate.getDay()
    let days = ''
    switch (day) {
        case 1:
            days = '星期一'
            break
        case 2:
            days = '星期二'
            break
        case 3:
            days = '星期三'
            break
        case 4:
            days = '星期四'
            break
        case 5:
            days = '星期五'
            break
        case 6:
            days = '星期六'
            break
        case 0:
            days = '星期日'
            break
    }
    return days
}

// 去除空格字符串
export const replaceSpace = (string) => {
    if (!string) return ''
    if (string.includes(' ')) {
        const reg = /(^\s+)|(\s+$)|\s+/g
        string = string.replace(reg, '')
    }
    return string
}

export function transferDate(timestamp) {
    timestamp = +timestamp || Date.now()
    const date = new Date(timestamp)
    return {
      year: date.getFullYear(),
      month: ('0' + (date.getMonth() + 1)).slice(-2),
      date: ('0' + date.getDate()).slice(-2),
      hours: ('0' + date.getHours()).slice(-2),
      miniutes: ('0' + date.getMinutes()).slice(-2),
      seconds: ('0' + date.getSeconds()).slice(-2),
      gap(time) {
        let timeDiff = Math.floor(time / 1000)
        const hour = Math.floor(timeDiff / 3600)
        timeDiff = timeDiff % 3600
        const miniute = Math.floor(timeDiff / 60)
        timeDiff = timeDiff % 60
        const second = timeDiff
        return {
          hours: ('0' + hour).slice(-2),
          miniutes: ('0' + miniute).slice(-2),
          seconds: ('0' + second).slice(-2)
        }
      },
      time: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
      clock: `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`,
      fullTime: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
    }
  }