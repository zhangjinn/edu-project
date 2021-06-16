import request from '@/utils/request'
/**
 * 获取导入菜肴模板下载地址
 * */
export function getImportTemplate () {
  return request({
    url: '/guardcare/food/template_url',
    method: 'get'
  })
}
/**
 * 复制食谱
 * */
export function postWeekRecipeCopy (data) {
  return request({
    url: '/guardcare/week_recipe/copy',
    method: 'post',
    data
  })
}
/**
 * ----------
 * 查询学期周次列表
 * */
export function getSemesterWeekSetting (params) {
  return request({
    url: '/guardcare/educational/course/term/week',
    method: 'get',
    params
  })
}
