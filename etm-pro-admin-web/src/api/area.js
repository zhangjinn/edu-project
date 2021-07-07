import request from '@/utils/request'

/**
*根据地区编码获取下一级行政区域
**/
export function getAreaByCode(data) {
  return request({
    url: '/basic/area/sub',
    method: 'get',
    params: data
  })
}
