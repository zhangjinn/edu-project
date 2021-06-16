import { mount, createLocalVue } from '@vue/test-utils'
import EtmForm from '../../../packages/EtmForm/src/EtmForm'

import { Form } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Form)

describe('测试EtmForm组件', () => {
  it('测试挂载slot default', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      slots: {
        default: ['默认slot']
      }
    })
    expect(wrapper.findComponent(Form).text()).toBe('默认slot')
  })

  it('测试表单属性值label-position type=dialog', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'dialog'
      }
    })
    expect(wrapper.findComponent(Form).props('labelPosition')).toBe('left')
  })

  it('测试表单属性值labelWidth type=small', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'small'
      }
    })
    expect(wrapper.findComponent(Form).props('labelWidth')).toBe('168px')
  })

  it('测试表单属性值labelWidth type=big', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'big'
      }
    })
    expect(wrapper.findComponent(Form).props('labelWidth')).toBe('300px')
  })

  it('测试表单属性值labelWidth type=dialog', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'dialog'
      }
    })
    expect(wrapper.findComponent(Form).props('labelWidth')).toBe('120px')
  })

  it('测试$attr', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        demoAttr: '测试$attr'
      }
    })
    expect(wrapper.findComponent(Form).vm.$attrs.demoAttr).toBe('测试$attr')
    //  expect(wrapper.findComponent(Form).attributes('label-position')).toBe('left')
  })

  it('测试$listens', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      listeners: {
        demo() {
          return '测试$listens'
        }
      }
    })
    expect(wrapper.findComponent(Form).vm.$listeners.demo()).toBe('测试$listens')
  })

  it('测试computed "styleObject" type = small', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'small'
      }
    })
    expect(JSON.stringify(wrapper.vm.styleObject)).toBe(JSON.stringify({ labelWidth: '168px', width: '768px', maxWidth: '70%' }))
  })

  it('测试computed "styleObject" type = big', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'big'
      }
    })
    expect(JSON.stringify(wrapper.vm.styleObject)).toBe(JSON.stringify({
      labelWidth: '300px',
      width: '900px',
      maxWidth: '70%'
    }))
  })

  it('测试computed "styleObject" type = dialog', () => {
    const wrapper = mount(EtmForm, {
      localVue,
      propsData: {
        type: 'dialog'
      }
    })
    expect(JSON.stringify(wrapper.vm.styleObject)).toBe(JSON.stringify({
      labelWidth: '120px',
      width: '90%',
      maxWidth: '90%'
    }))
  })
})
