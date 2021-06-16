import { shallowMount } from '@vue/test-utils'
import EtmScreenTab from '../../../packages/EtmScreenTab/src/EtmScreenTab'

describe('EtmScreenTab组件', () => {
  const props = {
    currentValue: '',
    options: []
  }
  // 是否存在组件
  it('测试组件是否存在', () => {
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { ...props }
    })
    expect(wrapper.find('.EtmScreenTab-wrap').exists()).toBeTruthy()
  })

  it('测试prop的标题 title', () => {
    // 挂载props
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { title: '标题', ...props }
    })
    expect(wrapper.find('.screenTabTitle').text()).toBe('标题:')
  })

  it('测试prop的多选multiple true', () => {
    // 挂载props
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { multiple: true, ...props }
    })
    expect(wrapper.find('.is-multiple')).toBeTruthy()
  })

  it('测试prop的多选multiple false', () => {
    // 挂载props
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { multiple: false, ...props }
    })
    expect(wrapper.find('.is-multiple').exists()).toBeFalsy()
  })

  it('测试prop的禁选disabled true', () => {
    // 挂载props
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { disabled: true, ...props }
    })
    expect(wrapper.find('.not-click')).toBeTruthy()
  })

  it('测试prop的禁选disabled false', () => {
    // 挂载props
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { disabled: false, ...props }
    })
    expect(wrapper.find('.not-click').exists()).toBeFalsy()
  })

  it('测试emitClick事件', async() => {
    // 触发Emit事件及参数
    const wrapper = shallowMount(EtmScreenTab, {
      propsData: { ...props }
    })
    wrapper.vm.$emit('click')
    wrapper.vm.$emit('click', 'event')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[1]).toEqual(['event'])
  })
})
