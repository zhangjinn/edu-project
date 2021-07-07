import request from '@/utils/request'

// 更新联系人
export function updateContact({ id, data }) {
  return request({
    url: '/sacc/dictionaries/' + id,
    method: 'put',
    data: data
  })
}

// 删除联系人
export function deleteContact(id) {
  return request({
    url: `/sacc/dictionaries/${id}`,
    method: 'delete'
  })
}

// 新增联系人
export function postContact({ data }) {
  return request({
    url: '/sacc/dictionaries',
    method: 'post',
    data: data
  })
}

// 获取联系人
export function getContact() {
  return request({
    url: '/sacc/dictionaries/CONTACTS',
    method: 'get'
  })
}

// 联系人详情
export function getContactById({ id }) {
  return request({
    url: `/sacc/dictionaries/${id}/detail`,
    method: 'get'
  })
}
