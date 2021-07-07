import SERVER_CODE_MAP from './server_code_map'
import MODULE_CODE_MAP from './module_code_map'
import METHOD_CODE_MAP from './method_code_map'

const { create, query, update, remove, active, disable, exam, assign } = METHOD_CODE_MAP

const CODE_HASH = {
  // 基础服务
  basic: {
    code: SERVER_CODE_MAP.basic,
    // 员工
    employee: {
      code: MODULE_CODE_MAP.employee,
      // 具体功能
      create, query, update, remove, active, disable,
      customQueryExample: {
        code: '999'
      }
    },
    // 企业
    organization: {
      code: MODULE_CODE_MAP.department,
      create, query, update, remove
    },
    // 部门
    department: {
      code: MODULE_CODE_MAP.department,
      create, query, update, remove
    },
    // 岗位
    position: {
      code: MODULE_CODE_MAP.position,
      create, query, update, remove
    }
  },
  // sacc
  sacc: {
    code: SERVER_CODE_MAP.sacc,
    enroll: {
      code: MODULE_CODE_MAP.enroll,
      create, update, remove, exam
    }
  },
  // CRM客户跟进
  customer: {
    code: SERVER_CODE_MAP.customer,
    crm: {
      code: MODULE_CODE_MAP.crm,
      create, query, update, remove, assign
    }
  }
}
export { CODE_HASH }

