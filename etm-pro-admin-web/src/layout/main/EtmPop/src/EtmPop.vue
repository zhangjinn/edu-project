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
      <el-button v-if="cancelBtn" v-throttle="attributes.btnThrottle" plain @click.stop="handleCancel">
        {{ attributes.cancelBtn }}
      </el-button>
      <el-button v-throttle="attributes.btnThrottle" type="primary" class="confirm" @click.stop="handleConfirm">
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
    // eslint-disable-next-line vue/require-default-prop
    cancelBtn: {
      type: String,
      default: '取消'
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
.EtmPop {
  .el-dialog {
    @include bgc_white();
    border-radius: 4px;
    margin-bottom: 0!important;
    &.simple {
      width: 480px;
      .el-dialog__body {
        min-height: 115px;
        max-height: 226px;
      }
    }
    &.complex {
      width: 686px;
      .el-dialog__body {
        min-height: 281px;
        max-height: calc(70vh - 139px);
      }
    }
    &.big {
      width: 1000px;
      .el-dialog__body {
        min-height: 421px;
        max-height: calc(70vh - 139px);
      }
    }
    .el-dialog__header {
      height: 55px;
      padding: 19px 24px 20px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      @include bc_divide_color();
      .el-dialog__title {
        @include c_title_color();
        font-size: $title-fontSize;
        font-weight: 400;
        line-height: 1;
      }
      .el-dialog__headerbtn {
        top: 16px;
        &:hover .el-dialog__close, &:focus .el-dialog__close {
          @include c_main_color();
        }
      }
    }
    .el-dialog__body {
      margin-top: 24px;
      padding: 0 24px 0;
      overflow: auto;
    }
    .el-dialog__footer {
      // position: absolute;
      // bottom: 0;
      // right: 0;
      width: 100%;
      padding: 14px 24px 14px;
      // border-top: 1px solid;
      // @include bc_divide_color();
      .el-button {
       /* font-size: $text-fontSize;
        border-radius: 2px;
        &:hover {
          opacity: 0.7;
        }*/
      }
      .el-button+.el-button {
        margin-left: 8px;
      }
    }
  }
  .confirm {
    //@include bgc_main_color();
    //@include bc_main_color();
  }
  .cancel {
    /*@include bgc_white();
    @include c_secondary_color();
    @include bc_control_color();*/
    margin-right: -6px;
  }
}
</style>
