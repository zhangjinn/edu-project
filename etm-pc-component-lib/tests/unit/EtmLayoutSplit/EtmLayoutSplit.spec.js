import { mount } from '@vue/test-utils'
import EtmLayoutSplit from '../../../packages/EtmLayoutSplit/src/EtmLayoutSplit'

describe('EtmLayoutSplit组件', () => {
  it('测试是否存在所有布局', () => {
    const wrapper = mount(EtmLayoutSplit)

    expect(wrapper.find('.layout-left').exists()).toBe(false)
    expect(wrapper.find('.layout-right').exists()).toBe(false)
    expect(wrapper.find('.layout-header').exists()).toBe(false)
    expect(wrapper.find('.layout-body').exists()).toBe(false)
    expect(wrapper.find('.layout-default').exists()).toBe(false)
  })
  it('测试挂载slot.left', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        left: ['我是左布局']
      }
    })
    expect(wrapper.find('.layout-left').text()).toBe('我是左布局')
  })

  it('测试挂载slot.right', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        left: ['我是左布局'],
        right: ['我是右布局']
      }
    })
    expect(wrapper.find('.layout-right').text()).toBe('我是右布局')
  })

  it('测试挂载slot.header', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        header: ['我是头部布局']
      }
    })
    expect(wrapper.find('.layout-header').text()).toBe('我是头部布局')
  })

  it('测试挂载slot.body', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        header: ['我是头部布局'],
        body: ['我是body布局']
      }
    })
    expect(wrapper.find('.layout-body').text()).toBe('我是body布局')
  })

  it('测试挂载slot.default', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        default: ['我是默认布局']
      }
    })
    expect(wrapper.find('.layout-default').text()).toBe('我是默认布局')
  })

  it('测试prop值styles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      propsData: {
        styles: { width: '100px' }
      }
    })

    expect(wrapper.find('.EtmLayoutSplit-wrap').attributes('style')).toBe('width: 100px;')
  })

  it('测试prop值leftStyles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        left: ['这是左布局']
      },
      propsData: {
        leftStyles: { width: '100px' }
      }
    })

    expect(wrapper.find('.layout-left').attributes('style')).toBe('width: 100px;')
  })

  it('测试prop值rightStyles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        left: ['这是左布局'],
        right: ['这是右布局']
      },
      propsData: {
        rightStyles: { width: '100px' }
      }
    })

    expect(wrapper.find('.layout-right').attributes('style')).toBe('width: 100px;')
  })

  it('测试prop值headerStyles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        header: ['这是头部布局']
      },
      propsData: {
        headerStyles: { width: '100px' }
      }
    })

    expect(wrapper.find('.layout-header').attributes('style')).toBe('width: 100px;')
  })

  it('测试prop值bodyStyles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        header: ['这是头部布局'],
        body: ['这是Body布局']
      },
      propsData: {
        bodyStyles: { width: '100px' }
      }
    })

    expect(wrapper.find('.layout-body').attributes('style')).toBe('width: 100px;')
  })

  it('测试prop值defaultStyles', () => {
    const wrapper = mount(EtmLayoutSplit, {
      slots: {
        default: ['这是default布局']
      },
      propsData: {
        defaultStyles: { width: '100px' }
      }
    })

    expect(wrapper.find('.layout-default').attributes('style')).toBe('width: 100px;')
  })
})
