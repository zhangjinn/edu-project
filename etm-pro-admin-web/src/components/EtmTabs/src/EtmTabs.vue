<template>
  <div class="EtmTabs-wrap">
    <el-tabs v-model="value" v-on="$listeners">
      <slot />
    </el-tabs>
    <span v-if="show" class="btn" @click="toggle">{{ flag ? '展开筛选': '收起筛选' }} <i :class="[flag ? 'el-icon-arrow-up': 'el-icon-arrow-down']" /></span>

  </div>
</template>

<script>
/**
   *  2020/4/17 15:54
   *  haijinsha
   */
export default {
  name: 'EtmTabs',
  filters: {},
  mixins: [],
  props: {
    value: {
      type: [Object, String],
      default() {
        return ''
      }
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      flag: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    toggle() {
      this.flag = !this.flag
      this.$emit('trigger', this.flag)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmTabs-wrap {
    position: relative;

    .btn {
      position: absolute;
      right: 16px;
      top: 14px;
      font-size: 14px;
      color: $main-color;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
