/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
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
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * rgb转rgba
 * @param color
 * @param alp
 * @returns {string}
 */
export function rgbToRgba(color, alp) {
  let r, g, b
  const rgbaAttr = color.match(/[\d.]+/g)
  if (rgbaAttr.length >= 3) {
    r = rgbaAttr[0]
    g = rgbaAttr[1]
    b = rgbaAttr[2]
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alp + ')'
  }
}
/**
 *vue 过滤--根据不同枚举渲染不同的字段
 * @param {string} val--当前枚举'A'
 * @param {array} arr--枚举列表[{value:'A',name:'运动'},{value:'B',name:'语言'}]
 * @returns {string}
 * */
export function enumerationFilter(val, arr) {
  if (val === '' || val == null) return ''
  if (arr.length > 0) {
    const result = arr.filter((item) => {
      return item['value'] === val
    })
    return result[0]['name']
  }
}

/**
 *vue 过滤--根据不同的性别类型渲染不同的字段
 * */
export function genderFilter(value) {
  if (!value) return ''
  if (value === 'MALE') {
    return '男'
  } else if (value === 'FEMALE') {
    return '女'
  }
}

/**
 *客户线索--客户来源列表转换，适应element-ui级联控件数据结构
 * */
export function getSourceOptionsNew(options) {
  const resData = []
  if (Array.isArray(options) && options.length > 0) {
    options.forEach(function(v, i) {
      resData[i] = {}
      resData[i].label = v.label
      resData[i].value = `${v.id}_${v.label}`
      const arr = []
      if (v.child && v.child.length > 0) {
        v.child.forEach(function(val, index) {
          arr.push({
            label: val.label,
            value: `${val.id}_${val.label}`,
            leaf: true // 表明是叶子节点
          })
        })
      }

      resData[i].children = arr
    })
  }
  return resData
}

// 获取观测评级
// value为评分星星的个数
export const getRateLevel = (rate) => {
  let starNum = 0
  switch (rate) {
    case 'A':
      starNum = 5
      break
    case 'B':
      starNum = 4
      break
    case 'C':
      starNum = 3
      break
    case 'D':
      starNum = 2
      break
    case 'E':
      starNum = 1
      break
    case 'F':
      starNum = 0
      break
  }
  return starNum
}

/**
* 首先获取 Url，然后把 Url 通过 // 截成两部分，再从后一部分中截取相对路径。如果截取到的相对路径中有参数，则把参数去掉。
* */

export function GetUrlRelativePath() {
  const url = document.location.toString()
  const arrUrl = url.split('//')

  const start = arrUrl[1].indexOf('/')
  let relUrl = arrUrl[1].substring(start)// stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}

/**
 * 截取图片Url获取相对路径，
 * */
export function getImgUrlRelativePath(imgUrl) {
  if (!imgUrl) return ''
  const url = imgUrl.toString()
  const arrUrl = url.split('//')
  const start = arrUrl[1].indexOf('/')
  const relUrl = arrUrl[1].substring(start + 1)// stop省略，截取从start开始到结尾的所有字符
  return relUrl
}

/**
 * 千分位加逗号
 * */
export function format(n) {
  // if (!n) return ''
  if (n === '' || n == null) return ''
  const num = n.toString()
  const len = num.length
  if (len <= 3) {
    return num
  } else {
    const remainder = len % 3
    if (remainder > 0) { // 不是3的整数倍
      return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',')
    } else { // 是3的整数倍
      return num.slice(0, len).match(/\d{3}/g).join(',')
    }
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

