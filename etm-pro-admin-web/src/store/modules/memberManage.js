const state = {
  fold: false, // 会员管理筛选栏（展开/收起）的状态
  gardenState: 'IN', // 会员状态（在园/离园）
  filter: null, // 筛选条件
  currentId: undefined, // 当前操作会员的id，用于查看详情和修改详情
  method: undefined, // 表示表单的（新增/修改会员）状态
  tab: 'basic', // 在新增/修改会员页面中，处于哪一个tab

  // 表单中的必填项是否已经填好
  basic: false,
  status: false,
  item: true,
  food: true,
  medicine: true,

  // 应用设置相关
  settingState: 'member'
}

const mutations = {
  SET_FOLD: (state, fold) => {
    state.fold = fold
  },
  SET_GARDENSTATE: (state, gardenState) => {
    state.gardenState = gardenState
  },
  SET_FILTER: (state, filter) => {
    state.filter = filter
  },
  SET_CURRENTID: (state, id) => {
    state.currentId = id
  },
  SET_METHOD: (state, method) => {
    state.method = method
  },
  SET_TAB: (state, tab) => {
    state.tab = tab
  },
  SET_BASIC: (state, ready) => {
    state.basic = ready
  },
  SET_STATUS: (state, ready) => {
    state.status = ready
  },
  SET_ITEM: (state, ready) => {
    state.item = ready
  },
  SET_FOOD: (state, ready) => {
    state.food = ready
  },
  SET_MEDICINE: (state, ready) => {
    state.medicine = ready
  },
  SET_SETTINGSTATE: (state, setting) => {
    state.settingState = setting
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

