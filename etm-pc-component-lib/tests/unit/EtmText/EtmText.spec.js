import { shallowMount } from '@vue/test-utils'
import EtmText from '../../../packages/EtmText/src/EtmText'

describe('EtmText组件', () => {
  // 是否存在组件
  it('测试按钮是否存在', () => {
    const wrapper = shallowMount(EtmText)
    expect(wrapper.find('.etm-text--button').exists()).toBeTruthy()
  })

  it('测试挂载slot', () => {
    // 挂载slots
    const wrapper = shallowMount(EtmText, {
      slots: {
        default: ['EtmText按钮']
      }
    })
    expect(wrapper.find('.etm-text--button').text()).toBe('EtmText按钮')
  })

  it('测试prop的类型normal', () => {
    // 挂载props
    const wrapper = shallowMount(EtmText, {
      propsData: { type: 'normal' }
    })
    expect(wrapper.find('.etm-text--normal')).toBeTruthy()
  })

  it('测试prop的类型 danger', () => {
    const wrapper = shallowMount(EtmText, {
      propsData: { type: 'danger' }
    })
    expect(wrapper.find('.etm-text--danger')).toBeTruthy()
  })

  it('测试prop的类型 success', () => {
    const wrapper = shallowMount(EtmText, {
      propsData: { type: 'success' }
    })
    expect(wrapper.find('.etm-text--success')).toBeTruthy()
  })

  it('测试prop的类型 warn', () => {
    const wrapper = shallowMount(EtmText, {
      propsData: { type: 'warn' }
    })
    expect(wrapper.find('.etm-text--warn')).toBeTruthy()
  })

  it('测试emitClick事件', async() => {
    // 触发Emit事件及参数
    const wrapper = shallowMount(EtmText)
    wrapper.vm.$emit('click')
    wrapper.vm.$emit('click', 'event')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[1]).toEqual(['event'])
  })

  it('测试组件方法 handleClick', async() => {
    const wrapper = shallowMount(EtmText, {})
    wrapper.vm.handleClick(22)
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click.length).toBe(1)
    expect(wrapper.emitted().click[0]).toEqual([22])
  })
})
