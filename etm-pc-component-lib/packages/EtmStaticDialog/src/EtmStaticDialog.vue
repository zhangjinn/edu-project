<template>
  <transition name="fade">
    <div v-if="visible" v-clickoutside="close" class="EtmStaticDialog-wrap" :style="{left:left,top:top}">
      <slot />
    </div>
  </transition>
</template>

<script>
/**
 * EtmStaticDialog create by haijinsha
 * createTime 2020/8/24 13:49
 */

import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'EtmStaticDialog',
  directives: {
    Clickoutside
  },
  components: {},
  filters: {},
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    target: {
      type: [Object, MouseEvent, Event],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      visibility: this.visible,
      left: 0,
      top: 0
    }
  },
  computed: {},
  watch: {
    target: {
      handler(val) {
        this.$nextTick(() => {
          if (!val.target) {
            return false
          }
          let event = val.target
          while (event.nodeName !== 'BUTTON') {
            event = event.parentElement
          }
          if (event.nodeName !== 'BUTTON') {
            console.error('请使用按钮调用! ', event)
          }
          this.left = event.offsetLeft + 'px'
          this.top = event.offsetTop + event.clientHeight + 8 + 'px'
          this.$emit('update:visible', true)
        })
      },
      immediate: true,
      deep: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    close: function(e) {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style>
  @import "../../styles/src/etm/staticDialog.scss";
</style>
