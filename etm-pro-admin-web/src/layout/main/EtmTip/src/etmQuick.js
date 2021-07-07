/**
 * 快速调用弹窗类组件
 */
import Vue from 'vue'
import tip from './EtmTip'

const EtmTipConstructor = Vue.extend(tip)

class Tip {
  constructor() {
    this.tipDom = null
  }
  init(props) {
    const instance = new EtmTipConstructor({
      propsData: props
    })
    this.tipDom = instance.$mount().$el
  }
  open() {
    document.body.appendChild(this.tipDom)
  }
  close() {
    document.body.removeChild(this.tipDom)
  }
}

export default function() {
  Vue.prototype.$etmTip = new Tip()
}

