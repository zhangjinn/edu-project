import { createLocalVue, mount } from '@vue/test-utils'
import EtmDrawer from '../../../packages/EtmDrawer/src/EtmDrawer'
import { Drawer } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Drawer)
describe('EtmDrawer组件', () => {
  it('测试slot', async() => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        visible: true
      },
      slots: {
        default: ['测试']
      }
    })
    await wrapper.vm.$nextTick()
    // console.log(wrapper.findComponent(Drawer).html())
    expect(wrapper.findComponent({ ref: 'elDrawer' }).text()).toBe('测试')
  })
  // it('测试span style zIndex', async() => {
  //   const wrapper = mount(EtmDrawer, {
  //     localVue,
  //     propsData: {
  //       visible: true,
  //       showClose: true,
  //       zIndex: 500
  //     }
  //   })
  //   await wrapper.vm.$nextTick()
  //   // console.log(wrapper.find('.close').html())
  //   expect(wrapper.find('.close').attributes('style')).toBe('z-index:500')
  // })
  it('测试span class type=small', async() => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        visible: true,
        showClose: true,
        type: 'small'
      }
    }
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.close').classes()).toContainEqual('close--small')
  })
  it('测试span class type=big', async() => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        visible: true,
        showClose: true,
        type: 'big'
      }
    }
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.close').classes()).toContainEqual('close--big')
  })
  it('测试span close事件', async() => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        visible: true,
        showClose: true
      }
    })
    wrapper.vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().close).toBeTruthy()
  })
  it('测试$attr', () => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        demoAttr: '测试$attr'
      }
    })
    expect(wrapper.findComponent({ ref: 'elDrawer' }).vm.$attrs.demoAttr).toBe('测试$attr')
  })
  it('测试elDrawer size=big', () => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        type: 'big'
      }
    })
    expect(wrapper.findComponent({ ref: 'elDrawer' }).vm.size).toBe('980px')
  })
  it('测试elDrawer size=small', () => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        type: 'small'
      }
    })
    expect(wrapper.findComponent({ ref: 'elDrawer' }).vm.size).toBe('420px')
  })
  it('测试span showClose=true', async() => {
    const wrapper = mount(EtmDrawer, {
      localVue,
      propsData: {
        visible: true,
        showClose: true
      }
    }
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.close').exists()).toBeTruthy()
  })
})
