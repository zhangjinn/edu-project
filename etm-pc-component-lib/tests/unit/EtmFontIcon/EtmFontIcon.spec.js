import { shallowMount } from '@vue/test-utils'
import EtmFontIcon from '../../../packages/EtmFontIcon/src/EtmFontIcon'

describe('EtmFontIcon组件', () => {
  // 是否存在组件
  it('测试组件是否存在', () => {
    const wrapper = shallowMount(EtmFontIcon)
    expect(wrapper.find('.EtmFontIcon-wrap').exists()).toBeTruthy()
  })

  it('测试prop的名称 plus', () => {
    // 挂载props
    const wrapper = shallowMount(EtmFontIcon, {
      propsData: { name: 'plus' }
    })
    expect(wrapper.find('.el-icon-plus')).toBeTruthy()
  })

  it('测试prop的名称 minus', () => {
    // 挂载props
    const wrapper = shallowMount(EtmFontIcon, {
      propsData: { name: 'minus' }
    })
    expect(wrapper.find('.el-icon-minus')).toBeTruthy()
  })

  it('测试emitClick事件', async() => {
    // 触发Emit事件及参数
    const wrapper = shallowMount(EtmFontIcon)
    wrapper.vm.$emit('click')
    wrapper.vm.$emit('click', 'event')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[1]).toEqual(['event'])
  })
})
