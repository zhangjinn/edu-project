import request from '@/utils/request'

/**
 * 查询话术模板列表
 * */
export function querySpeechTemplateList ({ name, pageNum, pageSize }) {
  return request({
    url: '/customer/speech_template',
    method: 'get',
    params: { name, pageNum, pageSize }
  })
}

/**
 * 新增话术模板
 * */
export function addSpeechTemplate ({ url, name, detail }) {
  return request({
    url: '/customer/speech_template',
    method: 'post',
    data: { url, name, detail }
  })
}

/**
 * 更新话术模板
 * */
export function updateSpeechTemplate ({ url, name, detail, speechTemplateId }) {
  return request({
    url: `/customer/speech_template/${speechTemplateId}`,
    method: 'put',
    data: { url, name, detail }
  })
}

/**
 * 获取话术模板
 * */
export function querySpeechTemplateDetail ({ speechTemplateId }) {
  return request({
    url: `/customer/speech_template/${speechTemplateId}`,
    method: 'get'
  })
}

/**
 * 删除话术模板
 * */
export function removeSpeechTemplate ({ speechTemplateId }) {
  return request({
    url: `/customer/speech_template/${speechTemplateId}`,
    method: 'delete'
  })
}

/**
 * 查询话术内容列表
 * */
export function querySpeechContentList ({ templateId, situation, pageNum, pageSize }) {
  return request({
    url: '/customer/speech_content',
    method: 'get',
    params: { templateId, situation, pageNum, pageSize }
  })
}

/**
 * 新增话术内容
 * */
export function addSpeechContent ({ templateId, situation, content }) {
  return request({
    url: '/customer/speech_content',
    method: 'post',
    data: { templateId, situation, content }
  })
}

/**
 * 更新话术内容
 * */
export function updateSpeechContent ({ templateId, situation, content, speechContentId }) {
  return request({
    url: `/customer/speech_content/${speechContentId}`,
    method: 'put',
    data: { templateId, situation, content, speechContentId }
  })
}

/**
 * 获取话术内容
 * */
export function querySpeechContentDetail ({ speechContentId }) {
  return request({
    url: `/customer/speech_content/${speechContentId}`,
    method: 'get'
  })
}

/**
 * 删除话术内容
 * */
export function removeSpeechContent ({ speechContentId }) {
  return request({
    url: `/customer/speech_content/${speechContentId}`,
    method: 'delete'
  })
}
