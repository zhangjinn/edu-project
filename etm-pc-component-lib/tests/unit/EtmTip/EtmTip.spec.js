import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import EtmTip from '../../../packages/EtmTip/src/EtmTip'

import { Button } from 'element-ui'
import sinon from 'sinon'

const localVue = createLocalVue()
localVue.use(Button)

describe('EtmTip组件', () => {
  it('测试提示是否存在', () => {
    const wrapper = shallowMount(EtmTip, {
      // localVue
      localVue
    })
    expect(wrapper.find('.etmTip').exists()).toBeTruthy()
  })

  it('测试prop类型 error', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        type: 'error'
      }
    })
    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('测试prop类型 warn', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        type: 'warn'
      }
    })
    expect(wrapper.find('.warn').exists()).toBeTruthy()
  })

  it('测试prop类型 success', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        type: 'success'
      }
    })
    expect(wrapper.find('.success').exists()).toBeTruthy()
  })

  it('测试prop标题 "EtmTip标题"', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        title: 'EtmTip标题'
      }
    })
    expect(wrapper.find('.header span').text()).toBe('EtmTip标题')
  })

  it('测试确定按钮文字 "OK啦"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        confirmBtn: 'OK啦'
      }
    })
    expect(wrapper.find('.el-button').text()).toBe('OK啦')
  })

  it('测试取消按钮文字 "不要啦"', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        cancelBtn: '不要啦'
      }
    })
    // console.log(wrapper.find('.etmTip').html())
    expect(wrapper.findAllComponents(Button).at(1).text()).toBe('不要啦')
  })

  it('测试html属性 "<p>这是html内容</p>"', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        html: '<p>这是html内容</p>'
      }
    })
    // console.log(wrapper.find('.etmTip').html())
    expect(wrapper.find('.body').text()).toBe('这是html内容')
  })

  it('测试html属性 "<p>这是text内容</p>"', () => {
    const wrapper = shallowMount(EtmTip, {
      localVue,
      propsData: {
        content: '<p>这是text内容</p>'
      }
    })
    // console.log(wrapper.find('.etmTip').html())
    expect(wrapper.find('.body').text()).toBe('<p>这是text内容</p>')
  })

  it('测试确定事件', async() => {
    const clickHandler = sinon.stub()
    //  const clickHandler = sinon.spy()
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'error',
        confirm: clickHandler
      }
    })
    await wrapper.find('.footer .error').trigger('click')
    setTimeout(() => {
      expect(clickHandler.called).toBe(true)
    }, 250)
  })

  it('测试取消事件', async() => {
    const clickHandler = sinon.stub()
    //  const clickHandler = sinon.spy()
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        cancelBtn: '取消',
        cancel: clickHandler
      }
    })
    await wrapper.findAllComponents(Button).at(1).trigger('click')
    expect(clickHandler.called).toBe(true)
  })

  it('测试compute属性tipType "error"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'error'
      }
    })

    expect(wrapper.vm.tipType).toBe('icon-X')
  })

  it('测试compute属性tipType "success"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'success'
      }
    })

    expect(wrapper.vm.tipType).toBe('icon-success')
  })

  it('测试compute属性tipType "warn"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'warn'
      }
    })

    expect(wrapper.vm.tipType).toBe('icon-jinggao')
  })

  it('测试compute属性btnType "error"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'error'
      }
    })

    expect(wrapper.vm.btnType).toBe('danger')
  })

  it('测试compute属性btnType "success"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'success'
      }
    })

    expect(wrapper.vm.btnType).toBe('primary')
  })

  it('测试compute属性btnType "warn"', () => {
    const wrapper = mount(EtmTip, {
      localVue,
      propsData: {
        type: 'warn'
      }
    })

    expect(wrapper.vm.btnType).toBe('warning')
  })
})
