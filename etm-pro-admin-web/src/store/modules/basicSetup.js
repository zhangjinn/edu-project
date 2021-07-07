const state = {
  setting: 'custom',
  drawer: false,
  keyword: '',
  mode: 'add', // 字符型add表示添加新信息，数值型id则表示修改某条数据的信息
  handle: 0, // 记录增删改的操作次数，作为table数据更新时机的依赖
  menu: [ // 设置标题和路由的对应关系
    {
      title: '客户字段设置',
      tag: 'custom',
      authId: 'customer.child.setting'
    },
    {
      title: '跟进记录设置',
      tag: 'follow',
      authId: 'customer.followRules.setting'
    }

  ],
  form: {
    name: '',
    isFill: '',
    isDisplay: '',
    fieldType: '',
    type: '',
    option: [],
    second: [],
    explain: ''
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
  },
  filterMenu: state => {
    const reg = new RegExp(state.keyword)
    const menu = [
      {
        title: '客户字段设置',
        tag: 'custom'
      },
      {
        title: '跟进设置',
        tag: 'follow'
      },
      {
        title: '来源设置',
        tag: 'source'
      },
      {
        title: '销售阶段设置',
        tag: 'sale'
      },
      {
        title: '重要程度设置',
        tag: 'importance'
      },
      {
        title: '客户状态设置',
        tag: 'state'
      },
      {
        title: '联系人称呼设置',
        tag: 'contact'
      }
    ]
    state.menu = menu.filter(v => reg.test(v.title))
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
