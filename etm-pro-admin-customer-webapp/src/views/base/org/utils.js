/**
 * 通过ID获取该ID的全部父级
 * @param dataArr {array} 元数据
 * @param id {number} id
 * @param path {array} 路径
 * @returns {[]|*[]}
 */

export function findParentPathById (dataArr, id, path) {
  const result = []
  for (const datum of dataArr) {
    const paths = [...path]
    paths.push(datum.id)
    if (datum.id === id) {
      result.push(id)
      return paths
    } else if (Array.isArray(datum.childList) && datum.childList.length) {
      result.unshift(...findParentPathById(datum.childList, id, paths))
    }
  }
  return result
}
