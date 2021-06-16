<template>
  <div class="EtmTabs-wrap">
    <el-tabs
      v-model="currentTab"
      :class="['etm-tabs', show ? 'show': '']"
      v-bind="$attrs"
      v-on="$listeners"
      @tab-click="tabClick"
    >
      <slot transition="expand" />
    </el-tabs>
    <div class="tool">
      <slot name="tool" />
      <el-button v-if="setting" type="text" class="setting" @click="appSetting">{{ settingText }}</el-button>
      <div v-if="showToggle" @click="toggle">
        <el-button v-if="show" type="text">{{ openText }} <i class="el-icon-arrow-up" /></el-button>
        <el-button v-if="!show" type="text">{{ closeText }} <i class="el-icon-arrow-down" /></el-button>
      </div>
    </div>
  </div>
</template>

<script>/**
 *  2020/4/24 11:49
 *  haijinsha
 */

export default {
  name: 'EtmTabs',
  filters: {},
  mixins: [],
  props: {
    value: {
      type: String,
      default: ''
    },
    setting: {
      type: Boolean,
      default: false
    },
    elAttrs: {
      type: Object,
      default() {
        return {}
      }
    },
    settingText: {
      type: String,
      default: '应用设置'
    },
    openText: {
      type: String,
      default: '收起筛选'
    },
    closeText: {
      type: String,
      default: '展开筛选'
    },
    showToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true,
      currentTab: this.value
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.currentTab = val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    toggle(event) {
      this.show = !this.show
      this.$emit('toggle', this.show)
    },
    appSetting() {
      this.$emit('setting')
    },
    tabClick() {
      // this.show = true
      // this.$emit('toggle', true)
      this.$emit('input', this.currentTab)
    }
  }
}
</script>

<style lang="scss">
    @import "../../styles/src/etm/tabs";
</style>
