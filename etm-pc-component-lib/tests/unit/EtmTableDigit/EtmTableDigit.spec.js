import { mount } from '@vue/test-utils'
import EtmTableDigit from '../../../packages/EtmTableDigit/src/EtmTableDigit'

describe('EtmTableDigit组件', () => {
  it('测试元素是否渲染', () => {
    const wrapper = mount(EtmTableDigit)
    expect(wrapper.find('.EtmTableDigit-wrap').exists()).toBeTruthy()
  })

  it('测试prop 为空不渲染数据元素', () => {
    const wrapper = mount(EtmTableDigit, {
      propsData: {
        data: []
      }
    })
    expect(wrapper.find('.table-digit').exists()).toBe(false)
  })

  it('测试prop', () => {
    const wrapper = mount(EtmTableDigit, {
      propsData: {
        data: [
          {
            digit: 12,
            text: '测试001'
          }
        ]
      }
    })
    expect(wrapper.find('.top-digit').text()).toBe('12')
    expect(wrapper.find('.bottom-text').text()).toBe('测试001')
  })
})
