<template>
  <div class="fullWindow">
    <el-dialog
      :visible="visible"
      :show-close="false"
      :append-to-body="appendToBody"
      fullscreen
      @close="handleClose"
      @open="handleOpen"
    >
      <div slot="title" class="header">
        <div class="title">
          {{ this.titleText }}
        </div>
        <div class="controlBtn">
          <el-button v-throttle="throttle" type="primary" class="return" @click.stop="handleCancel">{{ this.cancelText }}</el-button>
          <el-button v-throttle="throttle" type="primary" @click.stop="handleConfirm">{{ this.confirmText }}</el-button>
        </div>
      </div>
      <slot />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FullWindow',
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
  props: ['visible', 'title', 'confirmBtnText', 'cancelBtnText', 'btnThrottle', 'appendToBody'],
  computed: {
    titleText() {
      return this.title ? this.title : '这里是标题'
    },
    confirmText() {
      return this.confirmBtnText ? this.confirmBtnText : '确定'
    },
    cancelText() {
      return this.cancelBtnText ? this.cancelBtnText : '返回'
    },
    throttle() {
      return this.btnThrottle ? +this.btnThrottle : 1200
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleOpen() {
      this.$emit('open')
    },
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .fullWindow {
    .el-dialog.is-fullscreen {
      @include bgc_backgroundColorDefault();
      .el-dialog__header {
        display: flex;
        position: fixed;
        z-index: 10;
        top: 0;
        align-items: center;
        height: 8.88vh;
        width: 100vw;
        padding: 0;
        @include bgc_white();
        .header {
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          width: 70.8%;
          .title {
            font-size: $title-font-size;
            @include c_themeColor();
            font-weight: bold;
            line-height: 33px;
          }
          .controlBtn {
            .el-button+.el-button {
              margin-left: 10px;
            }
            .return {
              @include c_colorTextRegular();
              @include bgc_white();
              @include bc_borderColorBase();
            }
          }
        }
      }
      .el-dialog__body {
        width: 70.8%;
        min-height: calc(91.12vh - 32px);
        overflow: auto;
        padding: 24px;
        margin: calc(8.88vh + 16px) auto 16px;
        border-radius: 4px;
        @include bg_fullWindow();
      }
    }
  }
</style>
