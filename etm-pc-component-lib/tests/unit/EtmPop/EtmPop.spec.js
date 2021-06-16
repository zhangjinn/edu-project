import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import EtmPop from '../../../packages/EtmPop/src/EtmPop'
// import sinon from 'sinon'

const localVue = createLocalVue()
localVue.directive('throttle', () => {})
localVue.directive('dialogDrag', () => {})
const stubs = ['el-button', 'el-dialog']
describe('EtmPop组件', () => {
  // props
  it('props pop测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      },
      propsData: {
        pop: 'simple',
        title: 'simple1'
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.props().pop).toBe('simple')
  })

  it('props visible测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = mount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      },
      propsData: {
        visible: false
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.visible).toBe(false)
  })

  it('props title测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.title).toBe('请加上标题')
  })

  it('props confirmBtn测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      },
      propsData: {
        confirmBtn: 'OK'
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.confirmBtn.type).toBe(String)
    expect(wrapper.vm.confirmBtn).toBe('OK')
  })

  it('props cancelBtn测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      },
      propsData: {
        cancelBtn: 'NO'
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.cancelBtn.type).toBe(String)
    expect(wrapper.vm.cancelBtn).toBe('NO')
  })

  it('props showConfirmBtn测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.showConfirmBtn.type).toBe(Boolean)
    expect(wrapper.vm.showConfirmBtn).toBeTruthy()
  })

  it('props showCancelBtn测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.showCancelBtn.type).toBe(Boolean)
    expect(wrapper.vm.showCancelBtn).toBeTruthy()
  })

  it('props btnThrottle测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.btnThrottle.type).toBe(Number)
    expect(wrapper.vm.btnThrottle).toBe(1200)
  })

  it('props appendToBody测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.appendToBody.type).toBe(Boolean)
    expect(wrapper.vm.appendToBody).toBeTruthy()
  })

  it('props closeOnClickModal测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.closeOnClickModal.type).toBe(Boolean)
    expect(wrapper.vm.closeOnClickModal).toBeFalsy()
  })

  it('props elementAttributes测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.elementAttributes.type).toBe(Object)
  })

  it('props elementEvents测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.elementEvents.type).toBe(Object)
  })

  it('props confirm测试', () => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.vm.$options.props.confirm.type).toBe(Function)
  })

  // event
  it('event handleCancel测试', async() => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    // const cancel = sinon.spy() // 间谍函数，在.vue里被 this.$emit触发
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }
      // listeners: {
      //   cancel
      // }

    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()
    // expect(wrapper.exists()).toBeTruthy()
    // await wrapper.find('.cancel').trigger('click')
    // expect(cancel.called).toBe(true)

    wrapper.vm.$emit('cancel')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cancel).toBeTruthy()
  })

  it('event handleConfirm测试', async() => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }

    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    wrapper.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().confirm).toBeTruthy()
  })

  it('event handleOpen测试', async() => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }

    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    wrapper.vm.$emit('open')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().open).toBeTruthy()
  })

  it('event handleClose测试', async() => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    const wrapper = shallowMount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      }

    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    wrapper.vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('测试挂载slot', async() => {
    const throttle = jest.fn()
    const dialogDrag = jest.fn()
    // 挂载slots
    const wrapper = mount(EtmPop, {
      stubs,
      directives: {
        throttle,
        dialogDrag
      },
      slots: {
        default: '<div>默认HTML</div>'
      }
    })
    expect(throttle).toHaveBeenCalled()
    expect(dialogDrag).toHaveBeenCalled()

    expect(wrapper.exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.EtmPop').text()).toContain('默认HTML')
  })
})
