const state = {
  dialog: false,
  drawer: false,
  showTree: 'organization', // 显示组织还是外部联系人对应的联系人信息
  showId: '', // 根据id显示对应组织的联系人信息
  employeeList: '',
  keyword: '', // 查询通讯录关键字
  orgName: '广州六米网络科技', // 选中的组织名
  employeeCount: 0 // 选中组织下的员工人数
}

const mutations = {
  SET_DIALOG: (state, status) => {
    state.dialog = status
  },
  SET_DRAWER: (state, status) => {
    state.drawer = status
  },
  SET_SHOWTREE: (state, tree) => {
    state.showTree = tree
  },
  SET_SHOWID: (state, id) => {
    state.showId = id
  },
  SET_EMPLOYEELIST: (state, row) => {
    state.employeeList = row
  },
  SET_KEYWORD: (state, word) => {
    state.keyword = word
  },
  SET_ORGNAME: (state, name) => {
    state.orgName = name
  },
  SET_EMPLOYEECOUNT: (state, count) => {
    state.employeeCount = count
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
