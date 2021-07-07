import SERVER_CODE_MAP from './server_code_map'
import MODULE_CODE_MAP from './module_code_map'
import METHOD_CODE_MAP from './method_code_map'

const CODE_HASH = {}
for (const serverCodeMapElement in SERVER_CODE_MAP) {
  const server = {
    code: SERVER_CODE_MAP[serverCodeMapElement]
  }
  for (const moduleCodeMapElement in MODULE_CODE_MAP) {
    server[moduleCodeMapElement] = {
      code: MODULE_CODE_MAP[moduleCodeMapElement]
    }
    for (const methodCodeMapElement in METHOD_CODE_MAP) {
      server[moduleCodeMapElement][methodCodeMapElement] = {
        code: METHOD_CODE_MAP[methodCodeMapElement]
      }
      CODE_HASH[serverCodeMapElement] = server
    }
  }
}
export { CODE_HASH }

