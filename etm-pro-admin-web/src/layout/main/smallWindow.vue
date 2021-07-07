<template>
  <div>
    <el-dialog
      :title="titleText"
      :visible="visible"
      :close-on-click-modal="false"
      :append-to-body="append"
      :width="windowWidth"
      class="smallWindow"
      @close="handleClose"
      @open="handleOpen"
    >
      <slot />
      <div slot="footer">
        <el-button v-throttle="throttle" type="primary" @click.stop="handleClick">
          {{ this.btn }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SmallWindow',
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
  props: ['visible', 'title', 'btnText', 'width', 'btnThrottle', 'appendToBody'],
  computed: {
    titleText() {
      return this.title ? this.title : '这里是标题'
    },
    btn() {
      return this.btnText ? this.btnText : '确定'
    },
    throttle() {
      return this.btnThrottle ? +this.btnThrottle : 1200
    },
    windowWidth() {
      return this.width ? this.width : '40%'
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
    handleClick() {
      this.$emit('btnClick')
    }
  }
}

</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .smallWindow {
    .el-dialog {
      @include bgc_white();
      border-radius: 5px;
      .el-dialog__header {
        height: 50px;
        padding: 14px 20px 10px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-radius: 5px 5px 0 0;
        @include bc_borderColorBase();
        //@include bg_smallWindow();
        .el-dialog__title {
          font-size: $title-font-size;
          //@include c_themeColor();
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
        height: 370px;
        padding: 16px 24px;
        overflow: auto;
      }
      .el-dialog__footer {
        border-radius: 0 0 5px 5px;
      }
    }
  }
</style>
