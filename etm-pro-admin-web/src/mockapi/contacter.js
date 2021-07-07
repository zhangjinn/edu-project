const Mock = require('mockjs')
const Random = Mock.Random

export default [
  // 修改联系人
  {
    url: '/sacc/dictionaries/1',
    method: 'put',
    data: {
      'value': Random.cname(),
      'organizationIds': [
        4
      ],
      'type': 'CONTACTS'
    }
  },
  // 删除联系人
  {
    url: '/sacc/dictionaries/1',
    method: 'delete',
    data: ''
  },
  // 新增联系人称呼
  {
    url: 'sacc/dictionaries',
    method: 'post',
    data: {
      'value': Random.cname(),
      'organizationIds': [4, 14],
      'type': 'CONTACTS'
    }
  },
  // 通过类型获取联系人
  {
    url: '/sacc/dictionaries/CONTACTS',
    method: 'get',
    data: {
      'data|3-10': [{
        'id|1-100': 1,
        'value': Random.cname(), // 联系人称呼的名称
        'organizationName': '南海集团-总部', // 应用的企业名称
        'organizationId': 4// 应用的企业id
      }]
    }
  }
]
