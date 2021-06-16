<template>
  <el-dialog
    ref="dialog"
    v-dialogDrag
    v-bind="attributes"
    class="EtmPop"
    :custom-class="attributes.pop"
    top="15vh"
    v-on="events"
  >
    <slot />
    <component :is="attributes.content" />
    <div slot="footer">
      <el-button v-if="showCancelBtn" v-throttle="attributes.btnThrottle" plain @click.stop="handleCancel">
        {{ attributes.cancelBtn }}
      </el-button>
      <el-button v-if="showConfirmBtn" v-throttle="attributes.btnThrottle" type="primary" @click.stop="handleConfirm">
        {{ attributes.confirmBtn }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'EtmPop',
  directives: {
    throttle: {
      inserted(el, binding) {
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            }, binding.value || 1200)
          }
        })
      }
    },
    dialogDrag: {
      bind(el) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        // dialogHeaderEl.style.cursor = 'move';
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'
        dragDom.style.userSelect = 'none'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = (function() {
          if (window.document.currentStyle) {
            return (dom, attr) => dom.currentStyle[attr]
          } else {
            return (dom, attr) => getComputedStyle(dom, false)[attr]
          }
        })()

        dialogHeaderEl.onmousedown = (e) => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop

          const screenWidth = document.body.clientWidth // body当前宽度
          const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

          const dragDomWidth = dragDom.offsetWidth // 对话框宽度
          const dragDomheight = dragDom.offsetHeight // 对话框高度

          const minDragDomLeft = dragDom.offsetLeft
          const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

          const minDragDomTop = dragDom.offsetTop
          const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

          // 获取到的值带px 正则匹配替换
          let styL = sty(dragDom, 'left')
          let styT = sty(dragDom, 'top')

          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if (styL.includes('%')) {
            styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
            styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
          } else {
            styL = +styL.replace(/px/g, '')
            styT = +styT.replace(/px/g, '')
          }

          document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            let left = e.clientX - disX
            let top = e.clientY - disY

            // 边界处理
            if (-(left) > minDragDomLeft) {
              left = -(minDragDomLeft)
            } else if (left > maxDragDomLeft) {
              left = maxDragDomLeft
            }

            if (-(top) > minDragDomTop) {
              top = -(minDragDomTop)
            } else if (top > maxDragDomTop) {
              top = maxDragDomTop
            }

            // 移动当前元素
            dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
          }

          document.onmouseup = function() {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pop: {
      type: String,
      default: 'simple',
      validator(value) {
        return ['simple', 'complex', 'big'].indexOf(value) !== -1
      }
    },
    title: {
      type: String,
      default: '请加上标题'
    },
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    },
    confirmBtn: {
      type: String,
      default: '确定'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    btnThrottle: {
      type: Number,
      default: 1200
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    elementAttributes: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    elementEvents: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    confirm: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    cancel: {
      type: Function
    }
  },
  computed: {
    attributes() {
      const propsArr = ['visible', 'pop', 'title', 'content', 'confirmBtn', 'cancelBtn', 'btnThrottle', 'closeOnClickModal', 'appendToBody']
      const userObj = {}
      propsArr.forEach(v => {
        userObj[v] = this[v]
      })
      return Object.assign({}, userObj, this.elementAttributes, this.$attrs)
    },
    events() {
      const userObj = {
        open: this.handleOpen,
        close: this.handleClose
      }
      return Object.assign({}, userObj, this.elementEvents)
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleOpen() {
      const el = this.$refs.dialog.$el.querySelector('.el-dialog')
      el.style.top = 0
      el.style.left = 0
      this.$emit('open')
    },
    handleConfirm() {
      this.confirm && this.confirm()
      this.$emit('confirm')
    },
    handleCancel() {
      this.cancel && this.cancel()
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/src/etm/pop";
</style>
