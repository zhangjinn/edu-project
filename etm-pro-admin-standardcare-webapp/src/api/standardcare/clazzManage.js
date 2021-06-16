import request from '@/utils/request'

// 查询班级列表
export function queryClazzList ({ pageSize, pageNum, name, typeId, paged, sort }) {
  return request({
    url: '/standardcare/clazz',
    method: 'get',
    params: {
      pageSize,
      pageNum,
      name,
      typeId,
      paged,
      sort
    }
  })
}

// 创建班级
export function createClazz ({ tenantId, typeId, name, typeName, capacity, remark }) {
  return request({
    url: '/standardcare/clazz',
    method: 'post',
    data: {
      tenantId,
      typeId,
      name,
      typeName,
      capacity,
      remark
    }
  })
}

// 获取班级
export function querySingleClazz ({ clazzId }) {
  return request({
    url: `/standardcare/clazz/${clazzId}`,
    method: 'get'
  })
}

// 删除班级
export function removeClazz ({ clazzId }) {
  return request({
    url: `/standardcare/clazz/${clazzId}`,
    method: 'delete'
  })
}

// 更新班级
export function updateClazz ({ clazzId, typeId, typeName, capacity, name, remark }) {
  return request({
    url: `/standardcare/clazz/${clazzId}`,
    method: 'put',
    data: {
      name,
      typeId,
      typeName,
      capacity,
      remark
    }
  })
}

// 查询班级列表
export function queryClazzTypeList () {
  return request({
    url: '/standardcare/clazz_type',
    method: 'get'
  })
}

// 删除班级类型
export function removeClazzType ({ clazzTypeId }) {
  return request({
    url: `/standardcare/clazz_type/${clazzTypeId}`,
    method: 'delete'
  })
}

// 新增班级类型
export function createClazzType ({ clazzTypeName, sort }) {
  return request({
    url: '/standardcare/clazz_type',
    method: 'post',
    data: {
      clazzTypeName,
      sort
    }
  })
}

export function updateClazzType ({ clazzTypeId, clazzTypeName, sort }) {
  return request({
    url: `/standardcare/clazz_type/${clazzTypeId}`,
    method: 'put',
    data: {
      clazzTypeName,
      sort
    }
  })
}

export function updateSort ({ idList }) {
  return request({
    url: '/standardcare/clazz_type/sort',
    method: 'put',
    data: {
      idList
    }
  })
}
