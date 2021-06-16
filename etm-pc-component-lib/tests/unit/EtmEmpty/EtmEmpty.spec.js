import { mount } from '@vue/test-utils'
import EtmEmpty from '../../../packages/EtmEmpty/src/EtmEmpty'

describe('EtmEmpty组件', () => {
  // 测试props
  it('测试props', async() => {
    // 挂载props
    const wrapper = mount(EtmEmpty, {
      propsData: {
        // emptyText: '空'
        image: '111'
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.props('emptyText')).toEqual('暂无数据')
    expect(wrapper.find('.text').text()).toEqual('暂无数据')

    expect(wrapper.vm.$data.placeholderImage).toEqual('111')
    expect(wrapper.find('.img img').attributes('src')).toEqual('111')
  })
})
