/*
 * 发布范围公共方法
 */

const setSourceName = (authorizationType) => {
  switch (authorizationType) {
    case 'TEACH':
      return '早教课程'
    case 'CARE':
      return '托育班级'
    case 'TODDLER':
      return '幼儿园班级'
  }
}

// 树形结构的id必须唯一
const recursion = (obj, authorizationType) => {
  if (obj.scopeOfAuthorizationList) {
    obj.scopeOfAuthorizationList.forEach(item => {
      item.sourceId = `${authorizationType}/${item.sourceId}`
      recursion(item, item.sourceId)
    })
  }
}

// 获取选择的节点
const getAuthorizationDTOList = (authorizationType, selectValue, source) => {
  const authorizationTypeIdList = selectValue.filter(item => item.sourceId.split('/')[0] === authorizationType).map(item => item.sourceId.split('/').pop())
  if (!source) {
    return {
      authorizationType,
      authorizationTypeIdList
    }
  } else {
    return {
      teachOrCare: authorizationType,
      courseIdList: authorizationTypeIdList
    }
  }
}

const treeRange = {
  setSourceName,
  recursion,
  getAuthorizationDTOList
}

export default treeRange
