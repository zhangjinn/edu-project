const Mock = require('mockjs')
const Random = Mock.Random
// TODO: 自定义会员字段

export default [
  /**
   * 新增字段
   */
  {
    url: '/sacc/customer/eav/attribute',
    method: 'post',
    data: {
      'name': '自定义字段名称:' + Random.ctitle(5),
      'type': 0,
      'controlType': 0,
      'description': '字段描述:' + Random.cname(),
      'organizationIds': [4, 14],
      'mandatory': Random.boolean(),
      'visible': Random.boolean(),
      'options': ['选项1', '选项2']
    }
  },

  /**
   * 删除字段
   */
  {
    url: '/sacc/customer/eav/attribute',
    method: 'delete',
    data: {}
  },

  /**
   * 更新字段
   */
  {
    url: '/customer/eav/attribute/1',
    method: 'put',
    data: {
      'name': '自定义字段名称:' + Random.ctitle(5),
      'type': 0,
      'controlType': 0,
      'description': '字段描述:' + Random.sentence(5),
      'organizationIds': [4, 14],
      'mandatory': Random.boolean(),
      'visible': Random.boolean(),
      'options': ['选项1', '选项2']
    }
  },

  /**
   * 更新字段排序
   */
  {
    url: '/customer/eav/attribute/sort',
    method: 'put',
    data: [
      {
        'id': 1,
        'sortIndex': 1,
        'type': 'EAV'
      },
      {
        'id': 2,
        'sortIndex': 3,
        'type': 'BASIC'
      }
    ]
  },

  /**
   * 获取字段
   */
  {
    url: '/sacc/customer/eav/attribute',
    method: 'get',
    data: {
      'data|3-10': [
        {
          'attributeId|1-20': 1,
          'name': Random.cname(),
          'fieldName': Random.cfirst(),
          'description': Random.cparagraph(),
          'entityType|1': ['BASIC', 'EAV'],
          'attributeType|1': ['TEXT', 'DECIMAL', 'DATE'],
          'controlType|1': ['INPUT_BOX', 'RADIO', 'CHECKBOX', 'SELECT_BOX', 'DATE'],
          'sortIndex': 1,
          'mandatory|1': true,
          'visible|1': true,
          'fix|1': true,
          'options': ['选项1', '选项2'],
          'organizationId': 4,
          'organizationName': '南海集团-总部'
        }
      ]
    }
  }

]
