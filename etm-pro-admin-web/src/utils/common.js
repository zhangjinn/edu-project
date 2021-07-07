export function deepCopy(target) {
  const result = Array.isArray(target) ? [] : {}
  if (target && typeof target === 'object') {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (target[key] && typeof target[key] === 'object') {
          result[key] = deepCopy(target[key])
        } else {
          result[key] = target[key]
        }
      }
    }
  }
  return result
}
