<template>
  <div class="EtmTitle-wrap">
    <div class="box" :class="[border ? 'bdb': '']">
      <div class="text" :style="{fontSize: fontSize}">
        <slot>{{ title }}</slot>
      </div>
      <div class="tool-btn">
        <slot name="tool" />
        <div v-if="showToggle" @click="toggle">
          <el-button v-if="!show" type="text">{{ openText }} <i
            class="el-icon-arrow-down"
          /></el-button>
          <el-button v-if="show" type="text">{{ closeText }} <i
            class="el-icon-arrow-up"
          /></el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * EtmTitle create by    dengShen
 * createTime   2020/3/16 18:05:15
 */
export default {
  name: 'EtmTitle',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    border: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    /**
     * @deprecated
     * @description 已经不用这个属性了
     */
    showLine: {
      type: Boolean,
      default: true
    },
    showToggle: {
      type: Boolean,
      default: false
    },
    openText: {
      type: String,
      default: '展开筛选'
    },
    closeText: {
      type: String,
      default: '收起筛选'
    },
    size: {
      type: String,
      default: 'small',
      validator(val) {
        return ['big', 'small'].includes(val)
      }
    }
  },
  data() {
    return {
      show: true
    }
  },
  computed: {
    fontSize() {
      const map = {
        big: '16px',
        small: '14px'
      }
      return map[this.size]
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    toggle() {
      this.show = !this.show
      this.$emit('toggle', this.show)
    }
  }
}
</script>

<style lang="scss">
  @import "../../styles/src/etm/title";
</style>
