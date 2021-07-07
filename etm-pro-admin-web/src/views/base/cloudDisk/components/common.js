const deepClone = (obj) => {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (typeof obj !== 'object') return obj
  const cloneObj = new obj.constructor()
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj
}

const toFixed = (number) => {
  return parseInt(number * 100) / 100
}

const throttle = (func, delay = 300) => {
  let timer = null
  return function() {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }
}

function debounce(func, wait = 240, immediate = false) {
  let timer

  return function() {
    const context = this
    const args = arguments

    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}

export { deepClone, toFixed, throttle, debounce }
