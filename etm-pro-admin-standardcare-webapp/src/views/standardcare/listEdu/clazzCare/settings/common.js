// const deepClone = (target) => {
//   if (target === null) return target
//   if (target instanceof Date) return new Date(target)
//   if (target instanceof RegExp) return new RegExp(target)
//   if (typeof target !== 'object') return target
//   const cloneObj = new target.constructor()
//   for (const key in target) {
//     if (target.hasOwnProperty(key)) {
//       // 实现一个递归拷贝
//       cloneObj[key] = deepClone(target[key])
//     }
//   }
//   return cloneObj
// }
export function deepClone (target) {
  const result = Array.isArray(target) ? [] : {}
  if (target && typeof target === 'object') {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (target[key] && typeof target[key] === 'object') {
          result[key] = deepClone(target[key])
        } else {
          result[key] = target[key]
        }
      }
    }
  }
  return result
}

const toFixed = (number) => {
  return parseInt(number * 100) / 100
}

const throttle = (func, delay = 300) => {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }
}

const getEmployee = () => {
  const userId = localStorage.getItem('currentOrganizationId')
  const organizations = JSON.parse(localStorage.getItem('organizations'))
  let _result = {}

  organizations.forEach(cur => {
    if (cur.organizationId === parseInt(userId)) {
      _result = cur
    }
  })

  return _result
}

export { toFixed, getEmployee, throttle }
