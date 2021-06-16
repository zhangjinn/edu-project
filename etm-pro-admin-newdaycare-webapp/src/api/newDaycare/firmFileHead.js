import request from '@/utils/request'

/**
 * 查询企业资料
 * @returns {AxiosPromise}
 */
export function queryOrganization () {
  return request({
    url: '/newdaycare/organization',
    method: 'get'
  })
}

/**
 * 编辑企业资料
 * @returns {AxiosPromise}
 */
export function updateOrganization ({ gardenArea, annualRent, kindergarten, gfullGarden, nurserySchool, careFullGarden }) {
  return request({
    url: '/newdaycare/organization',
    method: 'put',
    data: { gardenArea, annualRent, kindergarten, gfullGarden, nurserySchool, careFullGarden }
  })
}
