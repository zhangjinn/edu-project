const Mock = require('mockjs')
const Random = Mock.Random

// TODO: 应用设置 收费项目/预警天数/有效期
export default [
  /**
   * 新增收费项目
   * @param data
   */
  {
    url: '/sacc/application_setting/item',
    method: 'post',
    data: {
      'name': Random.cname(),
      'price|1-200.1-10': 100,
      'isDefault': 0,
      'fkWarningId': 1
    }
  },

  /**
   * 查询收费项目详情
   * @param id
   */
  {
    url: '/sacc/application_setting/item/',
    method: 'get',
    data: {
      'id|1-10': 1,
      'name': Random.cname(),
      'price|1-20000': 10000,
      'isDefault|1': [0, 1],
      'fkWarningId': 1,
      'fkOrganizationId': 4
    }
  },

  // TODO 没有分页?
  /**
   * 查询收费项目列表
   */
  {
    url: '/sacc/application_setting/item',
    method: 'get',
    data: {
      'data|1-10': [
        {
          'id|1-10': 1,
          'name': Random.cname(),
          'price|1-20000': 10000,
          'isDefault|1': [0, 1],
          'fkWarningId': 1,
          'fkOrganizationId': 4,
          'days|1-30': 1
        }
      ]
    }
  },

  // TODO 没有分页?
  /**
   * 查询默认收费项目列表
   */

  {
    url: '/sacc/application_setting/item/default',
    method: 'get',
    data: {
      'id': Random.id(),
      'name': Random.cname(),
      'chargeAmount|1-20000': 10000,
      'default|1': false,
      'warndayId': Random.id()
    }
  },

  /**
   * 修改收费项目
   * @param data
   */
  {
    url: '/sacc/application_setting/item',
    method: 'put',
    data: {
      'id': Random.id(),
      'name': Random.cname(),
      'price|1-200.1-2': 100.23,
      'isDefault': 0,
      'fkWarningId': Random.id()
    }
  },

  /**
   * 删除收费项目
   * @param id
   */
  {
    url: '/sacc/application_setting/item/1',
    method: 'delete',
    data: {}
  },

  // TODO 预警
  // 新建预警天数
  {
    url: '/sacc/application_setting/warning',
    method: 'post',
    data: {
      'day|1-10': 1
    }
  },

  /**
   * 查询预警天数详情
   * @param id
   */
  {
    url: '/sacc/application_setting/warning/',
    method: 'get',
    data: {
      'id|1-10': 1,
      'day|1-10': 1,
      'fkOrganizationId': 4
    }
  },

  // TODO 没有分页?
  /**
   * 查询预警天数列表
   */
  {
    url: '/sacc/application_setting/warning',
    method: 'get',
    data: {
      'data|1-10': [
        {
          'id|1-10': 1,
          'day|1-30': 1,
          'fkOrganizationId': 4
        }
      ]
    }
  },

  /**
   * 修改预警天数
   * @param data
   */
  {
    url: '/sacc/application_setting/warning',
    method: 'put',
    data: {
      'id|1-10': 1,
      'day|1-10': 1
    }
  },
  /**
   * 删除预警天数
   * @param id
   */
  {
    url: '/sacc/application_setting/warning/1',
    method: 'delete',
    data: {}
  },

  /**
   * 新建有效期
   * @param data
   */
  {
    url: '/sacc/application_setting/validity',
    method: 'post',
    data: {
      'name': Random.cname(),
      'dayNum|1-10': 1
    }
  },

  /**
   * 查询有效期详情
   * @param id
   */
  {
    url: '/sacc/application_setting/validity/',
    method: 'get',
    data: {
      'id': Random.id(),
      'name': Random.ctitle(),
      'day|1-30': 1,
      'fkOrganizationId': 4,
      'isDefault|1': [0, 1]
    }
  },

  /**
   * 查询有效期列表
   */
  {
    url: '/sacc/application_setting/validity',
    method: 'get',
    data: {
      'data|1-10': [
        {
          'id': Random.id(),
          'name': Random.ctitle(),
          'day|1-30': 1,
          'isDefault|1': [0, 1],
          'fkOrganizationId': 4
        }
      ]
    }
  },

  /**
   * 修改有效期
   * @param data
   */
  {
    url: '/sacc/application_setting/validity',
    method: 'put',
    data: {
      'id': Random.id(),
      'name': Random.cname(),
      'day|1-10': 1
    }
  },

  /**
   * 删除有效期
   * @param id
   */
  {
    url: '/sacc/application_setting/validity/1',
    method: 'delete',
    data: {}
  }

]
