import { createLocalVue, mount } from '@vue/test-utils'
import EtmFormFoot from '../../../packages/EtmFormFoot/src/EtmFormFoot'
import { Button } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Button)
// const stubs = ['el-button']

describe('EtmFormFoot组件', () => {
  it('测试默认的两个按钮是否存在', () => {
    const wrapper = mount(EtmFormFoot, {
      localVue,
      computed: {
        labelWidth: () => ''
      }
    })
    expect(wrapper.findAll('.el-button').length).toBe(2)
  })

  it('测试挂载slot', () => {
    const wrapper = mount(EtmFormFoot, {
      localVue,
      computed: {
        labelWidth: () => ''
      },
      slots: {
        default: `<el-button type="primary">确定</el-button>`
      }
    })
    expect(wrapper.find('.el-button').text()).toBe('确定')
  })

  it('测试props', () => {
    const wrapper = mount(EtmFormFoot, {
      localVue,
      computed: {
        labelWidth: () => ''
      },
      propsData: {
        saveBtn: '确定',
        cancelBtn: '不了'
      }
    })
    expect(wrapper.findAll('.el-button').at(0).text()).toBe('确定')
    expect(wrapper.findAll('.el-button').at(1).text()).toBe('不了')
  })

  it('测试按钮emitClick事件', () => {
    const wrapper = mount(EtmFormFoot, {
      localVue,
      computed: {
        labelWidth: () => ''
      }
    })
    wrapper.findAll('.el-button').at(0).trigger('click')
    wrapper.findAll('.el-button').at(1).trigger('click')
    expect(wrapper.emitted().save).toBeTruthy()
    expect(wrapper.emitted().cancel).toBeTruthy()
  })
})
