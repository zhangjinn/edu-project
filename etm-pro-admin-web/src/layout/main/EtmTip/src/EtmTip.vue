<template>
  <div class="etmTip">
    <div class="tipBox">
      <div class="header">
        <i :class="['iconfont ', tipType, type]" />
        <span class="title" v-html="title" />
      </div>
      <div v-if="html" class="body" v-html="html" />
      <div v-else class="body">
        {{ content }}
      </div>
      <div class="footer">
        <el-button :class="type" :type="btnType" @click.stop="confirm">{{ confirmBtn }}</el-button>
        <el-button v-if="cancelBtn" plain @click.stop="cancel">{{ cancelBtn }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'warn'
    },
    title: {
      type: String,
      default: '请传入标题'
    },
    content: {
      type: String,
      default: '请传入提示内容'
    },
    // eslint-disable-next-line vue/require-default-prop
    confirmBtn: {
      type: String,
      default: '确定'
    },
    // eslint-disable-next-line vue/require-default-prop
    cancelBtn: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    confirm: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    cancel: {
      type: Function,
      default() {
        return function() {
        }
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    html: {
      type: String
    }
  },
  computed: {
    tipType() {
      const icon = {
        success: 'iconsuccess',
        warn: 'iconjinggao',
        error: 'iconX'
      }
      return icon[this.type]
    },
    btnType() {
      const btn = {
        success: 'success',
        warn: 'warning',
        error: 'danger'
      }
      return btn[this.type]
    }
  }
}
</script>

<style scoped lang="scss">
.etmTip {
  z-index: 6000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);

  .tipBox {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 30px 20px 65px;
    width: 434px;
    height: min-content;
    min-height: 200px;
    max-height: 560px;
    border-radius: 4px;
    @include bgc_white();

    .header {
      .iconfont {
        font-size: 22px;
        vertical-align: middle;

        &.success {
          @include c_success_color();
        }

        &.warn {
          @include c_warn_color();
        }

        &.error {
          @include c_error_color();
        }
      }

      .title {
        vertical-align: middle;
        font-size: $title-fontSize;
        margin-left: 14px;
        @include c_title_color();
      }
    }

    .body {
      width: 372px;
      min-height: 80px;
      max-height: 420px;
      overflow-y: auto;
      padding-left: 36px;
      margin-top: 16px;
      line-height: 22px;
      font-size: $text-fontSize;
      @include c_text_color();
    }

    .footer {
      position: absolute;
      width: calc(100% - 40px);
      bottom: 14px;

      &::after {
        content: '';
        display: block;
        clear: both;
      }

      .el-button {
        float: right;
        padding: 9px 15px;
        font-size: $text-fontSize;
        border-radius: 3px;

        &.success {
          border: none;
        }

        &.warn {
          border: none;
        }

        &.error {
          border: none;
        }

        &.cancel {
          @include c_white();
          @include bgc_white();
          @include c_secondary_color();
          @include bc_control_color();
        }

        &:hover {
          /*opacity: .7;*/
        }
      }

      .el-button + .el-button {
        margin: 0 8px 0 0;
      }
    }
  }
}

/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1689282 *!*/
/*  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot');*/
/*  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.svg#iconfont') format('svg');*/
/*}*/
</style>
