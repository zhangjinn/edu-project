<template>
  <div class="etmTip">
    <div class="tipBox">
      <div class="header">
        <i :class="['iconfont', tipType, type]" />
        <span class="title" v-html="title" />
      </div>
      <div v-if="html" class="body" v-html="html" />
      <div v-else class="body">
        {{ content }}
      </div>
      <div class="footer">
        <el-button v-debounce="confirm" :class="type" :type="btnType">{{ confirmBtn }}</el-button>
        <el-button v-if="cancelBtn" :class="['cancel-tip', type]" plain @click.stop="cancel">{{ cancelBtn }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EtmTip',
  directives: {
    debounce: {
      bind(el, binding, vnode) {
        const debounce = (func, delay) => {
          let timer = null
          return function() {
            const context = vnode.context
            const args = arguments

            clearTimeout(timer)
            timer = setTimeout(function() {
              func.apply(context, args)
            }, delay)
          }
        }
        el.addEventListener('click', debounce(binding.value, 180))
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'warn',
      validator(value) {
        return ['success', 'warn', 'error'].indexOf(value) !== -1
      }
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
        return function() {}
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
        success: 'icon-success',
        warn: 'icon-jinggao',
        error: 'icon-X'
      }
      return icon[this.type]
    },
    btnType() {
      const btn = {
        success: 'primary',
        warn: 'warning',
        error: 'danger'
      }
      return btn[this.type]
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/src/etm/themes/themeConfig";
@import "../../styles/src/etm/tip";
@import "./iconfont/iconfont.css";
</style>
