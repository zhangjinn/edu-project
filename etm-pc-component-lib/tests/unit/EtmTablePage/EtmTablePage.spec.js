import { createLocalVue, mount } from '@vue/test-utils'
import EtmTablePage from '../../../packages/EtmTablePage/src/EtmTablePage'
import { Table, TableColumn, Pagination } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Table)
localVue.use(TableColumn)
localVue.use(Pagination)

describe('EtmTablePage组件', () => {
  let wrapper
  beforeAll(() => {
    wrapper = mount(EtmTablePage, {
      localVue
    })
  })
  // afterAll(() => {
  //   wrapper.destroy()
  // })

  it('测试表头名是否正确', async() => {
    await wrapper.setProps({
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__header-wrapper .el-table_1_column_1 .cell').text()).toBe('姓名')
    expect(wrapper.find('.el-table__header-wrapper .el-table_1_column_2 .cell').text()).toBe('年龄')
    expect(wrapper.find('.el-table__header-wrapper .el-table_1_column_3 .cell').text()).toBe('性别')
    // wrapper.destroy()
  })

  it('测试数据是否正确', async() => {
    await wrapper.setProps({
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__body-wrapper .el-table_1_column_1 .cell').text()).toBe('油麦菜')
    expect(wrapper.find('.el-table__body-wrapper .el-table_1_column_2 .cell').text()).toBe('18')
    expect(wrapper.find('.el-table__body-wrapper .el-table_1_column_3 .cell').text()).toBe('男')
  })

  it('测试props border的类型true', () => {
    wrapper.setProps({
      propsData: {
        border: true
      }
    })
    expect(wrapper.find('.el-table--border').exists()).toBe(true)
  })

  it('测试props border的类型false', done => {
    const wrapper = mount(EtmTablePage, {
      localVue,
      propsData: {
        border: false
      }
    })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.el-table--border').exists()).toBe(false)
      done()
    })
  })

  it('测试props 某个col的align类型left', async() => {
    await wrapper.setProps({
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'left'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.el-table__header-wrapper th[class*="el-table_1_column_2  is-left"]').exists()).toBe(true)
      expect(wrapper.find('.el-table__body-wrapper td[class*="el-table_1_column_2 is-left"]').exists()).toBeTruthy()
    })
  })

  it('测试props 某个col的align类型right', async() => {
    await wrapper.setProps({
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'right'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.el-table__header-wrapper th[class*="el-table_1_column_2  is-right"]').exists()).toBeTruthy()
      expect(wrapper.find('.el-table__body-wrapper td[class*="el-table_1_column_2 is-right"]').exists()).toBeTruthy()
    })
  })

  it('测试props 某个col的align类型center', async() => {
    await wrapper.setProps({
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'center'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.el-table__header-wrapper th[class*="el-table_1_column_2  is-center"]').exists()).toBeTruthy()
      expect(wrapper.find('.el-table__body-wrapper td[class*="el-table_1_column_2 is-center"]').exists()).toBeTruthy()
    })
  })

  it('测试props stripe的类型true', async() => {
    await wrapper.setProps({
      stripe: true,
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          },
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'center'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__row--striped').exists()).toBeTruthy()
  })

  it('测试props index的类型true', async() => {
    await wrapper.setProps({
      index: true,
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          },
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'center'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__header-wrapper .el-table_1_column_4>.cell').text()).toBe('序号')
    expect(wrapper.find('.el-table__body-wrapper .el-table_1_column_4>.cell').text()).toBe('1')
  })

  it('测试props 当index的类型为true时，indexLabel的值', async() => {
    await wrapper.setProps({
      index: true,
      indexLabel: '油麦菜序号',
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          },
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'center'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__header-wrapper .el-table_1_column_4>.cell').text()).toBe('油麦菜序号')
    expect(wrapper.find('.el-table__body-wrapper .el-table_1_column_4>.cell').text()).toBe('1')
  })

  it('测试props selection的类型true', async() => {
    await wrapper.setProps({
      selection: true,
      data: {
        content: [
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          },
          {
            name: '油麦菜',
            age: 18,
            sex: '男'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age',
          align: 'center'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })
    expect(wrapper.find('.el-table__header-wrapper .el-table-column--selection').exists()).toBeTruthy()
    expect(wrapper.find('.el-table__body-wrapper .el-table-column--selection').exists()).toBeTruthy()
  })

  it('测试数据为空(null,undefined,"")时显示--', async done => {
    const data = {
      content: [
        {
          name: null,
          age: '',
          sex: undefined
        }
      ]
    }
    await wrapper.setProps({
      data,
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '性别',
          prop: 'sex'
        }
      ]
    })

    wrapper.vm.$nextTick(() => {
      wrapper.vm.transformDataNullToSymbol(data.content)
      expect(data.content[0].name).toBe('--')
      expect(data.content[0].age).toBe('--')
      expect(data.content[0].sex).toBe('--')
      done()
    })
  })

  it('测试数据为空时的缺省图片是否存在', async done => {
    const data = {
      content: []
    }
    await wrapper.setProps({
      data,
      columns: [
        {
          label: '姓名1',
          prop: 'name'
        },
        {
          label: '年龄1',
          prop: 'age'
        },
        {
          label: '性别1',
          prop: 'gender'
        }
      ]
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.EtmEmpty-wrap img').exists()).toBe(true)
      done()
    })
  })

  it('测试el-Pagination组件是否存在', () => {
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('测试emitCurrentChange事件', async() => {
    const wrapper = mount(EtmTablePage, {
      localVue,
      data() {
        return {
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        }
      }
    })
    await wrapper.vm.currentChange(3)
    expect(wrapper.emitted().currentChange).toBeTruthy()
    expect(wrapper.emitted().currentChange[0]).toEqual([3, 10])
  })

  it('测试emitSizeChange事件', async() => {
    const wrapper = mount(EtmTablePage, {
      localVue,
      data() {
        return {
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        }
      }
    })
    await wrapper.vm.sizeChange(20)
    expect(wrapper.emitted().currentChange).toBeTruthy()
    expect(wrapper.emitted().currentChange[0]).toEqual([1, 20])
  })

  // #TODO 测试默认当前页是第一页 搞不定
  // it('测试默认当前页是第一页', async() => {
  //   const wrapper = mount(EtmTablePage, {
  //     localVue,
  //     propsData: {
  //       showPage: true,
  //       data: {
  //         content: [
  //           {
  //             name: '油麦菜',
  //             age: 18,
  //             sex: '男'
  //           }
  //         ]
  //       },
  //       columns: [
  //         {
  //           label: '姓名',
  //           prop: 'name'
  //         },
  //         {
  //           label: '年龄',
  //           prop: 'age'
  //         },
  //         {
  //           label: '性别',
  //           prop: 'sex'
  //         }
  //       ]
  //     }
  //     // data() {
  //     //   return {
  //     //     pageInfo: {
  //     //       pageNum: 1,
  //     //       pageSize: 10
  //     //     }
  //     //   }
  //     // }
  //   })
  //   await wrapper.vm.$nextTick()
  //   console.log(wrapper.vm.$data.pageInfo)
  //   console.log(wrapper.vm.$data.pageInfo.pageNum)
  //   console.log(wrapper.vm.$data.pageInfo.pageSize)
  //   console.log(wrapper.find('.el-pager').html())
  //   // expect(wrapper.find('.el-pager')).toBe(true)
  // })
})
