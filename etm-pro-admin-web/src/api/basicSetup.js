import request from '@/utils/request'

export function getAttributeById(id) {
  return request({
    url: `/customer/attribute/${id}`,
    method: 'get'
  })
}

export function getCustomInfo() {
  return request({
    url: '/customer/customer/dict_type',
    method: 'get'
  })
}

export function getCustomInfoById(id) {
  return request({
    url: `/customer/customer/dict_type/${id}`,
    method: 'get'
  })
}

export function getFollowInfo() {
  return request({
    url: '/customer/new_follow/dict_type',
    method: 'get'
  })
}

export function getFollowInfoById(id) {
  return request({
    url: `/customer/new_follow/dict_type/${id}`,
    method: 'get'
  })
}

export function getAttribute(params) {
  return request({
    url: '/customer/attribute',
    method: 'get',
    params
  })
}

export function getSourceAttribute(params) {
  return request({
    url: '/customer/attribute/level',
    method: 'get',
    params
  })
}

export function getOrganizationTree(organizationId, personId) {
  return request({
    url: `/basic/organization/${organizationId}/organization_tree`,
    method: 'get',
    params: {
      personId
    }
  })
}

export function postAttribute(data, url) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function putAttribute(data, url) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function deleteAttribute(id) {
  return request({
    url: `/customer/attribute/${id}`,
    method: 'delete'
  })
}
