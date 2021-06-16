import { createLocalVue, mount } from '@vue/test-utils'
import EtmTable from '../../../packages/EtmTable/src/EtmTable'
import { Table, TableColumn } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Table)
localVue.use(TableColumn)

describe('EtmTable组件', () => {
  let wrapper = null
  beforeAll(() => {
    wrapper = mount(EtmTable, {
      localVue
    })
  })
  afterAll(() => {
    wrapper.destroy()
  })
  // afterEach(() => {
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
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
    const wrapper = mount(EtmTable, {
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

  it('测试props align的类型left', async() => {
    await wrapper.setProps({
      align: 'left',
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
    expect(wrapper.find('.el-table__header-wrapper .is-left').exists()).toBeTruthy()
    expect(wrapper.find('.el-table__body-wrapper .is-left').exists()).toBeTruthy()
  })

  it('测试props align的类型center', async() => {
    await wrapper.setProps({
      align: 'center',
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
    expect(wrapper.find('.el-table__header-wrapper .is-center').exists()).toBeTruthy()
    expect(wrapper.find('.el-table__body-wrapper .is-center').exists()).toBeTruthy()
  })

  it('测试props align的类型right', async() => {
    await wrapper.setProps({
      align: 'right',
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
    expect(wrapper.find('.el-table__header-wrapper .is-right').exists()).toBeTruthy()
    expect(wrapper.find('.el-table__body-wrapper .is-right').exists()).toBeTruthy()
  })

  it('测试props 某个col的align类型left', async() => {
    await wrapper.setProps({
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
      data: [
        {
          name: '油麦菜',
          age: 18,
          sex: '男'
        }
      ],
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
      data: [
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
      ],
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
      data: [
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
      ],
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
      data: [
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
      ],
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
      data: [
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
      ],
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
    const data = [
      {
        name: null,
        age: '',
        sex: undefined
      }
    ]
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
      wrapper.vm.transformDataNullToSymbol(data)
      expect(data[0].name).toBe('--')
      expect(data[0].age).toBe('--')
      expect(data[0].sex).toBe('--')
      done()
    })
  })
})
