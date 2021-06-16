import { createLocalVue, shallowMount } from '@vue/test-utils'
import EtmTabs from '../../../packages/EtmTabs/src/EtmTabs'
import { Button, TabPane, Tabs } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Tabs)
localVue.use(TabPane)
localVue.use(Button)

const props = {
  value: ''
}

describe('EtmTabs', () => {
  it('测试组件是否渲染', () => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props
      }
    })
    expect(wrapper.find('.EtmTabs-wrap').exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('测试组件prop ：setting = true, 及相关属性 ', () => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props,
        setting: true,
        settingText: '设置'
      }
    })
    expect(wrapper.find('.setting').text()).toBe('设置')
    wrapper.destroy()
  })

  it('测试组件prop: setting = false', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props,
        setting: false
      }
    })
    expect(wrapper.find('.setting').exists()).toBe(false)
    wrapper.destroy()
  })

  it('测试组件挂载slot: tool ', () => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props
      },
      slots: {
        tool: '<div class="test-tool"></div>'
      }
    })
    expect(wrapper.find('.test-tool').exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('测试组件挂载slot: default ', () => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props
      },
      slots: {
        default: ['<el-tab-pane class="pane-1" label="1" name="1">1</el-tab-pane>', '<el-tab-pane class="pane-2" label="2" name="2">2</el-tab-pane>']
      }
    })
    expect(wrapper.find('.pane-1').exists()).toBeTruthy()
    expect(wrapper.find('.pane-2').exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('测试组件prop: showToggle = false', () => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        showToggle: false,
        ...props
      }
    })
    expect(wrapper.find('.el-icon-arrow-up').exists()).toBeFalsy()
    expect(wrapper.find('.el-icon-arrow-down').exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('测试组件prop: showToggle = true, 以及 openText, closeText', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props,
        showToggle: true,
        openText: '收起',
        closeText: '展开'
      }
    })
    expect(wrapper.find('.tool').text()).toEqual('收起')
    expect(wrapper.find('.tool > div').trigger('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tool').text()).toEqual('展开')
    wrapper.destroy()
  })

  it('测试组件prop: showToggle = false', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props,
        showToggle: false
      }
    })
    expect(wrapper.find('.tool > div').exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('测试emit已发出的事件', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props
      }
    })
    wrapper.vm.$emit('toggle', true)
    wrapper.vm.$emit('input', '2')
    wrapper.vm.$emit('setting')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().toggle[0]).toEqual([true])
    expect(wrapper.emitted().input[0]).toEqual(['2'])
    expect(wrapper.emitted().setting).toBeTruthy()
    wrapper.destroy()
  })

  it('测试EtmTabs Methods函数测试', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        value: 'event'
      },
      data() {
        return {
          show: false
        }
      }
    })
    wrapper.vm.toggle()
    wrapper.vm.toggle()
    wrapper.vm.appSetting()
    wrapper.vm.tabClick()
    expect(wrapper.emitted().toggle[0]).toEqual([true])
    expect(wrapper.emitted().toggle[1]).toEqual([false])
    expect(wrapper.emitted().setting).toBeTruthy()
    expect(wrapper.emitted().input[0]).toEqual(['event'])
    wrapper.destroy()
  })

  it('测试 watch', async() => {
    const wrapper = shallowMount(EtmTabs, {
      localVue,
      propsData: {
        ...props
      }
    })
    wrapper.setProps({
      value: 'test'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTab).toBe('test')
    wrapper.destroy()
  })
})
