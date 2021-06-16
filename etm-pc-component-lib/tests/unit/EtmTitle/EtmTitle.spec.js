import { createLocalVue, mount } from '@vue/test-utils'
import EtmTitle from '../../../packages/EtmTitle/src/EtmTitle'
import { Button } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Button)

describe('EtmTitle组件', () => {
  it('测试slot', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      slots: {
        default: `<h1>标题</h1>`,
        tool: '<div class="tool">工具slot</div>'
      }
    })
    expect(wrapper.find('.text h1').text()).toBe('标题')
    expect(wrapper.find('.tool').text()).toBe('工具slot')
  })

  it('测试props title', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        title: '油麦菜'
      }
    })
    expect(wrapper.find('.text').text()).toBe('油麦菜')
  })

  it('测试props border', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        border: true
      }
    })
    expect(wrapper.find('.bdb').exists()).toBeTruthy()
  })

  it('测试props showLine', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        border: false,
        showLine: true
      }
    })
    expect(wrapper.find('.line').exists()).toBeFalsy()
  })

  it('测试props showToggle', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        showToggle: true
      }
    })
    expect(wrapper.find('.tool-btn .el-button').exists()).toBeTruthy()
  })

  it('测试props openText', async() => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        showToggle: true,
        openText: '油麦菜'
      }
    })
    await wrapper.find('.tool-btn>div').trigger('click')
    expect(wrapper.find('.tool-btn .el-button').text()).toBe('油麦菜')
  })

  it('测试props closeText', () => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        showToggle: true,
        closeText: '油麦菜'
      }
    })
    expect(wrapper.find('.el-button').text()).toBe('油麦菜')
  })

  it('测试emitClick事件', async() => {
    const wrapper = mount(EtmTitle, {
      localVue,
      propsData: {
        showToggle: true
      }
    })
    await wrapper.find('.tool-btn>div').trigger('click')
    expect(wrapper.emitted().toggle).toBeTruthy()
    expect(wrapper.emitted().toggle[0]).toEqual([false])
  })
})
