import request from '@/utils/request'

export function getQuestionList(query) {
  return request({
    url: '/question',
    method: 'get',
    params: query
  })
}

