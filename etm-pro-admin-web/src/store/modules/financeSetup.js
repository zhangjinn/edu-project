const state = {
  setting: 'valid',
  drawer: false,
  mode: 'add', // 字符型add表示添加新信息，数值型id则表示修改某条数据的信息
  handle: 0, // 记录增删改的操作次数，作为table数据更新时机的依赖
  menu: [ // 设置标题和路由的对应关系
    {
      title: '有效期设置',
      tag: 'valid'
    },
    {
      title: '预警天数设置',
      tag: 'alert'
    },
    {
      title: '收费项目设置',
      tag: 'charge'
    }
  ],
  form: {
    name: '',
    count: '',
    attribute: undefined,
    days: ''
  }
}

const mutations = {
  SET_SETTING: (state, setting) => {
    state.setting = setting
  },
  SET_DRAWER: (state, status) => {
    state.drawer = status
  },
  SET_KEYWORD: (state, keyword) => {
    state.keyword = keyword
  },
  SET_MODE: (state, mode) => {
    state.mode = mode
  },
  ADD_HANDLE: state => {
    state.handle++
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
