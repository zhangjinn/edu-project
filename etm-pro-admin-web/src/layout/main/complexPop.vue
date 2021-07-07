<template>
  <div>
    <el-dialog
      :title="titleText"
      :visible="visible"
      :close-on-click-modal="false"
      :append-to-body="append"
      class="singlePop"
      @close="handleClose"
      @open="handleOpen"
    >
      <slot />
      <div slot="footer">
        <el-button v-if="cancelBtn" v-throttle="throttle" class="cancel" @click.stop="handleCancel">
          {{ this.cancelBtn }}
        </el-button>
        <el-button v-throttle="throttle" type="primary" @click.stop="handleConfirm">
          {{ this.confirmBtn }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SinglePop',
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
  props: ['visible', 'title', 'confirmBtn', 'cancelBtn', 'btnThrottle', 'appendToBody'],
  computed: {
    titleText() {
      return this.title ? this.title : '这里是标题'
    },
    throttle() {
      return this.btnThrottle ? +this.btnThrottle : 1200
    },
    append() {
      if (this.appendToBody === undefined) {
        return true
      } else {
        return this.appendToBody
      }
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
  .singlePop {
    .el-dialog {
      @include bgc_white();
      width: 756px;
      height: 540px;
      margin-top: 10vh!important;
      border-radius: 2px;
      .el-dialog__header {
        height: 50px;
        padding: 14px 20px 10px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        @include bc_borderColorBase();
        .el-dialog__title {
          font-size: $title-font-size;
          @include c_colorTextPrimary();
          font-weight: bold;
        }
        .el-dialog__headerbtn {
          top: 16px;
          &:hover .el-dialog__close, &:focus .el-dialog__close {
            @include c_themeColor();
          }
        }
      }
      .el-dialog__body {
        padding: 16px 24px;
        overflow: auto;
      }
      .el-dialog__footer {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .cancel {
        @include bgc_white();
        @include bc_borderColorBase();
        @include c_colorTextSecondary();
        margin-right: -6px;
    }
  }
</style>
