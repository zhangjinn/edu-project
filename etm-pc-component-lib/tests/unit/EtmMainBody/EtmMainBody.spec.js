import { mount } from '@vue/test-utils'
import EtmMainBody from '../../../packages/EtmMainBody/src/EtmMainBody'

describe('EtmMainBody组件', () => {
  it('props bread测试', async() => {
    const wrapper = mount(EtmMainBody)

    expect(wrapper.exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.props('bread')).toBeFalsy()
  })

  it('props historyKey测试', async() => {
    const wrapper = mount(EtmMainBody, {
      propsData: {
        historyKey: 'historyKey'
      }
    })

    expect(wrapper.exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.props('historyKey')).toBe('historyKey')
  })

  it('props breadData测试', async() => {
    const wrapper = mount(EtmMainBody, {
      propsData: {
        breadData: []
      }
    })

    expect(wrapper.exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.breadData).toEqual([])
  })

  it('测试挂载slot', async() => {
    // 挂载slots
    const wrapper = mount(EtmMainBody, {
      slots: {
        default: '<div>默认HTML</div>'
      }
    })
    expect(wrapper.exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.etm-main-body > .content').text()).toBe('默认HTML')
  })
})

