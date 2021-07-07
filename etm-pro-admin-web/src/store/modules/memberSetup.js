const state = {
  setting: 'custom',
  drawer: false,
  mode: 'add', // 字符型add表示添加新信息，数值型id则表示修改某条数据的信息
  handle: 0, // 记录增删改的操作次数，作为table数据更新时机的依赖
  menu: [ // 设置标题和路由的对应关系
    {
      title: '会员字段',
      tag: 'custom'
    },
    {
      title: '联系人称呼设置',
      tag: 'contact'
    }
  ],
  type: ''
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
  SET_TYPE: (state, type) => {
    state.type = type
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
